---
title: 'Starting a Garden 🍅'
type: 'post'
description: "I redid my site again; this post goes over why, and what's changed this time around."
pubDate: 2023-01-30
draft: false
tags: ['personal']
---

I redid my site! ... again!

I've been messing around with the look and feel of this site on a dev branch for a few months,
and started a dedicated feature branch for the overhaul a few weeks ago. I'm pretty happy with the
_look_, but I made more than just stylistic changes. **I added some content types, ripped out some features,
and moved all my old content over to `/garden/posts`**

So what gives? what is a digital garden anyways? when's the next redesign 😉?

## What's a Digital Garden

I won't spend too much time digging in, but I stand on the shoulder's of dev giant's here.
[Maggie Appleton](https://maggieappleton.com/about) has a [great post going over the concept](https://maggieappleton.com/garden-history), and so does [Joel Hooks](https://joelhooks.com/digital-garden). With their explanations in mind, I have a few other things that I think feel _garden-like_ in the way I've designed the site this time around:

### Keep it messy

I don't want everything on this site to have the implicit pressure that a "Blog Post" does. Believe it or not, I don't want everything I write to be pristine.
Sometimes I just want to put my thoughts out into the aether, without a lot of formality. See if they stick. Use them as a reference point. See what others think. You know?

With that in mind, I've added a bunch of new content types: [notes](/garden/notes), [photos](/garden/photos), and [links](/garden/links) to de-stress posting here.

A lot of my ethos for this site was inspired by something from one of Rach Smith's note's:

> I dropped the baggage around “blog post” ... started thinking about my notes as works in progress, learning in public rather than complete pieces of work. The mental shift helped me quit overthinking about what I published.
>
> - [Rach Smith - How I wrote more](https://rachsmith.com/how-i-wrote-more/)

_She also calls her site a digital garden... what a coincidence!_

### Keep it simple

I've kept the site architecturally simple by design. There aren't a lot of super-complex features. The post likes and comments I had on here before were great, but were examples of features that had heavy vendor lock-in and just kind of felt "heavy".

**This site could realistically live on a 11 year old computer in a basement, but tools like Netlify add goodies on top without weighing things down.**

in 5-10 years, I don't want to lose a bunch of photos, ideas, and little pieces of my personal history because a billion-dollar baby blew up my website. This site is all `.astro` files, markdown, and open-source packages with a little progressively enhanced sugar on top.

### Be a good steward

I see posting to my own site as an act of Internet stewardship. An independent and individual internet is a healthy internet. By [keeping it simple](#keep-it-simple) I've pretty much minimized my barrier of entry to hanging out on the internet and helping take care of it.

This doesn't just mean posting on this little hermit island of a website, it means sharing and consuming RSS feeds, cross-posting, experimenting with new and equitable internet tech (ActivityPub?) and generally making content accessible and shareable across the internet and for all people. It also means building relationships through the web, which I'm very grateful to say that I've been doing for awhile, Digital Garden or not.

The IndieWeb page for [POSSE](https://indieweb.org/POSSE) got me thinking about this awhile ago; it's a good read if you're interested in this concept.

## What else has changed

Now that you know what a Digital Garden is, here's a some of the other things that have changed:

### Things added

- Fancy new design with a focus on improved readability (colors, font-size, etc.)
  - Upgraded CSS variables for styling thanks to [some new variables in Open-Props](https://open-props.style/)
- Content types: checkout the [garden home page](/garden/) for more on this.
- Hashed low-res images embedded into HTML `<img />` tags to improve image lazy loading.
  - Considering writing a post on this one. Was a fun experiment.
- [Astro 2.0 content collections](https://docs.astro.build/en/guides/content-collections/) for better authoring and type safety.
- [Multiple RSS feeds](/feeds/) so you can subscribe to what you like and leave the rest
- WebMentions for comments, likes, boosts, etc on all posts.
  - _Still more work to do here_; I may enable SSR on content pages to enable dynamic fetching of this data.
- I'm sure there's more I'm forgetting about.

### Things removed

- GitHub comments via Utteranc.es: easy to setup, didn't like the look.
  - ✨ Replaced with Webmentions!
- Custom reactions via Cloudflare: was fun to build, but didn't love how much baggage was attached.
  - ✨ Replaced with Webmentions!
- Dark/Light/Custom Themes: These worked great but I was seeing some [FART](https://css-tricks.com/flash-of-inaccurate-color-theme-fart/).
  - 🤔 These are coming back eventually; I want to solve the flashing theme once and for all and add more themes

## More coming soon!

I've you've made it this far, **thanks for reading.**

I'm going to be posting here more and more so if you're subscribed I'm sure you'll be hearing from me real soon.

Have a great day!
