---
title: MIT, Sans-elon
customSlug: mit-sans-selon
description: The MIT license, but Elon Musk and all of his companies are explicitly
  denied usage.
pubDate: 2022-11-15
type: 'post'
heroImage: '../../assets/posts/mit-sans-elon.avif'
tags: ['opinion']
draft: false

---
A few friends and I were talking about the hot-topic of the Elon Musk twitter takeover, specifically, we were talking about this tweet:

<blockquote class="twitter-tweet"><p lang="en" dir="ltr">Btw, I’d like to apologize for Twitter being super slow in many countries. App is doing >1000 poorly batched RPCs just to render a home timeline!</p>— Elon Musk (@elonmusk) <a href="https://twitter.com/elonmusk/status/1591853644944932865?ref_src=twsrc%5Etfw">November 13, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

This tweet is ridiculous for so many reasons:

* It doesn't really make any sense, seemingly just some technobabble slapped together to seem intelligent.
* Even if you give Elon the benefit of the doubt and say by "RPC" he meant REST / HTTP calls, Batching them won't necessarily improve performance given HTTP2.
* The tweet seems to imply this is a new issue, which, if anything, would also imply that [Elon and his antics](https://mobile.twitter.com/elonmusk/status/1592177471654604800) are to blame. 
* Someone was [seemingly fired](https://twitter.com/MattBinder/status/1592193172830318592) from Twitter's Android app team for [pointing out that the tweet was plain wrong](https://twitter.com/EricFrohnhoefer/status/1591902285403418624). Firing an SME on your product, who has likely worked to improve the exact deficiency you're complaining about is a _bad_ look.
* The whole thing really just feels like something out of HBO's Silicon Valley.

Having talked about all of this, a friend joked that someone should create an MIT license that explicitly denies Elon Musk or any of his companies' usage of the associated software. [So I did, it's called MIT-SE and you can check it out here.](https://github.com/MykalMachon/MIT-SE)

1. Is this a silly thing that I made more to make a few friends laugh than for any practical reason? _yes!_
2. Is it likely that I'll use MIT-SE in some of my toy open-source projects, also _yes! see point 1 for why._