---
title: 'Scheduling Python jobs'
type: 'post'
customSlug: scheduled-python-jobs-on-linux-v-windows
description: how to run scheduled python jobs on linux and windows
pubDate: 2022-09-13
tags: ['devops']
draft: false

---
Linux is typically my operating system of choice and if I ever needed to set up a quick scheduled job, I'd typically just do it via `crontab`. For the first time, I'm working on an app that only supports Window Server as a deploy target and had to sit down to figure out how people in Windows land do their task scheduling. 

This post will walk through how to set up a scheduled job on both Linux and Windows. While this is written specifically for Python jobs (which are just python apps written to run as a task), it could be generalized to any job that can be run via a shell command; just swap out Python for your interpreter or executable of choice.

## Prerequisites

All you need on your system is git and Python. I won't go into how to download them on your platform of choice but it has [a very googleable solution](https://letmegooglethat.com/?q=how+to+install+python+on+linux).

## Jobs on Linux

If you're on Linux, there are 6 relatively easy steps to set up your scheduled job:

1. git clone your python job repo into `/opt/my-job/`
2. open crontab via `crontab -e`
3. write a quick comment explaining what your job does and who wrote it.
4. copy a CRON expression from [crontab.guru](https://crontab.guru) that matches the schedule you'd like
5. write out your crontab expression `0 * * * * python /opt/my-job/app.py`
6. save the crontab file and you've got a scheduled Job on Linux ✨

I like the simplicity crontab offers, just run _this command_ at _this time_. If you stick with this format your crontab file stays pretty readable as well:

```bash
# crontab file

# send any pending alerts. - Mykal Machon
15 * * * * python3 /opt/email-sender/app.py

# audit uploads for violations. - Mykal Machon
5 * * * * python3 /opt/attachemnt-audit/app.py

# audit backups directory for violations. - Mykal Machon
5 * * * * python3 /opt/backup-audit/app.py

# create backups of all local databasess; wipes expired backups.
0 5 * * 1 python3 /opt/backup-systems/app.py

#... many more jobs
```

## Jobs on Windows

On Windows, there's a bit more work to do when setting up a scheduled job:

 1. git clone your python job repo into `C:\Program Files\my-job\`
 2. in your git folder, create a new file called `run-my-job.bat`
    1. paste the command you would use to run your program into this file and save it.
 3. open "task scheduler" by searching for it in the Windows menu
 4. create a folder by right-clicking on the "Task Scheduler Library" and selecting "New Folder"
 5. right click on your new folder and click "Create task", a dialogue should pop up.
 6. Setup basic task information
    1. Write up a name and a description for the task including the purpose of the job and who to talk to re: questions
    2. Select "Run whether the user is logged on or not"; this will make sure your job runs as long as the computer is on regardless of if a user is logged in.
 7. Click the triggers tab and start setting up your trigger
    1. Click "new" and a dialogue should pop up asking for info about your trigger.
    2. Under settings, choose "One time" and set the time to 5 minutes in the future. If you only want your script to run daily/weekly then select that instead.
    3. Under advanced settings, select "Repeat task every..." and select how often you'd like it to run (omit this step if you selected a daily/weekly run above).
    4. Click "OK" at the bottom of the dialogue
 8. Click the actions tab and start setting up your action (running your script is the action)
    1. Click "new" and a dialogue should pop up asking for info about your action.
    2. for "Program/script", select the `C:\Program Files\my-job\run-my-script.bat` file that we created earlier
    3. For "Start in", select the folder of your git repo: `C:\Program Files\my-job\`. This makes sure relative pathing still works.
    4. Click "OK" at the bottom of the dialogue
 9. Click "Ok" one more time to close the new task dialogue.
10. From there, you should have a scheduled job on Windows ✨

This is undoubtedly more complicated than a similar setup on Linux, but the whole process has some upsides.

The Windows Task Scheduler makes it pretty easy to see all your scheduled tasks, error states, when the task last ran, etc., etc. It's not as clean as the crontab file I showed off in the Linux section, but it gets a lot more information across in a unified interface.

## Final thoughts

Just by looking at the number of steps with Windows vs the number of steps with Linux you can tell that Windows requires more config to get up and running. While Linux's crontab is easier to configure, it lacks a lot of the advanced features that Windows task scheduler has.

Windows lets you trigger tasks when a user logs in when a specific event happens in Windows and a whole bunch more. You can also set conditions that make it so the job only runs when something triggers the script _and_ all conditions are true. With Linux, I would have my python code handle these conditions, but Windows makes it possible to avoid writing boilerplate codes for those edge cases.

All that said, I'm probably staying with Linux, and crontab moving forward. The simplicity of the solution is what makes it so sticky to use. If you have all your job code in source control, moving jobs to a different server is as simple as copying the /opt/ folder, moving over your secrets, and copy-pasting, the crontab file.
