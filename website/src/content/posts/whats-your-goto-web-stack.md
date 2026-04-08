---
title: "What's Your Go-To Web Stack"
customSlug: "whats-your-goto-web-stack"
type: 'post'
description: "An exercise in exploring the stack I'm currently comfy with."
pubDate: 2022-05-16
heroImage: "../../assets/posts/whats-your-goto-web-stack.avif"
draft: false
tags: ['webdev']
---

This post was inspired by [Andrew Walpole's "What's Your Go-To Web Stack" post](https://andrewwalpole.com/blog/whats-your-go-to-web-stack/). It seemed like a fun exercise, so I thought I’d give it a shot.

The stack I'd use for a website is a little different than what I'd use for a webapp, **so I figured I'd answer this question in two ways: what's my webapp stack, and what's my website stack.**

## Go-To Website Stack

If I’m working on a site for myself or a client, the tools in my belt are pretty well defined.

The main piece of the stack here is the Static Site Generator (SSG) / "meta-framework" used to build the site. Until recently, my go-to was [Next.js](https://nextjs.org/), but in the last ~6 months, I've moved most of my stuff over to [Astro](https://astro.build/). Next.js is [technically more "feature rich"](https://nextjs.org/docs/getting-started), but I really like Astro's [zero-js-by-default approach](https://docs.astro.build/en/core-concepts/partial-hydration/). Astro also gives me more room to experiment with JS / CSS.

I've been using [Netlify's Edge and Serverless Functions](https://www.netlify.com/products/functions/) quite a lot as well. While I've been using Netlify for years now, I've only really started digging into their serverless functions to help supplement Astro's lack of server-side functionality.

For content management, I'll typically stick to markdown files, but if the site needs to be edited by business users, I'll use [Sanity.io](https://www.sanity.io/). Their free plan is super generous and the level of customization makes it easy enough to tweak the CMS to fit the level of control and visibility needed.

### The Stack / TLDR

- Framework: [Astro](https://astro.build/)
- Content Management System: Either Markdown or [Sanity.io](https://sanity.io/)
- Styles: SCSS
- Javascript: Vanilla JS, or [Svelte](https://svelte.dev/) if it's getting a little complex
- Hosting: [Netlify](https://www.netlify.com/) (Serverless / edge functions + forms are killer)

## Go-To Webapp Stack

My go-to webapp stack is a bit more up-in-the-air than my website stack. Depending on what I'm working on / the needs of the project, the stack can change a lot. If I _had_ to choose, the tech below is the closest I could get to a "go-to" list.

The main piece of the pie here is, again, the "Framework". I've been using [Flask](https://flask.palletsprojects.com/en/2.1.x/) _a lot_ at work lately and have been really loving the back-to-basics web server approach it takes. There are tonnes of resources out there about integrating it with modern tech and practices, plus Python is just a dream to write. In cases where I need something that has a reactive frontend though, I'll still reach for the tried and true [Next.js](https://nextjs.org/).

We use mostly MS SQL for databases at work, but that is definitely not my DB of choice. I'll reach for [PostgresSQL](https://www.postgresql.org/) whenever I can; it seems to work with almost everything you'd need it to, and benefits from being one of the "popular" databases with lots of tooling and educational content available.

For hosting, [I've really been digging "dockerized" setups lately](https://mykal.codes/posts/docker-rocks/), which, by design, means you can kind of host anywhere. I host some stuff on a server in my house, and use cloud services like [Railway](https://railway.app/) to host most production environments for clients.

### The Stack / TLDR

- Framework: [Flask](https://flask.palletsprojects.com/en/2.1.x/) or [Next.js](https://nextjs.org/)
- Database: [PostgreSQL](https://www.postgresql.org/)
- Styles: SCSS
- Javascript: Vanilla JS or [React](https://reactjs.org/) (the ecosystem still has Svelte beat here)
- Hosting: [Docker](https://www.docker.com/) + On-Prem / Docker + Cloud ([Railway](https://railway.app/), [Digital Ocean](https://www.digitalocean.com/))
