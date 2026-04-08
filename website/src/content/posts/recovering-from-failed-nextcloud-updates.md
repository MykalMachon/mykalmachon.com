---
title: Recovering from failed Nextcloud updates
customSlug: "recover-failed-nextcloud-update"
type: 'post'
description: I've found that my nextcloud updates fail ~1/3 of the time. These steps
  usually save me.
pubDate: 2022-12-13
tags: ['devops']
draft: false

---
> This is a highly specific post about recovering failed NextCloud updates that will only really be relevant if you're hosting your own NextCloud instance. Feel free to skip this one if you're not interested! 
>
> In all honesty, I'm mostly writing this for my future self 😅

At around 11:00 pm tonight I started a NextCloud update on my home lab. I thought "ehh, this will be fine!". It was not fine. The update bricked itself and the container crashed right after deleting all the old program files. (aka "Step 9" according to "nextcloud-update.log"). 

```
2022-12-12T23:38:54-0800 [info] startStep("9")
2022-12-12T23:38:54-0800 [info] deleteOldFiles()
2022-12-12T23:39:20-0800 [info] config sample exists
2022-12-12T23:39:20-0800 [info] themes README exists
2022-12-12T23:40:07-0800 [info] end of deleteOldFiles()
2022-12-12T23:40:07-0800 [info] endStep("9")
2022-12-12T23:40:36-0800 [info] request to updater
2022-12-12T23:40:36-0800 [info] currentStep()
2022-12-12T23:40:36-0800 [info] Step 9 is in state "end".
2022-12-12T23:40:36-0800 [info] show HTML page
2022-12-12T23:40:36-0800 [info] current version: 24.0.6 build time: 
```

As I'm writing this it's 12:15 am and I _just_ fixed things.

I've had this happen 3-4 times now, and every time I have to rediscover the solution. Instead of doing that again in 3-4 months, I figured I'd write it down here.

## The CLI updater

[NextCloud has a built-in CLI tool for updating](https://docs.nextcloud.com/server/latest/admin_manual/maintenance/update.html#using-the-command-line-based-updater) that you can initialize at any time via PHP. if your update bricks itself, chances are you can restart the upgrade process by re-running that upgrade script. This has been my saving grace literally every time I've had an update process stall out or crash altogether. 

The script seems remarkably good at recovering from whatever half-baked state your installation is in. That said, the solution is surprisingly simple. **Use the CLI updater, not the crash-prone web-based updater.** 

I'm sure that the CLI-based updater and the Web-based updater use the same code behind the scenes but when the web app becomes unresponsive or unreachable there literally isn't a way to kick the restart process. the CLI will always be there. 

### Using the CLI updater

The CLI updater is really easy to use, but since I have the [LinuxServer/NextCloud docker container](https://docs.linuxserver.io/images/docker-nextcloud) installed on my home lab the steps aren't exactly as defined in NextCloud's documentation. 

To kick off the CLI Updater after a failed update, just run the following command from the container's bash console. 

```bash
# for some reason, the container makes everything owned by abc
sudo -u abc php /config/www/nextcloud/updater/updater.phar
```

Once you type that in you'll see some prompts confirming that "hey you were at step  x, do you want us to resume from there?" or something to that effect. hit a quick `y + enter` and you're on your way!  