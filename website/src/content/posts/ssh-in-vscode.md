---
title: Using VS Code as an SSH Client
description: Need to edit files on your server? Just use VS Code.
type: link
pubDate: 2024-04-23
draft: false
tags: ['tech']
url: https://code.visualstudio.com/docs/remote/ssh
---

[Today I learned you can literally use Visual Studio Code as an SSH client](https://code.visualstudio.com/docs/remote/ssh). You just enter the server address, login, use the built-in terminal, open a folder as a project, and edit all your files as if they were on your machine normally.

*I don't know how I missed this for so long.* I knew that you could use SSH to connect to remote machines or hosts in VS Code, but I always assumed that you had to login and install a "headless" version of VS Code ahead of time on the server or that it would somehow be a pain to setup and configure.

Nope! you literally just need to: 

1. install the remote ssh extension in VS Code
2. hit `ctrl + shift + p` to open your VS Code command pallette and type "add new ssh host". 
3. follow the prompts and sign in as you usually would via ssh. (I just used my existing keys for auth)
4. *bam*. you're logged into your remote host and can do all the ssh + file editing you need.

I'll probably use this with VMs at work instead of `ssh`ing in and using bare `vi` to edit everything. It should be much nicer to just spint it up in VS Code with all my normal short cuts and bindings.  

## Side note for container nerds

In writing this I thought of some tech with similar vibes for containers.

[You can hook VS Code into running docker containers and kubernetes environments to achieve a similar result](https://code.visualstudio.com/docs/devcontainers/attach-container#:~:text=To%20attach%20to%20a%20Docker,you%20want%20to%20connect%20to.). I've been doing this for quite awhile and it's been useful for debugging from inside your container's and their virtual network.

[Dev containers are also cool for spinning up ephemeral dev environments.](https://code.visualstudio.com/docs/devcontainers/create-dev-container) Imagine definining your whole dev environment in a dockerfile that VS Code can automatically detect and boot you into every time you open your project.