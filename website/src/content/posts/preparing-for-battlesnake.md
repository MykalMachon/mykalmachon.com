---
title: 'Preparing for Battlesnake'
customSlug: 'preparing-for-battlesnake'
description: 'Lets review my goals for this years Battlesnake competition.'
pubDate: 2019-02-18
type: 'post'
heroImage: '../../assets/posts/preparing-for-battlesnake.avif'
draft: false
tags: ['tech']
  - 'webdev'
---

This year's Battlesnake competition takes place on March 2nd 2019 at the Victoria Convention Center and I've got quite a bit of preparation to do before then.

## But wait a second... what's Battlesnake?

In the organizer's words:

> Battlesnake is a fun way to practice programming and learn new skills. Groups and individuals build AI bots to play the game Snake using modern, real-world technology. Read the docs, deploy your snake to a live web server, and join other programmers trying be the last snake slithering.
>
> - ([Battlesnake.io](https://battlesnake.io))

If you've ever played the classic game snake on your phone or computer, you know exactly what a Battlesnake arena looks like.

Just imagine instead of one snake on the screen, there are 4-5 of them. All fighting for the same food and space with the best programmed snake taking home a cash prize and the esteemed title of Battlesnake Champ.

Sounds fun right? I thought so! If you're still not convinced, [here's a video](https://www.youtube.com/watch?v=ygvQds0C1X8)

## My goals for Battlesnake this year

Since I've got the fundamentals down, I'm taking Battlesnake as an opportunity to spend some time sharpening my path finding skills and programming a snake that can at least sort of stand on its own two, metaphorical, legs.

While, in a perfect world, I'd be spending hours on this a night, I've got midterms the week of and the week after Battlesnake so I'm going to have to prioritize a little bit.

### Priority #1: Self Sustaining

This is the very bare minimum I'd like to get my snake AI to. At this level my snake should be able to:

1. Not kill itself by running into its own body / other snakes / walls...
2. Be able to find a route to food in the area and determine whether it can do so before any other snakes.
3. As a result of 1 + 2, be able to be self-sustaining if it is the only snake in an arena.

### Priority #2: Basic Path finding

This is where I realistically feel that I should be able to get the snake to before the competition.
At this level my snake should be able to:

1. Do everything that a self-sustaining snake could do
2. Have some sort of intrinsic goal. For example, always be on the move for food, or always be trying to trap other snakes.
3. Have a basic weighting system where the snake can determine which move would be best and act on that.

### Priority #3: Getting Fancy

These are the things I think would be really cool to play around with, but doubt I will actually get to implement. At this level my snake should be able to:

1. Do everything a basic path finding snake could do.
2. Be operating off a trained neural network. Most likely something built through OpenAI or Clarifai
3. Capability to autonomously improve or "learn" after each match through the use of machine learning

I've never used any AI tech beyond using some very simple pre-trained facial recognition models. This would be a tonne of fun to play around with, but may be a little too far out of my wheelhouse to be achievable in two weeks.

## Closing thoughts

This is actually my second year attending BattleSnake. I first attended in 2017, my first year of university. I don't think my team and I could even get the snake to change directions. We were all pretty inexperienced developers at the time and had never worked with, or even heard of, tools like Node.js or Heroku.

Despite our lack of knowledge, We had a tonne of fun! The event's atmosphere was awesome and I learned more about real-world development in that 5-6 hour event than I had all year in class. I remember feeling so proud that we even got our snake to respond with a 200 to the server.

It's crazy to think that just two years ago I knew absolutely nothing about any of the technology I use on an almost daily basis today. I sometimes feel like I'm constantly losing a race with technology; Like I can never learn enough, fast enough, to feel caught up and knowledgeable.

That said, Being able to look back on my skills in 2017 and contrast them to my skills today through the lens of something like Battlesnake has really inspired me to prove to myself just how far I have come in that time. I can't wait to start this years snake!

> Update post-Battlesnake🐍
>
> My snake AI went made it into the second round of the beginner's bracket 🎉! I’ve definitely made progress and I’m looking forward to making even more come next year’s Battlesnake.
