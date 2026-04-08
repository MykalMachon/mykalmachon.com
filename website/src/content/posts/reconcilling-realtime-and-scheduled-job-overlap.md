---
pubDate: 2026-02-12
title: Reconcilling realtime and scheduled job overlap
description: a nerdy blog post about wrangling async workflows
type: post
draft: true
tags: ['tech']

---


I worked on a pretty large scale realtime integration project at work recently and ran into a bit of an interesting problem. I figured I'd document my process in figuring it out for future reference here for future reference and as a way to internalize the learnings.&#x20;

## Some background

For the sake of this example, let's imagine you work at a fictional online course platform that teaches people how to code. You've historically operated in person only, but you just brought on a new online course platform, and you need to figure out how to get data out of your existing infrastructure into this new app.

Your existing infrastructure, **your source system,** is mostly a single monolithic application that handles the majority of your business needs; it allows your users to edit their personal information, change their billing info, change their subscription tier, and buy individual things from your shop. Your staff set everything up in here and has been for years. The core system was built in the 90s, but there are some semi-modern tack-ons you can use, like a read-only API and a change event subscription system.&#x20;

The other system, **your destination system**, is an off-the-shelf video course platform. A fresh instance has no information about your users, how your offerings are structured, what permissions you'll need, or what user's should be enrolled in what offerings. But it offers primitives to build courses with assignments, grade submission, and really deep permissions systems. This system has a full OAuth API with scopes and permissions that make it so you can fully configure the product programmatically.&#x20;

So the problem is, you want all your data to be synced from your source system to your destination system in near-realtime. Shouldn't be too bad! You and your team decide to do this with a two-pronged approach.

### Realtime events

Your source system's change event subscription system allows you to send events to external systems when data you are interested in has changed. This is awesome, it lets you get near instant notifications when things have changed in your source system, queue them up in order, and have an integration service handle the changes as they come in.

Everything seems great until...   &#x20;

### Scheduled reconciliation syncs

Remember how I said your source system was built in the 90s and has some *tacked-on modern features?*  Turns out, the change notification system fails to deliver \~1% of the changes. No big deal, you knew this going in, so you made another system that would run every hour and resync everything between the two systems. Essentially, these are just scheduled jobs that run each hour,  grab all the data that needs to be synced, and enqueue the same job that a real-time change would for each resource/sync type. &#x20;

This is also useful if someone accidentally screws something up in the course platform, too. Accidentally unenrolled yourself from a course? No problem! The reconciliation sync is constantly trying to reconcile your destination system to look like the data in your source system; simple self-healing!

### Organizing your job queues&#x20;

To keep all of this organized and as DRY as possible, you set up a bunch of job queues. You have one queue for each type of event you expect to receive and write idempotent functions to handle syncing each data type into your course platform:&#x20;

* user-enroll: enrolls users into their courses&#x20;
* user-unenroll: unenrolls users into their courses&#x20;
* user-import: imports users into the system and provisions any related resources&#x20;
* course-import: imports courses into the system and provisions any related resources&#x20;

For realtime you have a single ingest queue:&#x20;

* realtime-ingest: handles incoming events and routes them to the correct&#x20;

then for your reconciliation syncs, you set up a simple "load" job for each type of data you want to reconcile&#x20;

* sync-users: loads all user state and drops each user record into the appropriate queue
* sync-courses: loads all current courses and queues them for import
* sync-enrollments: loads all course enrollment records and enqueues enroll/unenroll jobs
* etc, etc  &#x20;

## Sounds great! What's the problem?

I thought so too- everything looked good with synthetic workloads. But when we shipped to production and started seeing a few million job executions per day, some glaring issues started showing up in Grafana and in our actual sync results.&#x20;

Let's walk through a few scenarios:&#x20;

## Race conditions&#x20;

Imagine a scheduled reconciliation kicks off for course enrollment. When the reconciliation starts, it grabs all of the user records and enqueues all the enroll/unenroll events. While that reconciliation is running, a student, Ada, unenrolls from their course, and the real-time event comes in and gets processed immediately. 3 minutes later, the enqueued enrollment job comes off the queue, and Ada is re-enrolled in their course… whoops!   &#x20;

## API inefficiency and rate limiting&#x20;

Imagine you have a new course registration window open up, and a couple of hundred people register in a few minutes, sweet! It all gets dealt with. 2 minutes later, the reconciliation jobs run and immediately have to revalidate that those students, who we can logically assume are already registered, get jobs enqueued, and we waste 3-4 API requests of our rate limit budget on verifying they're already enrolled.&#x20;

This is a generous case. In practice, we were seeing huge waste in our reconciliation jobs. Over 90% result in no action from the jobs, just ean xtra load on the source and destination APIs for no added benefit. With production data, it got to the point where big reconcillations would take over an hour to run!&#x20;

yikes!

## Fixing things with Redis caching + locks&#x20;

After some whiteboarding, the most elegant solution I could think of for this was using a mixture of locks for *all* job types, not just the obvious race condition risks, and cache records that use a combination key of the job type and any primary related data

### How does caching help here?&#x20;

This isn't necessarily traditional caching, but more like a recency lookup. We use keys that are unique for each operation by nature.&#x20;

Say you're syncing *an enrollment event* of a *user with the id of abc* into *a course with an id 123*? Your cache key would be: `cache.user-enroll.123.abc` and the value is the time of the last successful completion.&#x20;

Here's a simplified example of what an actual handler function might look like using this pattern

```typescript
import { uuidv7 } from "uuidv7";
import { ENROLLMENT_TTL_BASE, ENROLLMENT_TTL_JITTER } from '@integration/config';

const handleEnrollment = async (event: EnrollmentEvent, deps: JobDeps) => {
  const { userId, courseId, eventType, eventTime } = event;
  const { cache, logger } = deps;

  const cacheKey = cache.getCacheKey('cache', eventType, userId, courseId);
  const recordInCache = await cache.get(cacheKey); 
  if (recordInCache) { 
    logger.info('exiting early; item in cache', {cacheKey});
    return;
  }

  const similarCacheItems = await cache.getSimilar(cacheKey);
  const eventsProcessedAfterThis = similarCacheItems.filter((item) => new Date(item.value) > new Date(eventTime));
  if (eventsProcessedAfterThis.length > 0) {
    logger.info('exiting early; already processed records older than this one', {cacheKey, newerEvents: eventsProcessedAfterThis});
    return; 
  }

  // REGULAR SYNC JOB STUFF HERE 
  // this is where all the busines logic goes

  const ttl = cache.generateTTL(ENROLLMENT_TTL_BASE, ENROLLMENT_TTL_JITTER);
  await cache.set({key: cacheKey, value: eventTime, ttl: ttl});
  logger.info('job completed; record persisted in cache', {cacheKey});
};
```

#### Why not use a static TTL for cache expiry?

If we would have used a static TTL all of our cached records would expire at the same time, and on that next reconcillation run we would have a thundering herd problem, a **massive** chunk of items would have to be revalidated at the same time and our jobs would slow down to a crawl, this would be exactly like our initial approach but worse because there would be a long period where almost nothing was getting reconcilled at all.&#x20;

By introducing jitter, we go from TTL on our cached records looking like:&#x20;

```
RECORD-1 TTL: 4 hours
RECORD-2 TTL: 4 hours
RECORD-3 TTL: 4 hours
```

to being variable like:&#x20;

```
RECORD-1 TTL: 2 hours
RECORD-2 TTL: 4 hours
RECORD-3 TTL: 5 hours
```

This distributes expiry and also load, evenly so that one reconciliation job is always checking a small subset of the records. In practice, we found that around \~15-30% of our records are validated each run.&#x20;

#### A Possible Gotcha: Cache by action, not by record&#x20;

To prevent stale data from blocking new updates, our caching strategy is tied to the *action* (the state change) and the datetime of the change in the system of record, not just the ID of the underlying record being reconciled.&#x20;

For example, while there is technically only one registration record per student/course pair, we split that record onto different queues based on its current state (like `registered`, `waitlisted`, or `unenrolled`). Because our cache keys are built using both the queue type and the specific action, an 'enroll' event and an 'unenroll' event for the same student have completely separate cache lifecycles. This ensures a recent enrollment doesn't accidentally block a subsequent unenrollment during a reconciliation run.

#### Why do you care about the datetime of the change?&#x20;

Let's go back to our race condition example. By adding a datetime, we can ensure that we're not processing a stale event. If there are items in the cache with a changed at time that is after the current event we're processing, we can assume that the record is stale and return early.&#x20;

## Why do you need locks? Aren't you already using them

Yes, we were already using locks to some degree, but we were using them for things like user creation, where race conditions can be an issue regardless of how jobs sit in the queue. The major change here is that we're using locks on the cache key so that items triggered by a real-time event don't conflict with items in a reconciliation.

If you create mutually exclusive locks on the cache key, you can't have conflicts or race conditions. This is a pretty simple fix, but by generalizing the use of locks to all queue/job types, you can ensure that you don't have conflicts across all types of work.

The major difference for locking is that your locks should be on all work triggered by a given source record, not based on the action taken on that record, as we showed above in the caching example. You want to lock on all enrollment events for a given user and section, not just a specific enrollment event type.

Let's update our code to showcase this- we'll just use our existing cache class for a simple locking mechanism:&#x20;

```typescript
import { ENROLLMENT_TTL_BASE, ENROLLMENT_TTL_JITTER, ENROLLMENT_LOCK_TTL } from '@integration/config';

const handleEnrollment = async (event: EnrollmentEvent, deps: JobDeps) => {
  const { userId, courseId, eventType, eventTime } = event;
  const { cache, logger } = deps;

  // Lock is scoped to the source record only (user + section), not the action.
  // this means realtime and reconciliation jobs for the same enrollment can't conflict.
  const lockKey = cache.getCacheKey('lock', userId, courseId);
  const lock = await cache.get(lockKey);
  if (lock) {
    logger.info('exiting early; lock exists for this record', { lockKey });
    return;
  }
  // will get lock here OR wait until it can get the lock / time out
  await cache.set({ key: lockKey, value: true, ttl: ENROLLMENT_LOCK_TTL });

  const cacheKey = cache.getCacheKey('cache', eventType, userId, courseId);
  const recordInCache = await cache.get(cacheKey);
  if (recordInCache) {
    logger.info('exiting early; item in cache', { cacheKey });
    return;
  }

  const similarCacheItems = await cache.getSimilar(cacheKey, ['cache', userId, courseId]);
  const eventsProcessedAfterThis = similarCacheItems.filter(
    (item) => new Date(item.value) > new Date(eventTime)
  );
  if (eventsProcessedAfterThis.length > 0) {
    logger.info('exiting early; already processed records older than this one', {
      cacheKey,
      newerEvents: eventsProcessedAfterThis,
    });
    return;
  }

  // REGULAR SYNC JOB STUFF HERE

  const ttl = cache.generateTTL(ENROLLMENT_TTL_BASE, ENROLLMENT_TTL_JITTER);
  await cache.set({ key: cacheKey, value: eventTime, ttl });
  logger.info('job completed; record persisted in cache', { cacheKey });

  // delete the lock key in the cache to release the lock
  await cache.delete(lockKey);
};
```

One important thing to note with the "cache as a lock" pattern above: two jobs could technically both check for the lock at the same time, both find nothing, and both move on happily with their little lives

We're using Redis for our cache and locking backend, which supports this natively via `SET NX` (set-if-not-exists). Our cache abstraction wraps this so that `cache.set` on a lock key is always atomic, meaning only one job will ever successfully acquire the lock. If it can't acquire the lock, it will wait (promise won't resolve) until it can or timeout and throw an error.&#x20;

## The results

After making these changes, we saw huge changes in our "large" reconciliation job times and our error rates, resulting in a much quicker sync in for dropped realtime events and a reduced support burden for our teams.&#x20;

Some examples of improved metrics:

* A full reconciliation job for enrollment went from taking around 30 minutes to run, down to an average of 78 seconds.&#x20;
* We have received 0 tickets due to stale jobs and race conditions since shipping these changes to production.&#x20;
* We no longer constantly bounce off the rate limiter in our connecting APIs, averaging around 60% usage during reconciliation windows.  &#x20;

