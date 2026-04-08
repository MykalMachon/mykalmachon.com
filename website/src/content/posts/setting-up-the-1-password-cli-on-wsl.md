---
pubDate: 2025-07-28
title: Setting up the 1Password CLI on WSL
description: 1Password's CLI is great but their WSL docs aren't.
type: post
draft: false
tags: ['tech']
  - wsl
  - cli
  - devops
location: the terminal
---
I've been messing around with the 1Password developer tools and CLI and have found it extremely useful. However, I found the docs on the website regarding setting up the 1Password CLI in a WSL environment to be either incomplete or just non-existent so I wanted to throw together a guide on how I got everything working on my machine with Windows 11 and Ubuntu 24.01 LTS (Noble Numbat).

It's not an overly complex set of tasks but it took me longer than I'd like to admit to figure out how to get the cli working in WSL.

## Before we get started

I'm going to assume you have the following already setup on your machine:

* [The 1Password Windows Desktop App](https://1password.com/downloads/windows) is installed and configured on your machine.
* [Windows Hello is setup on your machine](https://support.microsoft.com/en-us/windows/configure-windows-hello-dae28983-8242-bb2a-d3d1-87c9d265a5f0) (this is required for unlock via the terminal)

## Setting up the 1Password CLI

As a starting point, [just follow the guide for setting things up for Windows.](https://developer.1password.com/docs/cli/get-started/)

**Completely ignore all of the Linux stuff.**

This threw me off the first time I followed this tutorial cause usually with WSL you just follow the "Linux" guide for your distro and things work out. *This is not the case with 1Password.*

### Configuring WSL to call the 1Password CLI via interop

The trick to getting things working in WSL is just to use the WSL interoperability feature where you can call `.exe` commands from within WSL. If you hop into a WSL window and type `op.exe vault list` you should get a popup asking for you to authorize the request and then see your vaults listed out in your terminal! awesome!

but we don't want to always have to call op.exe... that's just *weird* in a Linux environment (and would probably cause issues when running on real Linux setups with the `op` installed) so let's do some aliasing:

```bash
# .zshrc or .bashrc or whatever shell you use 

# 1Password Windows/WSL Interoperability
alias op="op.exe" 
```

after a quick `source ~/.zshrc` you should be able to run `op vault list` and see something like this:

```bash
op vault list 

ID                            NAME
564bc0a0f9d90a22fc1cb82b5f    Personal
44fa7a6c974e29a3c682158f03    Applications
72d299c80a5fecdf3f90f41e8b    Shared
```

## Managing SSH keys

You'll also probably want to manage (and import your existing) WSL SSH keys into 1password. [Their guide for this is actually great](https://developer.1password.com/docs/ssh) and the only thing you'll need to do is manually copy over the private key for the SSH keypair you've been using on WSL so far.

You can even set WSL up to use the SSH key for signing your commits and get that cool little verified badge besides your name in pull reqeusts 😉

From there, it should all work as expected.

## Getting around `op run` limitations on WSL

When you try and run `op run -- npm run start` (or any op run command) within WSL you'll find that it doesn't execute the latter half of the script within WSL. It executes it withint a Powershell/Windows context. This means that you can't easily use `op run` to easily replace your 1password references at runtime.&#x20;

Thankfully you can get around this by using `op inject`!

On all of your projects, replace your `env.example` with an `env.template` and include the references to the 1password credentials you'd like to replace&#x20;

```bash
DATABASE_URL="op://app-prod/Database: Primary/Connection String"
OPENAI_API_KEY="op://app-prod/API Key: OpenAI/API Key"
SESSION_SECRET="op://app-prod/Misc: Session Secret/Password"
```

From there, all you need to do is run the following command 

```bash
# generate an .env file with your secrets
op inject -i .env.template -o .env

# run your command that expects .env
npm run start

# delete the creds
rm .env
```

While this is an okay start! I still don't love credentials actually getting written to disk. 
I expanded on this approach a bit and basically just rewrote `op run` myself to work better on WSL.

[You can check that out and install it if you want.](https://github.com/MykalMachon/oprun.sh/tree/v1.0.0)
