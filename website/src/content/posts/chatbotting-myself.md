---
title: "Creating chat.mykal.codes"
type: "note"
description: "How I created an AI chat bot trained on my blog posts. It's easier than you'd think!"
pubDate: 2023-10-25
draft: true
tags: ['ai', 'tech']

---

I made myself [a little "chatbot" (chat.mykal.codes)](https://chat.mykal.codes) that's trained off the content from my blog. Cool right? To be honest, it was a lot easier than I thought it would be. 

If you have a markdown blog, you could probably fork the project and get somehting setup and working within an hour. 

## Inspiration 



## General approach 

## Building it  

I built out two "apps" for this: 

- **App**: An Astro-based web app that uses svelte for the "chat UI" and provides a thin layer over the Web API. 
- **API**: A flask-based API that trains the model on bootup, and provides programmatic access to it via an HTTP rest API. 

I definitely could have just built one mini-monolith webapp for this, but I very intentionally put together two mini-services instead (not quite willing to call these microservices). 

1. The examples of encoding based models were all built out in a python library called langchain. While langchain does seem to have a node.js equivelant, it seemed easier to use the tried-and-true in python, and just strap a lightweight flask app ontop to provide access. 
2. I'm very familiar with Astro, so it made the most sense to do most of the user-facing application logic in another framework I was familiar with.
3. I wanted to build the "chat" interface in svelte as it's been awhile since I've been able to build anything with it and wanted to keep learning. 

I'm also very familiar with Astro, so making a web-app in that made more sense than trying to stick to 

## Deployment

I just deployed everything on Railway. It integrates with GitHub for easy CI/CD, supports docker, and now that it scales to 0 it's dead-cheap to host stuff there too.

### Private networking

I setup the Flask API to be private to my railway project. This means that only other apps in the project can reach it over the network. 

This means the only *exposed* application is the webapp. 

## Questions and next steps

- Not stoked on the ethical implications of ChatGPT3, and sketchily-trained LLMs in general. The tech is cool though.
- Not sure if data sent over the AI is still used to train models. Can't seem to find an answer on that anywhere so I wouldn't neccesarily put personal data in here. 