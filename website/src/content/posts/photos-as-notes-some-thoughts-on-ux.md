---
title: Photos as notes; some thoughts on UX
description: I often use photos as notes even though I have a perfectly fine notes app on my phone. Why?
pubDate: 2023-11-15
draft: false
tags: ['webdev', 'opinion']
  - ux
  - webdev
  - personal
location: A grocery store
type: post
stage: budding
---
Look at this photo I took at the grocery store a few days ago. 

![A danish in a bakery tray. you can clearly see the tag as well as some donuts below. The photo is blurry and not really in focus.](../../assets/posts/photo-as-a-note-example.jpg)

All I wanted to know was the BIN number so I could easily pay for a pastry at checkout. 

Look at all the other *stuff* in this photo though. We got the tray, and the pastries on the tray, the out of focus tray below, the location metadata built into the photo, etc, etc. The data I *needed* was just like 6 characters. But it was *way easier* for me to create a 2.4mb jpeg file. 

## Why I use photos as notes

But... why did I do this? I have a notes app on my phone; why not use that?

Let's look at the steps to taking a photo vs writing a note: 
- Taking a photo
	- Take phone out of pocket and double click the lock button to open the camera.
	- I aim at the thing I want to "note", and press the volume button to take a photo.
	- I put the phone back in my pocket and press the lock button.
- Taking a note
	- Take phone out of my pocket.
	- Use thumb to unlock phone when it's out of my pocket. 
	- Open my app drawer and search for my notes app.
	- Open my notes app.
	- Create a new note.
	- Label the note so I don't lose it and so I know what it is. 
	- Write down what I want and make sure there aren't any typos 
	- I put the phone back in my pocket and press the lock button 

I took a photo because it was extremely low friction. Taking a note would have taken "too long". 

While in reality this is probably a 5-15 second deference, do you see how many more steps are involved in taking a note? Just think about verifying that the note I've taken is error free. Imagine fat-thumbing it and writing down the wrong BIN code; that note becomes almost useless. *A photo doesn't really have that problem*.

## How this ties into UX
There's probably some diatribe in me about how this is an example of how convenience will always win over efficiency. I'll skip that and just say that this seemed to be a great example of how just a *little* friction can take something from "I will use this every day" to "I never use this", even in the case of an arguably worse or very inefficient solution. 

Some other examples of this that I can think of:
- **Apps that use SSO/Social sign-in vs apps that have user/password login only**: I know people that will legitimately only use an app if it has apple login. 
- **Building things with tools you already know**: muscle memory is real and sometimes you reach for a "hammer" when you should be using a "chisel" (mind the shoe-horned-in tech stack metaphor 😉)[^1]

## Applying this to building stuff
This type of friction is *really* easy to slip into user interfaces by accident. Whether it's caused by an assumption someone made at some point, a poorly defined but highly requested feature that got implemented without testing, or tech debt incarnate. *it happens.*  

Getting your stuff (app, tool, game, whatever) in the hands of the people you're building it for as early as possible is a great way to sort this out; they're not afraid to hurt your feelings and tend to pick up on this really early. Even if they don't identify it by name, you can usually sus it out by watching them use your thing.

## Feedback

I would love to hear if any of you have novel examples of friction guiding how you act. What do y'all use that's arguably worse or at-least suboptimal, just cause it's easier?

I feel like this "why do I use photos for notes" thing has been stuck in my head for a week and mind mapping it tied it to work, dev, and UX in general; I'm sure that I'm not the first to make this connection.

[^1]: I think "use the tool you know" is, in general, good advice. Especially when you're just sussing out an idea or getting started.