---
title: Containers and The Enterprise-Vendor Feedback Loop
type: 'post'
description: Enterprise and Enterprise Vendor's both improve at a glacial pace; why?
pubDate: 2023-03-07
draft: false
tags: ['devops', 'opinion']

---

I love containers. _I think they're cool_. Like any tech they have their issues[^1], but when done right enable automated deploys, self-repairing systems, and a direct programmatic "source of truth" interface for infrastructure. All of which can be a _huge_ asset in an organization with a significant number of server-based applications, jobs, daemons, and systems.

**Despite all the benefits, and our teams success with containers in certain contexts[^2], I've noticed there seems to be a bit of a feedback loop that prevents containers from reaching wide-spread adoption at work.** I've attributed this to something I've been calling the "enterprise-vendor feedback loop". Here's an example of what I mean:

- Enterprise wants to move forward with container technology (Docker, K8s, etc.)
- Niche enterprise vendors don't offer a solution compatible with container technology
- Enterprise is not able to get enough buy in to move forward in a meaningful way.
- Enterprises technological growth stagnates.

Now imagine the same thing from the vendor's perspective

- Team within vendor co wants to better their offering by adding containers as a build target.
- Clients are not "ready" for containers because most other vendors aren't offering it
- Vendor doesn't have enough buy-in from customers to move forward with containers.
- Vendor's technological growth stagnates.

This feedback loop seems to keep both enterprise companies and enterprise vendors in a glacial state of continuous improvement. Neither organization will make a substantial change in underlying technology until there is an absolute need for the change. The challenge of moving forward without buy-in from the other group is often above either organization's pain threshold for change.

## Why not just containerize vendor applications?

I've thought about just containerizing vendor applications quite a bit as well. In theory an org could containerize vendor applications as they're on-boarded. Just write up a Docker file + a Docker compose file for each new application during the onboarding process!

While that might be fine initially, there are some maintenance risks in doing so:

- The vendor may no longer support the application with a custom container layer on-top. Some vendors just don't support any customizations, and by putting that layer on top of the whole app you've potentially put the whole app out-of-support.
- Windows server apps often have issues when containerized from what I've seen. Especially so when a custom GUI is involved for setup and configuration tasks in the software.
- Upgrades become significantly more complicated if the vendors application is heavily refactored and the vendor is not comfortable with containers.

## Not just containers, unfortunately

This applies to more than just containerization technology though. That feedback loop can prevent a number of advances in a large enterprise organization. Here are some other examples I've seen:

- Desktop virtualization
- CI/CD pipelines
- non-conventional environments (server-less, cloud, hybrid)

## Anyone have any ideas?

Maybe I'm missing an obvious solution here, but would be open to any ideas you have around how we can get out of this continuous improvement rut. It may just be that things are moving slower than I'd like and that's the way of the world...

[^1]: Containers are hard to do right. I've spent the better part of the last 3 years learning about them and still feel like I'm just scratching the surface. I've got the dockerfile and docker-compose.yml workflow down, and love how they make deploying in the cloud easy across platforms. That said, after setting up a [K3s envrionment](https://k3s.io/) with some raspberry pi 4's in my office I was absolutely lost. In trying to make a system that can account for every usecase, containers and container orchestration tools end up very complicated™.

[^2]: We containerize most of our in-house developed applications at this point, as well as almost all of the open-source software that we use. Deploys and updates become as easy as `docker-compose up`. Most open source software also has publicly available containers like [redis](https://hub.docker.com/_/redis), [uptime kuma](https://hub.docker.com/r/louislam/uptime-kuma), etc.
