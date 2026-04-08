---
pubDate: 2025-08-29
title: Copying to the Windows Clipboard from WSL
description: How to easily copy content from your WSL shell to your Windows clipboard
type: post
draft: false
tags: ['tech']

---
Found a fun little hack today while trying to copy some test output from my Ubuntu WSL terminal into the Windows clipboard.&#x20;

Yeah yeah, I know you can select the text in your terminal and it'll automatically be copied into your clipbaord. There's just one problem with that. *You have to use a mouse* (🤮). If you're anything like me, taking your hands off the keyboard mid-flow is akin to sacrilege.&#x20;

Anyways, here's a quick example:&#x20;

```bash
cat some_file.txt | clip.exe
```

That will copy the content of `some_file.txt` into your windows clipboard. Since it's just piping data into the clip.exe program you can literally drop anything into your clipboard. test output? sure! a whole image? sure!&#x20;

Anyways; I found it useful so thought I would share. &#x20;
