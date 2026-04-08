---
title: 'Docker Rocks 🐳'
customSlug: 'docker-rocks'
type: 'post'
description: 'Once Docker and Docker-compose clicks, it makes dev ➡️ launch so much easier'
pubDate: 2022-04-27
heroImage: '../../assets/posts/docker-rocks.avif'
tags: ['devops']
draft: false
---

Docker is such an amazing piece of technology.

I’ve been doing a bunch with it at work lately and once things “click” (docker + docker-compose) the pipeline from development, to deployment can feel seamless, and a lot easier to be confident in.

You can have a local "dev" environment (DB, App, Redis, etc) that mirrors your production environment up and running with one command.
you can make all your changes, and test them in an environment that is extremely close to production, in _one command_.

From there, deploying your app is as simple as commiting your code, merging a pull request, pulling things down on your production server, and restarting the app!

> If you're in a cloud environment that supports git-based CI/CD, this is probably automated for you already! 🎉

We've even started to "containerize" off-the-shelf apps we use at work to simplify deployment. docker-compose is so useful for "composing" services that it can take deployments down from multi-hour efforts to a few commands. Previously monolothic all-day-long deploys can literally be as simple as:

```bash
docker-compose build && docker-compose up
```

The next logical step for me in all of this is Kubernetes, which seems infinitely more daunting somehow.

### What does this look like?

Here's [an, admittedly extremely abstracted, example](https://github.com/MykalMachon/Caeser) based on one of my recent work projects.

Despite the code being a lot simpler, the basic "docker" structure we use is on full display here, and could pretty easily be forked out to fit other projects.
