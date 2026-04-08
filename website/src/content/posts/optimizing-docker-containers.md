---
title: Notes on optimizing docker images
customSlug: notes-on-optimizing-docker-images
description: 'docker images are relatively easy to get up and going, but can often
  be heavily optimized. '
pubDate: 2022-07-25
type: 'post'
heroImage: '../../assets/posts/optimizing-docker-containers.avif'
tags: ['devops']
draft: true

---
As I've been building and shipping more and more docker images, I've realized that while it's easy to get up and going, it can require quite a bit of work to get a "good" docker container setup.

Things you can do for a better docker container can include:

* Create separate docker images for production, and development
  * production image: slimmed down version of dev, don't volume mount unless necessary
  * dev image: full-fat version of dev that runs any development/live-reload services.
* Experiment with different base images
  * just, don't use the `:latest` tag in your base image, ever.
  * experiment with Debian alternatives like `alpine`, `buster`, and `slim`
* Limit access by running the app as a non-root user
* Multistage builds to save build time
* Use docker-compose as a default
  * run commands via the docker-compose config to save time.

## A starting point...

To make this a bit easier to discuss, we're going to start with a very basic dockerfile example that is good enough to get you up and going but has lots of room for improvement.

```bash
    FROM ubuntu:latest
    
    # install os dependencies
    RUN apt-get update && apt-get install
    RUN apt-get python3 python3-dev python3-pip
    RUN apt-get clean && rm -rf /var/lib/apt/lists/*
    
    # mount application code
    WORKDIR /app
    COPY my-app my-app
    
    # install app dependencies
    RUN pip3 install -r requirements.txt
    
    # run the application
    EXPOSE 8080
    CMD ["python3", "-m", "my-app:start_app()"]
```

okay, so what are the pain points with the approach above?

1. A re-build is required whenever code changes are made
2. Builds take \~3-5 minutes, docker's caching layers are working against us.
3. the image is pretty big (\~450MB)

### Experiment with different base images

There are a few issues with the base image we use in the dockerfile above.

1. we use a full-fat ubuntu image which brings along the way too many dependencies, and in turn size (\~450MB)
2. we're depending on ubuntu's package manager to install the core language dependencies.
3. we use the `:latest` tag which means that builds use ephemeral ubuntu releases, one day our build can be based on version x, and the next it can be on version y (which breaks something).

We can fix these three points by: 

1. use a language-specific image (i.e the Python base image) 
2. point 2 is also solved by point 1
3. use a specific version of the image that you've tested and validated. 

Let's see what that looks like in the updated image:

```bash
    FROM python:3.8-slim-buster
    
    # update dependencies
    RUN apt-get update && apt-get -y upgrade
    RUN apt-get clean && rm -rf /var/lib/apt/lists/*
    
    # mount application code
    WORKDIR /app
    COPY my-app my-app
    
    # install app dependencies
    RUN pip3 install -r requirements.txt
    
    # run the application
    EXPOSE 8080
    CMD ["python3", "-m", "my-app:start_app()"]
```

Awesome, this brought the size of our base image down from 450MB -> 45MB! That's a lot of saved space for other important things, like your node_modules folder 😉

### Limit access by running the app as a non-root user

information goes here

### Multistage builds to save build time

A lot of the time, you need builders

### Use docker-compose as a default

Instead of having to remember the long and sometimes complicated docker run commands you'd have to run in the terminal, you can just use a docker-compose.yml file to store your config.

This also makes it really easy to spin up "accompanying" containers for dev/testing (e.g. a PostgreSQL DB, Redis Cache, etc.)

### Containers for production and development

This is mostly a developer experience improvement, but it can actually improve your deploy experience, especially if you heavily use volumes for live reloads in development.