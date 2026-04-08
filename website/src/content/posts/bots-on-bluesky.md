---
pubDate: 2024-11-03
title: Bots on Bluesky
description: 'Making bots on Bluesky is super easy! '
type: post
draft: false
tags: ['tech']
  - webdev
  - javascript
  - automation
location: localhost
---
I've been hanging out over on [Bluesky](https://bsky.app/profile/mykal.codes) the last few weeks. While bumming around on there, I found this library called [@skyware/bot](https://www.npmjs.com/package/@skyware/bot) and was surprised by how *simple* building out bots for the app is.

## Minimum viable bot

No, seriously, it's so easy! All you need is a bit of JavaScript:&#x20;

```javascript
import { Bot } from "@skyware/bot";

const bot = new Bot();

// I would use an app password for this if you can!
// app password: a temporary password you can create and revoke as needed.
await bot.login({ identifier: "your-username", password: "your-password" });

bot.on("reply", async (post) => {
    await post.reply({ text: "Thanks for replying to my post!" });
    await post.like();
    await post.author.follow();
})
```

There ya go! you have a bot that:&#x20;

* logs into your Bluesky account.
* listens for replies to any of your posts.&#x20;
* likes and responds to replies of your posts.
* follows anyone who replies to your posts.

## Dice rolling bot

I also spent some time messing around to see if I could get the bot responding to private messages and built out a little bot that will roll a virtual dice for you over private messages.

You can [check the code out for it on my GitHub](https://github.com/MykalMachon/atbots/blob/main/main.js).&#x20;

## Deploying the bot

Not to harp on, but deploying these bots to [Railway](https://railway.app/) is comically simple. Just log in, create a project, create a repo service, add your username/password as environment variables, and you're good to go.&#x20;

That said, you could run these things on anything that's internet connected! The bot doesn't need to expose a web server or anything, it just sends API calls out to Bluesky. *You could host it on your freaking laptop if you want*- as long as your computer is online the bot should respond!&#x20;

## Moving forward

I'll probably build a bunch more features into my bot but I was so impressed by how easy this was that I figured I'd share early!

I have a few ideas on how to build out the bot further like an article text-to-speech generator and maybe integrating an LLM to handle the function calling as opposed to strict commands like I have for the dice bot right now.
