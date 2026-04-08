---
title: Why I Love Self-Hosting
customSlug: why-i-love-self-hosting
type: 'post'
description: A writeup on why I love self-hosting complete with drawbacks.
pubDate: 2022-07-04
heroImage: '../../assets/posts/why-i-love-self-hosting.avif'
draft: false
tags: ['devops']

---
If you're unfamiliar with the term, I would define self-hosting as the practice of hosting your own server and services either in your home or place of business. People do this for an array of reasons (which we'll get into in this post). It's become increasingly popular over the last few years for enthusiasts, developers, and nerds, in general, to set up “homelabs” in their basements, under their desks and in their TV cabinets.

I started self-hosting around 2 years ago after I got a touch of some FOMO from friends with servers set up at home. To be honest I expected to be “over it” a few months after I started. To my surprise, I'm still self-hosting now, and having more fun with it than ever. It's been a fun way for me to learn in a safe/forgiving environment, experiment with new tech, and save some money on online services like Google Drive.

This post is going to outline a few of the reasons I love self-hosting, and why you might love it too.

## Reuse of otherwise unused hardware

My self-hosted setup is mostly secondhand hardware. The only thing I've purchased from new are things you typically _don't_ want to buy second-hand (e.g. Hard Drives). By re-using older hardware, I saved quite a bit of money and got up and running almost instantly. _I think I only spent around $350 to get a server up and running_, with all of that cost being [IronWolf 4TB hard drives](https://www.amazon.ca/Seagate-IronWolf-5900RPM-Internal-3-5-Inch/dp/B07H289S79) and a compact case for the server.

I started with a full “desktop-grade” server, but you can start with something as simple as an old laptop, or a Raspberry pi you got at a conference that has been collecting dust for a few years.

## Learning in a safe environment

When I started self-hosting I had _heard_ of docker but had not used it. Now, I use docker containers at work daily, and they're a big part of how I do development. I would never have learned as much, as fast, unless I was experimenting on the weekend with my self-hosted services.

I've also learned a lot about:

- Network management/structure
- Proxy software (NGINX in particular)
- DNS
- Monitoring and alerts
- SSL certificates
- Virtual machines
- Virtual private networking (VPNs)
- I'm sure much more

I'd read a lot about all of these things in school and had even dipped my toes in them previously, but being able to sit down and implement these things has solidified concepts in my head. I definitely wouldn't say I'm an expert in these topics, but I'd be confident enough to propose solutions using this tech now that I've used it.

Another benefit of learning in a self-hosted environment as opposed to on the job is you don't have to worry about taking down production for a whole company, just your personal stuff.

## Privacy and ownership

> If you're not paying for the product, you and your data _**are**_ the product
>
> - someone from the internet

Privacy was one of the biggest reasons I got into self-hosting. I was able to migrate lots of my data off of Amazon, Facebook, and Google's servers by spinning up self-hosted alternatives, for example:

- Google Drive / Google Photos: _replaced by_ [_NextCloud_](https://nextcloud.com/) _+ a nightly encrypted backup to_ [_BackBlaze B2_](https://www.backblaze.com/b2/cloud-storage.html)
- Amazon S3 buckets: _replaced by_ [_MINIO_](https://min.io/)
- Notion / Google Keep: _replaced by_ [_Trilium notes_](https://github.com/zadam/trilium)
- Google Analytics: [_Umami_](https://umami.is/) _+ PostgreSQL_
- Cloud databases: _local PostgreSQL, MySQL, MariaDB, and Redis containers_
- Google Home: [_Home Assistant_](https://www.home-assistant.io/) _virtual machine_
- Nord VPN: [_WireGuard_](https://www.wireguard.com/) _as a personal VPN on my phone, and laptops_
- a whole bunch of dev stuff

Don't get me wrong, I still use Gmail for personal email, and I keep all my recent photos on Google Photos still. That said, I was able to move a _lot_ of my data back into my control, and that feels good!

## Easier development environments

Having a server under your desk with every open-source database installed, and the ability to spin up any niche tool you might need in a few seconds can make creating development or staging environments _easy_.

For example, when working on freelance projects I typically create a new database for the app or site I'm working on and use that as a development database. Then when I want to leave an app running for testing, I'll just spin up a docker container on my server and send over access to the client for testing. All for effectively $0. Before I was self-hosting, a separate test instance (app + database + Redis) could run anywhere from $10-20/month.

## The Unraid operating system

I use [Unraid](https://unraid.net/) as the operating system on my main server, it allows you to easily set up and manage almost anything you'd want for self-hosting through a local web interface, and even a terminal when I need a bit more access:

- Network drives with parity (via Samba / NFS)
- Docker containers
- Virtual machines
- Unraid specific plugins
- a [whole bunch more](https://unraid.net/product)

All you need to do to get rolling with Unraid is download the OS, flash it to a hard drive, and boot off it on your machine. To be honest, I don't think I would have got into self-hosting as much as I did if Unraid wasn't so dang easy to get going with.

## Welcoming community

In general, the community is welcoming and willing to help out. I've asked a few questions online about my setup, and have always gotten honest and helpful communication back. This could be a bit of selection bias, but as a programmer/developer by trade I was really surprised given how toxic Stack Overflow, Linux, and developer help forums can be.

Here's a list of some of my favourite self-hosted spots online:

- [r/SelfHosted](https://www.reddit.com/r/selfhosted/)
- [r/Unraid](https://www.reddit.com/r/unRAID)
- [r/HomeLab](https://www.reddit.com/r/homelab)
- [Unraid Forums](https://forums.unraid.net/)

Even if you don't plan on getting into self-hosting now, but are generally interested in it, I'd suggest checking these out and seeing all the cool stuff people are doing.

## Self-hosting downsides

While it's probably pretty obvious that I'm a fan of self-hosting, there are a few notable downsides to messing around with self-hosting Some of them only apply if you're going to be exposing services to the internet, but I'll make that clear.

### Maintenance

Given that you're running the hardware yourself, there's always the risk that a hard drive could die, RAM can go bad, or a CPU can just give up. When this happens your services will likely be down (unless you're running something high availability; I'm planning to do this with some Raspberry Pi's so stay tuned for that).

Besides hardware, you're going to want to keep your software up to date and check in regularly. There are monitoring tools that can help with this (monitor uptime, usage, and logins, have the service alert you if anything looks off), but you're still going to want to check-in manually at least once a week in my opinion.

### Security

When you're exposing your services, virtual machines, and apps to the internet there are some inherent risks. If you don't properly test and secure your system someone _will_ find a way into your network, your machine, and your data. Be careful with how you're doing things, some common advice would be:

- **Stick to the principle of least privilege:** Give out very limited access by default, and regularly audit what you're making available outside of your network.
- **Stay up to date:** Make sure to monitor the available updates on your containers and virtual machines, and patch whenever possible. While this isn't a catch-all for security (like most things on the list), it helps to always be on the newest version.
- **Authenticate everything:** This is more of a personal belief, but if you're going to be putting something on the internet, make sure there's a well-tested authentication scheme, preferably with 2FA protecting the service (e.g. NextCloud w/ strict passwords and 2FA)
- **Only open the ports you need open:** The only ports I have open on my router are 80 (HTTP), 443 (HTTPS), and 51820 (WireGuard VPN). This is a pretty easy one to manage and doesn't mean as much as it used to but it's still a good rule of thumb.
- **Use VPN access for really sensitive stuff:** for sensitive data and services, straight up don't expose them to the internet. Just don't risk it. Setup a VPN on your network, connect to the network via the VPN and just connect as you would locally. I use WireGuard which is [trivial to set up via Unraid](https://unraid.net/blog/wireguard-on-unraid)

### Time investment

As I mentioned at the top of this post, self-hosting is a significant time investment. You'll get out what you put in. If you don't have the time to sit down and mess around on a semi-regular basis (at least until you've got things configured and set up) you're going to be more frustrated than it's worth.

### Internet restrictions

This one doesn't have much to do with self-hosting itself, but depending on the control your internet service provider (ISP) has over your router, you might not be able to port-forward your router, or even use enough data to make self-hosting worth it past local services. Before getting into it, I would recommend making sure your router allows port-forwarding, and your ISP doesn't have restrictive data caps (upload/download).

## Conclusion

If after reading all of this, you still want to give it a try, I say go for it! Plug in that laptop, raspberry pi, or old desktop and get tinkering. I've spent countless hours tinkering with my setup (probably too many, to be honest).

If you have any questions about self-hosting or want to share your own setup feel free to comment below or reach out on the contact page!
