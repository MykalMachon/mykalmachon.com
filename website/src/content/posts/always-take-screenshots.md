---
title: Always take screenshots
customSlug: always-take-screenshots
type: 'post'
description: You can't depend on your work to live forever, take screenshots.
pubDate: 2022-10-13
tags: ['webdev']
draft: false

---
I'm in the process of rebuilding [the Tinybox website](https://tinybox.dev). As part of that effort, I'm putting together a bunch of case studies and portfolio pages highlighting previous works. I've been visiting sites I worked on anywhere from 6 months ago to 3 years ago to collect visuals for these pages.

Of the 5 portfolio page drafts I've written up, only 2 of the 5 sites delivered are still similar to how I left them. Bummer. 1 of the companies has shut down, 1 of them changed directions, and 1 of them inspired the twitter rant below:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Imagine this:<br>You build a site. You make sure all the t's are crossed, and i's are dotted. You write guides on how to update products. You record screencasts on how to use the CMS. You did all you could. <br><br>You check out the site again 6 months later and it's absolutely destroyed. <a href="https://t.co/vhFrf5KsT4">pic.twitter.com/vhFrf5KsT4</a></p>— Mykal Machon (@mykalmachon) <a href="https://twitter.com/mykalmachon/status/1580420659007852546?ref_src=twsrc%5Etfw">October 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

## Websites are living documents

Websites are always changing.
People go into the CMS, they change some words, add some products, if you're really unlucky you even get someone who knows enough to be dangerous and messes around with the HTML, CSS, and JS.

Until now it hasn't really hit me what that can mean in terms of showcasing work, especially when projects no longer exist online, or get demolished by popups and plugins.

For Tinybox alone, 3/5 of my most recent significant public projects are either no longer available online, or have been altered to the point where I don't feel comfortable putting my name on them. **So if you can't count on the website being around after launch to show people your work, what are you supposed to do?**

My first idea was to **use the source!** Why not just boot up a development server and take screenshots of that? Unfortunately it's not always that easy:

1. Does the source code you have require external services? I have a number of small react projects that have dependencies that no longer exist (i.e., a client's API)
2. Does the source code require some sort of database connection to operate? where does that seed data come from?
3. Do you still have access to that source code? what if you lost access when the contract ended?

[Andrew Walpole](https://twitter.com/walpolea?s=20&t=Pcu6SxSdDjL0Z_rKz1pPsQ) replied to the aforementioned twitter rant, and jumped right to the logical conclusion for me:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">This is why all our case studies are videos and images. Often too much of a moving target to link out.</p>— Andrew Walpole (@walpolea) <a href="https://twitter.com/walpolea/status/1580435756790665216?ref_src=twsrc%5Etfw">October 13, 2022</a></blockquote>

## Archive projects on launch day

I do take screenshots and videos of my projects while I'm working on them **_but_** they're typically for approval and documentation purposes, definitely not for showcasing the work I'm doing. They either get deleted after the project, stored away in the clients documentation, or lost in the ethereal realm that is my email outbox.

**Moving forward, I think the best approach is to archive projects on launch day.** Take screenshots of the site, take videos of the fun interactions, and put them somewhere they won't get lost.

After doing some thinking this is definitely one of those cases where the simplest solution is the best one:

1. **Easy**: It takes seconds to take a screenshot, and barely a minute to take most videos.
2. **Dependency free**: media doesn't require a `node_modules` folder. 'nuff said.
3. **Immutable**: photos and videos sitting in a folder won't change over time.
4. **Adaptable**: you can open up a bunch of screenshots in Figma, and edit them together into a pretty collage. You can't exactly do that with source code 😅
5. **Fun**: I'm sure in 5-10 years it'll be fun to look back at all the things I've worked on and how trends have changed.

**TLDR: always take screenshots of your work. You'll thank yourself later.**