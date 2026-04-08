---
pubDate: 2024-12-02
title: Observable Nginx
description: a gitops template for nginx with observability built in.
type: post
draft: true
tags: ['devops']

---
This is a bit of a follow up to [my other post on testing NGINX configs locally](https://mykal.codes/posts/how-to-test-nginx-configs-locally). I'll expand on how I've been updating, testing, deploying, and monitoring our reverse proxies and static sites at work. I've actually been running this at work for around 6 months now but finally got around to simplifying the setup and open sourcing it!

## What's the point?&#x20;

Up until I set this up at work, we were manually editing configs on our NGINX servers with `vi` (or `nano` if you didn't have a CS professor Stockholm syndrome you into vim), hitting it with a quick `nginx -t` to validate our config changes, then a `nginx -s reload` to apply our changes.&#x20;

While this has served us well and technically works, it's far from a perfect setup. Here's just a few issues you can run into editing things manually:&#x20;

* `nginx -t` **lies**: just because nginx tests pass, you have almost 0 guarantee your config changes work. nginx -t just tests for syntax.&#x20;
* **no easy backout**: if you do push a change, it better be small! larger changes are not properly testable and if you need to rollback you are either overwriting all your files and manually restarting, or restoring a snapshot. &#x20;
* **no source control**: there's no easy way to track changes made over time, manage changes in a structure way, review changes as a team, or even pull and test things locally.&#x20;
* **no centralized logging:** if you want to look at logs or metrics, you have to log into the machine and manually grab them.&#x20;

There are quite a few more issues, but those are the big issues I was looking to address.

## The gitops part&#x20;

The repo uses a bunch of tools to get a proper gitops flow going:&#x20;

* **Docker compose**: this sets up some infrastructure as code so you can get things going easily based on your environment.
* **GitHub Actions**: this does all the ci for the repository. it builds the docker container on commit, deploys it to GHCR, and tests it with some simple curl calls. In production, I'd recommend having more comprehensive testing here.
* **GitHub Container Registry (GHCR)**: this is just a container registry hosted by GitHub. We use it cause it keeps our source code, containers, and ci all in the same platform.
* **Watchtower:** automatic container updates on pushes to main/test/whateva!&#x20;

## The observability part

We use a Grafana stack at work for observability so I added on a bunch of config to meet those needs:&#x20;

* **Promtail**: this pushes our logs out to Loki which is a log aggregator.&#x20;
* **Prometheus-Exporter**: this spins up a password protected page that prometheus can pull from with basic NGINX metrics for us to monitor.
