---
pubDate: 2024-12-07
title: Debugging Crashing Containers
description: Use this little trick to figure out why your containers won't start
type: post
draft: false
tags: ['devops']
  - devops
  - docker
---
I work with docker containers pretty much every day and debugging containers that crash immediately on startup has been a common headache for me. I came up with a little "hack" that has helped me with this problem so I thought I'd share it here.

## The problem

Debugging containers is relatively easy when they're up or online! You can open a shell in the container and peek around to see what's happening, just like you would on your machine. The following command will open up a simple shell in most containers:&#x20;

```bash
docker compose exec -it /bin/sh my-job
```

The problem is, if your container won't come up at all (or it immediately crashes when it does come up) you can't open a shell in it.&#x20;

*This makes sense.* The container isn't online, so you can't run anything inside of it! Try it, and you'll get this message:&#x20;

```bash
service "my-job" is not up
```

## My solution

My workaround is to replace the startup command for the container with the `sleep` command.

```yml
services:
  my-job: 
    container: my-container:local
    command: sleep infinity; # this line will replace the startup command
```

Instead of starting as per the `entrypoint` or `command` that is set in the container, the container's main "thread" will go into sleep for an infinite amount of time. Usually you'd never want to do this. However, this will effectively keep your container online and "healthy" until you take it down yourself, which is exactly what we want!&#x20;

Then you can just startup your container, open a shell, and start debugging:

```bash
docker compose up my-job 
docker compose exec -it /bin/sh my-job
```
