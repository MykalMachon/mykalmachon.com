---
pubDate: 2025-05-19
title: Dotfiles on windows
description: automating setup of a windows machine via a dotfiles repo
type: post
draft: false
tags: ['tech']

---
I just setup a work laptop and and took the chance to look into what setting up a "dotfiles" for windows would look like. Specifically, what it would take to keep track of apps/tools that I'd need and automate the process of setup on Windows.

I've setup dotfiles on linux machines before, but never windows as I sort of just assumed that package manager just wasn't an option on Windows. I'd used NInite in the past but it's pretty limited on what exactly you can install; there are some common apps but it doesn't include everything I would want out-of-the gate for a work computer.&#x20;

## Scoop: A package manager for windows&#x20;

Searching for "Windows Package Manager" immediately brings up [scoop.sh](https://scoop.sh). This was exactly waht I was looking for and I was blown away it was literally the first thing I found. I had heard of Scoop previously (usually just as an install option in a README.md file) but had never really looked into it. &#x20;

Sccop is pretty cool and has a bunch of sweet features that make it easy to use:&#x20;

* All apps are installed portably in your user directory; you don't need admin permissions for anything installed via scoop.&#x20;
* Scoop makes it really easy for developers to add their apps to the package manager. You can host your own scoop by adding a manifest file to any GItHub repo and you can add it into the official "bucket" by submitting a PR into one of the main scoop buckets.&#x20;
* You can install basically anything with scoop; My windows "dotfiles" install script automatically installs CLI apps like lazygit, node.js, golang, and eza while also installing desktop apps like vscode, and discord.    &#x20;

After seeing all scoop has to offer it seemd like a pretty easy choice for automating my windows setup. &#x20;

### A runner up: winget

I also found winget, which is an official package manager for windows that's seen more adoption lately. It comes pre-installed with windows, has a direct integration with [the Microsoft Store](https://apps.microsoft.com), and tends to have a larger share of closed-source and GUI applications.  &#x20;

That said, It has a few drawbacks when compared to scoop. The big one for me was that I was *constantly* prompted for "A Local Administrator" via UAC when installing packages. While I can temporarily escalate into local admin if I need to, the process is annoying and not everyone has that option on a work laptop.

## Automating setup with scoop.sh + powershell

From there, all we had to do was some Powershell scripting to get everything up and running. I'll include a simplified version of my script below, [but here's a link to the repo if you want to take a look at the nitty gritty + some other terminal styling I do](https://github.com/MykalMachon/dotfiles/tree/main/windows).&#x20;

```powershell
# Read a list of packages that I want to install via scoop
$json = Get-Content "$PSScriptRoot\packages.json" | ConvertFrom-Json

# Set execution policy and install scoop
Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
if (-not (Test-Path "$env:USERPROFILE\scoop")) {
    Invoke-RestMethod get.scoop.sh | Invoke-Expression
}

# Install git first as it's a requirement for scoop's "buckets"
scoop install git

# Add buckets; these are like repos or ppa's for debian's apt package manager
foreach ($bucket in $json.buckets) {
    scoop bucket add $bucket
}

# Install all packages found in packages.json 
foreach ($pkg in $json.cli + $json.gui + $json.fonts) {
    scoop install $pkg
}
```

Here's an example of the `packages.json` file that contains the buckets and packages you want installed:&#x20;

```json
{
  "buckets": ["extras", "nerd-fonts"],
  "cli": ["git", "nodejs", "lazygit"],
  "gui": ["vscode", "discord"],
  "fonts": ["FiraCode-NF"]
}  
```

All said and done it's not too bad right? That's definitely cleaner than your typical linux dotfiles installer bash script where you have to add a bunch of custom repos and ppas for newer packages!&#x20;

## Final thoughts&#x20;

This was one of those projects that I thought would take a lot longer than it did. From start to finish I had this up and running in around 45 minutes with no real issues to speak of! Funny how that works sometimes.

If you're looking to keep track of the apps you want on your windows computers and be able to easily automate the process of setting up a new machine, I definitely recommend you give scoop a shot.  &#x20;
