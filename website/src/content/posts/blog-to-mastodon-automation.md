---
title: Blog to Mastodon automation
description: I used pipedream to automatically cross-post my content out to Mastodon.
type: note
pubDate: 2023-04-06
tags: ['webdev']
draft: false
---

I just built a little "job" or "process" that monitors this site's RSS feed, and posts all new entries to my Mastodon account. So when I make a post here, it automatically gets syndicated out to Mastodon! 

Typically, I would build this all out from scratch (in the name of learning, of course!) and spend a whole afternoon on it, maybe even two or three afternoons if I'm being honest with myself. This time, I wanted to take it easy on myself, and try using a tool I heard about awhile ago in the Shop Talk show discord, [Pipedream](https://pipedream.com/).

## What's Pipedream

Pipedream is an integration platform, that seems to be targeting the developer crowd. Think of Zapier with all of it's pre-built third-party connections (Facebook, Twitter, SendGrid, Postgres...) and it's easy drag and drop interface. Now imagine that _again_ with a developer slant, and the ability to add in Node.js/Python/Go "middleware", proper error logging, and more developer goodies. That's pipdeream! 

I've been sold this type of tool a lot before and was honestly pretty skeptical at first. That said, after messing around with it for awhile, it seems pretty solid for your basic workflows and jobs.

## How does the integration work.

All things considered, it's a pretty simple process. I created a new "Workflow" in pipdeream and selected the "RSS" trigger. A "workflow" in pipedream maps to a job or process, and a trigger is what, well, "triggers" that job to run. I choose the "RSS" trigger, and pointed it at my RSS feed so it can to listen for new items and trigger the workflow when it detects them. 

![photo of the pipedream UI; editing the RSS trigger as described above.](https://res.cloudinary.com/mykalcodes/image/upload/v1680844778/iaw9nfadjoih1qmkvqai.png)

Then I added a "Node.js" step: this reads in some data from new item that triggered the workflow, and determines the post "type" based on the URL. It then returns that "type" so I can use it later in my post.

![photo of the pipedream UI; editing the node processing step as described above.](https://res.cloudinary.com/mykalcodes/image/upload/v1680844852/u99ekzavlnkdxui6xief.png)

Finally you've got a "Mastodon" step that handles authenticating into my Mastodon instance, and sending the "toot" for me.

![pipedream UI for managing the mastodon step for posting. ](https://res.cloudinary.com/mykalcodes/image/upload/v1680845138/z16rleff7tffdtvdgxcp.png)

After you've got that configured, all you need to do is click a little "test" or "deploy" button and you're done! easy as that.

## Aside: Tentative pipedream review and other ideas

From what I can tell, that's sort of _all_ I have to do to get blog to mastodon cross posting working.

_and I did it in like... 20 minutes? maybe?_ including testing, signing in, reading docs for the node middleware, everything. From a time perspective it seems like a huge win over rolling your own solution. **Pretty sweet deal compared to the 2-3 afternoons I would have spent rolling my own bespoke solution.**

I'll probably keep messing around with Pipedream even if it's just for experiments like this. it seems to remove a lot of the groundwork typically involved in shipping tools like this one. You just write your business logic. No worrying about writing integrations, storing credentials, managing deploys, provisioning infra, etc, etc. All signs of a great tool.

This would also be great for a bunch of other stuff and I've got a few ideas in my head already:

*   handling form submissions from sites: just have your site POST to a webhook trigger, and then send out an email/slack/discord with the contents.
    
*   building out MVPs for APIs; want a bare bones version of a feature built out? just do it here first with those code steps. did I mention you can import packages and manage secrets in there too?
    
*   Doing basically any small easily automated task on a schedule: with their CRON trigger this can replace a crontab on a raspberry pi in your house, or a job server in your cluster.
