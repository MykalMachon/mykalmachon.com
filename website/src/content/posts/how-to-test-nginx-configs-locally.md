---
pubDate: 2024-10-30
title: How to test NGINX configs locally
description: How I quickly validate NGINX configs locally via the /etc/hosts file.
type: post
draft: false
tags: ['devops']
  - devops
  - webdev
  - nginx
---
I've been on a bit of a tear building out an NGINX reverse-proxy and web server repo at work complete with a whole bunch of goodies (automated testing, deploy, monitoring, and log aggregation, oh my!).

With that in mind, I've been writing a lot of web server config lately for a whole bunch of services. I needed a good way to quickly validate configs locally without pushing to a test server or changing DNS records and I ended up finding one after a bit of tinkering. Imma talk about it here!

## Why testing NGINX locally is a challenge

Imagine you're writing an nginx config for a web service called `someservice.machon.cloud`.

```conf
server {
    server_name someservice.machon.cloud;
    listen 80;

    return 301 https://$host$request_uri;
}

server {
    server_name someservice.machon.cloud;
    listen 443 ssl;

	  # Default Headers (HSTS, Cache, etc)
	  include /etc/nginx/conf.d/default_headers.conf;

	  # SSL config
    include /etc/nginx/conf.d/wildcard_ssl.conf;

    # proxy the site out
    location / {
        proxy_set_header Host $http_host; 
        proxy_ssl_verify off; 
        proxy_pass https://internal.machon.cloud:4321;
    }
}
```

Sweet! that looks good. It should proxy  `internal.machon.cloud:4321` and expose it through the domain `somservice.machon.cloud` on both port 80 and 443. So what's the problem?

Well, *how do you verify that this actually works*? How are you confident you don't need to proxy some additional headers or information before you deploy?

* NGINX will only serve the site if it sees traffic coming in for `someservice.machon.cloud`
  * &#x20;if you spin in up and go to localhost:443 or localhost:80 you're not going to see what you expect.&#x20;
  * You'll probably see the basic NGINX server page.
* You can't point DNS records directly at your machine (unless you're running a public IP on your dev machine or something).&#x20;
* So your options are then to deploy this change to your test server, then update your actual DNS records, wait for them to propagate, then test it?

*no way!* what if you already have a service up on that subdomain? seems messy! I don't like it! I won't do it! What else can we do?

## How to override DNS records locally

In walks the `/etc/hosts` file!  Open up your text editor of choice and load up your hosts file

* If you're on windows, open up `C:\Windows\System32\drivers\etc\hosts`.
* If you're on linux/unix open up... well `/etc/hosts`. That's much easier to remember.

Once open, you can add a line to map the hostname you want to test with to localhost aka `127.0.0.1` for ipv4 and `::1` for ipv6.

```/etc/hosts
127.0.0.1  someservice.machon.cloud
::1        someservice.machon.cloud
```

Yup! it is that easy! Just save the hosts file and whenever you make a request to `somservice.machon.cloud` it'll direct that traffic to your local machine.

## How to test your NGINX configs

To test your config and your service just spin up your NGINX instance with your new config locally (I do this with docker, but you could probably do this with an actual NGINX install too I guess).

Once NGINX is up, open `https://someservice.machon.cloud` in your browser and traffic should be forwarded to your local NGINX instance. You can confirm this by checking the NGINX access log for incoming traffic.

You can then quickly edit your config, and restart NGINX to pick up and test any new changes.

*After you're done testing, either comment out or remove the lines we added to the hosts file.* This will stop forwarding traffic to your local machine and probably save you an hour or two of confusion as to why prod is down but only on your machine.

> One note: you might get some HTTPS errors when testing, this is probably because you don't actually have a valid HTTPS certificate in place locally. This is totally fine and actually expected. In my opinion, that's something I'm comfortable validating in an actual test environment.

## Why does this work?

Essentially, the hosts file just maps IPs to hostnames but only for your machine. Before your machine makes a call out to DNS it checks the hosts file. If there's an entry that matches the domain in the hosts file, it will *always* use the mapped IP.

So what does that look like when you're actually make an HTTP call in an application?

* Your application will make a call to the network layer requesting an IP for the domain `someservice.machon.cloud`
* Your system checks the hosts file and finds  `someservice.machon.cloud` there.  Your system returns the mapped IP address to your application.
* Your application would send traffic over to localhost:80 for http or localhost:443 for https.
* Since NGINX is listening (or should be) to these ports it processes the traffic.
* NGINX will recognize the domain and serve the right site!

This is obviously a pretty oversimplified explanation and there is a lot more going on. This is just explained to the level that I understand it. If this is terribly wrong, in this one case, please let me know. I'm actually sort of interested as to exactly how this works.

Happy NGINX testing y'all!
