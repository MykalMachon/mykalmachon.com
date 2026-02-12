---
pubDate: 2026-02-12
title: Reconcilling realtime and scheduled job overlap
description: a nerdy blog post about wrangling async workflows
type: post
draft: true
tags:
  - Typescript
  - Redis
  - Workflows
---
I worked on a pretty large scale realtime integration project at work recently and ran into a bit of an interesting problem. I figured I'd document my process in figuring it out for future reference here for future reference and as a way to internalize the learnings.&#x20;

## Some background

For the sake of this example, let's imagine you work at a fictional online course platform that teaches people how to code. You've historically operated in person only but you just brought on a new online course platform but you need to figure out how to get data out of your existing infrastructure into this new app.

Your existing infrastructure, **your source system,** is mostly a single monolothic application that handles the majority of your business needs; it allows your users to edit their personal information, change their billing info, change their subscription tier, and buy individual things from your shop. Your staff set everything up in here and have been for years. The core system was built in the 90s but there are some semi-modern tack-ons you can use like a read-only API and an change event subscription system.&#x20;

The other system, **your destination system**, is an off-the-shelf video course platform. A fresh instance has no information about your users, how your offerings are structured, what permissions you'll need, or what user's should be enrolled in what offerings. But it offers primitives to build courses with assignments, grade submission, and really deep permissions systems. This system has a full OAuth API with scopes and permissions that makes it so you can fully configure the product programmatically.&#x20;

So the problem is, you want all your data to be synced from your source system to your destination system in near realtime. Shouldn't be too bad! You and your team decide to do this with a two pronged approach.

### Realtime events

Your source system's change event subscription system allows you to send events to external systems when data you are interested in has changed. This is awesome, it lets you get near instant notifications when things have changed in your source system, queue them up in order, and have an integration service handle the changes as they come in.

Everything seems great until...   &#x20;

### Scheduled reconcilliation syncs

Remember how I said your source system was built in the 90s and has some *tacked on modern feature?*  Turns out, that the change notification system fails to deliver \~1% of the changes. No big deal, you knew this going in, so you made another system that would run each hour and resync everything between the two systems. Essentially these are just scheduled jobs that run each hour,  grab all the data that needs to be synced, and enqueues the same job that a realtime change would for each resource / sync type. &#x20;

This is also useful if someone accidentally screws something up in the course platform too. Accidentally unenrolled yourself from a course? no problem! The reconcillation sync is constantly trying to reconcile your destination system to look like the data in your source system; simple self-healing!

### Organizing your job queues&#x20;

To keep all of this organized and as DRY as possible you setup a bunch of job queues. You have one queue for each type of event you expect to recieve and write idemptotent functions to handle syncing each data type into your course platform:&#x20;

* user-enroll: enrolls users into their courses&#x20;
* user-unenroll: unenrolls users into their courses&#x20;
* user-import: imports users into the system and provisions any related resouces&#x20;
* course-import: imports courses into the system and provisions any related resources&#x20;

For realtime you have a single ingest queue:&#x20;

* realtime-ingest: handles incoming events and routes them to the correct&#x20;

then for your reconcillation syncs, you setup a simple "load" job for each type of data you want to reconcile&#x20;

* sync-users: loads all user state and drops each user record into the approriate queue
* sync-courses: loads all current courses and queues them for import
* sync-enrollments: loads all course enrollment records and enqueues enroll/unenroll jobs
* etc, etc  &#x20;

## Sounds great! what's the problem?

I thought so too- everything looked good with synthetic workloads. But when we shipped to production and started seeing a few million job executions per day, some glaring issues starting showing up in Grafana and in our actual sync results.&#x20;

Let's walk through a few scenarios:&#x20;

## Race conditions&#x20;

Imagine a scheduled reconcilliation kicks off for course enrollment, when the reconcilliation starts, it grabs all of the user records and enqueues all the enroll/unenroll events. While that reconcilliation is running, a student, ada, unenrolls from their course and the realtime event comes in and gets processed immediately. 3 minutes later, the enqueued enrollment job comes off the queue and ada is re-enrolled in their course… whoops!   &#x20;

## API inneficiency and rate limiting&#x20;

Imagine you have a new course registration window open up, a couple hundred people register in a few minutes, sweet! it all get's dealt with. 2 minutes later, the reconcilliation jobs run and immediately have to revalidate that those students, who we can logically assume are already registered, get jobs enqueued and we waste 3-4 API requests of our rate limit budget on verifying they're already enrolled.&#x20;

This is a generous case. In practice, we were seeing huge waste in our reconcilliation jobs. Over 90% result in no action from the jobs, just extra load on the source and destination APIs for no added benefit. With production data it got to the point where big reconcillations would take over an hour to run!&#x20;

yikes!

## Fixing things with Redis caching + locks&#x20;

After some whiteboarding the most elegant solution I could think of for this was using a mixture of locks for *all* job types, not just the obvious race condition risks, and cache records that use a combination key of the job type and any primary related data

### How does caching help here?&#x20;

This isn't neccesarily traditional caching, but more like a recency lookup. We use keys that are unique for each operation by nature.&#x20;

Say you're syncing *an enrollment event* of a *user with the id of abc* into *a course with an id 123*? your cache key would be: `cache.user-enroll.123.abc` and the value is the time of the last successful completion.&#x20;

Here's a simplified example of what an actual handler function might look like using this pattern

```typescript
import { uuidv7 } from "uuidv7";
import { ENROLLMENT_TTL_BASE, ENROLLMENT_TTL_JITTER } from '@integration/config';

const handleEnrollment = async (event: EnrollmentEvent, deps: JobDeps) => {
  // destructure event information and deps
  const { userId, courseId, eventType } = event;
  const { cache, logger } = deps;

  // create a cache key 
  const cachekey = cache.getCacheKey('cache', eventType, userId, courseId);
  const recordInCache = await cache.get(cacheKey); 
  if (recordInCache) { 
    logger.info('exiting early; item in cache', {cacheKey});
    return;
  }

  // REGULAR SYNC JOB STUFF HERE 
  // this is where all the busines logic goes

  // after a successful sync, store an item in the cache
  const now = new Date().toDateTimeString()
  const ttl = cache.generateTTL(ENROLLMENT_TTL_BASE, ENROLLMENT_TTL_JITTER);
  await cache.set({key: cacheKey, value: now, ttl: ttl});
  logger.info('job completed; record persisted in cache', {cacheKey});
};
```

Another point, why use a non-static TTL for expiry? if we would have used a static TTL all of our cached records would expire at the same time, and on that next reconcillation run we would have a thundering herd problem, a **massive** chunk of items would have to be revalidated at the same time and our jobs would slow down to a crawl, this would be exactly like our initial approach but worse because there would be a long period where almost nothing was getting reconcilled at all.&#x20;

By introducing jitter we go from TTL on our cached records looking like:&#x20;

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

This distributes expiry, and also load, evenly so that one reconcillation job is always checking a small subset of the records. In practice, we found around \~15-30% of our records are validated each run.&#x20;

## Why do you need locks? aren't you already using them

Yes, we were already using locks to some degree but we were using them for things like user creation or&#x20;
