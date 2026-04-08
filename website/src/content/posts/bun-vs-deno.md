---
title: "Bun vs. Deno"
type: "note"
description: "Bun and Deno seemed mostly the same to me, so I wrote this post to sort out my thoughts."
pubDate: 2023-09-11
draft: false
tags: ['tech']

---

[Bun](https://bun.sh/) [v1.0](https://bun.sh/blog/bun-v1.0) just launched, and I've been very surprised by how hyped people seem to be with the release. [Deno](https://deno.com/) (currently on v1.36) has been around for quite awhile, has seen pretty heavy adoption in certain circles and by certain companies (especially in edge environments like with [Netlify Edge Functions](https://docs.netlify.com/edge-functions/overview/) and [Cloudflare Workers](https://workers.cloudflare.com/)).

I spent the afternoon digging around both Deno and Bun's sites, and talking to a few people, so thought I would solidify my thoughts by writing something up.

## What they have in common

Bun and Deno have a lot in common. This is why I was so surprised by all the hype I've seen online for Bun's 1.0. _Why are people so excited about Bun, when Deno seemingly does so much of the same things?_

Here's a quick list of things I've noticed the projects have in common:

- Alternate JavaScript runtimes that run in a server/desktop context.
- Claim to improve upon than the prototypical server/desktop JS runtime, Node.js. This includes actual runtime and startup improvements.
  - note: While both Deno and Bun are faster than Node.js, Bun seems to be considerably faster but time will tell if that's true at scale.
- Provide a number of runtime-native solutions that are typically solved by third-party tools (i.e. bundler, package manager, dev server, test runner, etc.)
- Provide their own "standard lib" of tools that claim to be equivalent, simpler, or faster than the Node.js standard options through better APIs or optimization in their respective languages.
  - [Bun is built on Zig + JavaScriptCore (Webkit)](https://bun.sh/docs#what-is-a-runtime)
  - [Deno is built on Rust + V8 (Chrome's JS engine)](https://deno.land/manual@v1.36.4/introduction#introduction)
- Managed by for-profit, VC-backed, companies, as opposed to Node.js which is in the hands of the [The OpenJS Foundation](https://openjsf.org/), a not-for-profit company.
  - This isn't necessarily a bad thing, just something to be aware of.
- Natively support Typescript, JSX, top-level await and a number of other "developer experience" goodies.
- Are open-source.

## Where they're different

There are a _lot_ of tit-for-tat feature-level differences between Bun and Deno. That said, after reading through their respective sites, **I think the differences all come down to a fundamental difference in how they attempt to answer the same question.** **_How do we replace Node.js_?**

### Bun's approach

Bun aims to replace node.js with a drop-in replacement that focusses on improved performance and developer experience without straying to far from the core principles of node. It does this by focusing on optimizing and improving upon existing node.js paradigms while still providing non-breaking changes that improve developer experience.

Here are some examples of this approach in their features:

- Faster install time for packages via [`bun install`](https://bun.sh/docs/cli/install) that uses your existing `package.json` file.
- Direct replacement for `npx`, [`bunx`](https://bun.sh/docs/cli/bunx) that relies on the optimizations in `bun install`.
- [Top-level await](https://bun.sh/docs/runtime/modules#top-level-await), [native typescript](https://bun.sh/docs/runtime/typescript) and [JSX](https://bun.sh/docs/runtime/jsx) support in the runtime itself.
- [A test runner](https://bun.sh/docs/cli/test) and [bundler](https://bun.sh/docs/bundler) as part of Bun's standard library and [more DX features](https://bun.sh/docs/runtime/hot).

Notice how these features enable developers to swap over to bun without changing any of their existing configuration? You can just use your existing `package.json`, dependencies, and scripts with bun. You can just run `bun install` and `bun run start` and see the improvements _instantly_. You can incrementally adopt the other goodies over time.

### Deno's approach

Deno aims to replace node with a bit more of a deviation from the tracks that node.js laid. Deno is taking a more holistic approach, and is aiming to solve the issues present in Node.js at a fundamental level. It offers new solutions to old problems and attempts to rethink node.js from the ground up, avoiding all of the (perceived) mistakes it's made.

Here are some more features, from Deno this time, that justify my thinking:

- Preferring direct [ESM imports](https://deno.land/manual@v1.36.4/basics/modules#overview) and [a `deno.json` file](https://deno.land/manual@v1.36.4/getting_started/configuration_file) instead of `package.json`
- Having [their own third-party package hosting platform](https://deno.land/x)
- [Supporting both node.js built-ins and npm packages](https://deno.land/manual@v1.36.4/node), but doing so after v1.0.
- While Deno is faster than Node.js, [they only mention performance _once_ in their intro](https://deno.land/manual@v1.36.4/introduction). They focus more on DX, better defaults, browser compatibility, better tooling, [etc.](https://deno.land/manual@v1.36.4/introduction#goals)

Notice how Deno pitches itself as more of a wholistic, alternate approach to a JavaScript runtime? Chances are you can't just run your existing node.js app with Deno the same way you could with bun, _and I think that's intentional._ The Deno team seems to believe that the benefits Deno offers are worth changing things up a bit; it's ultimately up to you decide if the tradeoffs are worth the benefits.

_Fun fact: [Deno's development and company are lead by the original developer of Node.js](<https://en.wikipedia.org/wiki/Deno_(software)?useskin=vector#History>), [Ryan Dahl](https://en.wikipedia.org/wiki/Ryan_Dahl?useskin=vector). Imo, if anyone gets to definitively claim node.js has made some mistakes, it's the person who designed the runtime in the first place. [Deno was even announced in a talk about that topic.](https://www.youtube.com/watch?v=M3BM9TB-8yA)_

## My closing thoughts

I've already been using Deno for scripts, automations, and little CLI apps ([Deno compile](https://deno.land/manual@v1.36.4/tools/compiler) is amazing for this btw) for around a year, and have been increasingly happy with it for that. I could see myself starting to adopt it in production systems eventually if it stays as stable as it's been recently. As far as Bun goes, I think it's too early to bet on it for work. I will be keeping my eye it though. I'm sure they'll [sort out some of the issues they're facing](https://github.com/oven-sh/bun/issues/3218), and I'm interested to see how they continue to differentiate themselves from both Node.js and Deno after v1.0.

As it stands right now, I think I'll probably still be sticking to node.js for most production workloads. Boring I know, but it's proven, and I don't want segfaults to take down prod just because I wanted to run my tests faster 😉
