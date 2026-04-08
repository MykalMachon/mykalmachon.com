---
title: Tracking popular posts
type: 'post'
customSlug: tracking-popular-posts
description: Let's implement a self-hosted web analytics system to track my popular
  posts
pubDate: 2022-11-26
tags: ['devops', 'webdev']
draft: true

---
I've been reading a lot of blogs lately and have noticed a bunch of my favourite sites have a "popular posts" section on their home page. All the work around this post was building up to this

## The architecture

Before we break things down step-by-step, let's check out a little architecture diagram to get our bearings:

![](https://res.cloudinary.com/mykalcodes/image/upload/v1669490875/Mykal%20Codes/popular_post_architecture_aqlmhq.png)

## Choosing an analytics service

To have any sort of insight into what's "popular", you're going to need some sort of view tracking on your site aka "web analytics". You're also going to need an API or some sort of interface to programmatically request those post stats.

While I've had analytics systems in the past, I've always found a functional or ethical deal breaker that's kept me away from them in the past.

Let's quickly go over the services I've used, and the issues I've had with them:

* [Google Analytics](https://analytics.google.com/analytics/web/) felt like a firehose of information and I didn't love that I was subjecting visitors to google's ad-tech pipeline.
* [Fathom](https://usefathom.com/) was a lot closer to what I wanted. It provided just the basics data-wise, and was cookieless but didn't have an API or an easy way to export data (_both features have been added since I left_).
* [Umami](https://umami.is/) felt like fathom but with all the features I wanted. Still, when I hosted it on [Railway](https://railway.app), I had many issues upgrading. Specifically with database migrations that wiped the database 🙃

It's been around 6 months since I've had any sort of analytics on my site and since Umami was _functionally_ exactly what I wanted, I figured I'd give that another shot. This time, I was going to host it on a server in my house, [MoonTurtle](https://mykal.codes/uses/#-nas-server-aka-moonturtle).

## Setting up Umami Analytics

Thanks to the operating system on the MoonTurtle server, Unraid, setting up Umami was relatively simple. All I needed to do was set up the docker image for Umami, create a database on my MySQL DB and finally update some config in my NGINX proxy manager application...

### Creating the Umami database

Before we can set up an umami instance we need to create a database and database user for the umami application to use. Just log in to your MySQL DB of choice and...

```sql
-- create a new database
CREATE DATABASE umami;
    
-- create a new user + password
CREATE USER 'umami_admin'@'*' 
IDENTIFIED WITH mysql_native_password 
BY '<some-password-goes-here>';
    
-- grant the new user all privileges on the umami database
GRANT ALL PRIVILEGES ON umami.* 
TO 'umami_admin'@'*' WITH GRANT OPTION;
```

Since I already have a MySQL database setup, I just used that. If you need a database, you can [spin one up on Railway ](https://docs.railway.app/develop/services#database-services)with a few clicks, or [set up a docker container](https://hub.docker.com/_/mysql).

I typically use [TablePlus](https://tableplus.com/) to connect to my home lab DB's, check them out.

### Creating the Umami docker image

Now that we have a database and database user, we have all the credentials required to set up the Umami docker container on our Unraid server:

1. Login to the Unraid Dashboard
2. Click the "Docker" tab
3. Click the "Add Container" button below the list of your current containers
4. Name the repository "umami" or something similar
5. Use the following link to their docker repository
   1. ghcr.io/umami-software/umami:mysql-latest
6. Create some environment variables for the container
   1. `DATABASE_URL`: a MySQL connection string for the DB
   2. `DATABASE_TYPE`: this should just be `mysql`
   3. `HASH_SALT`: the salt used for passwords in the system
7. Create a port mapping to expose the web port outside the container
   1. this should map the internal port 3000 -> an external port of your choosing
8. Fill out all your environment variables
9. Click save and watch the magic happen

After the docker image has been pulled down from the container registry and the application has (hopefully) started up, we should be able to navigate to your umami instance at `http://<your-unraid-servers-ip>:<port from step 7>.`

The default username and password is admin/umami. Once you're in I would recommend changing that ASAP.

### Updating NGINX

Now that the app is up and running, let's expose it to the rest of the world. Since I use NGINX Proxy Manager (which is just a web GUI on top of NGINX) adding a new site is pretty dang easy.

See their docs for more info on how to use NGINX proxy manager to add a site. In my case, all I had to do was put in the subdomain I wanted to use ([stats.tbx.sh](https://stats.tbx.sh)) and select the IP and port of the app reachable from my network. 

I could have used any reverse proxy for this (Caddy, Apache, etc.), NGINX is just what I'm familiar with. 

### Adding Umami to the site

Adding umami to your site is the last step in actually collecting analytics. 

## Working with the Umami API

### Creating a serverless function

### Building the "popular posts" view

## Keeping the site up to date

### Why not make it dynamic

### Netlify build hooks

### Setting up a job to rebuild the site

## Things to improve

### Static + dynamic

### Integration in more places