---
archived: true
categories:
  - ops
comments: true
date: "2018-08-21T00:00:00-07:00"
description: If you’ve ever configured Docker + Nginx + Lets Encrypt before, it takes
  some time. Tools like Certbot have made this process easier, but they are not without
  flaws, especially when deploying to a docker environment. Traefik makes it a cinch.
images:
  - /covers/sam-loyd-qy27JnsH9sU-unsplash.jpg
slug: docker-compose-traefik-lets-encrypt
tags:
  - docker-compose
  - traefik
  - docker
  - lets-encrypt
title: Docker Compose, Traefik 1.7 + Lets Encrypt
---

If you’ve ever configured Docker + Nginx + Lets Encrypt before, it takes some time. Tools like Certbot have made this process easier, but they are not without flaws, especially when deploying to a docker environment. Traefik makes it a cinch.

Maintaining nginx configurations as well as SSL certificates is doable. Deploying a new container to a domain and getting that configured with SSL can take a bit of time but it is by no means impossible. For each deployed site, you need to have a `site.conf` nginx file and several more files for nginx certificates. All of these files need to be deployed in the nginx container and mounted to the host machine so when the container is rebuilt you do not lose your certificates. Check out my post on [configuring lets encrypt with nginx using docker](./2017-08-22-configure-ssl-lets-encrypt-nginx-docker.md) if you really want to find out.

With Traefik, there is one `traefik.toml` configuration file, and one json file, defaulted to `acme.json` that needs to be mounted. With these two files, you can effectively deploy _n_ number of secured sites.

#### Traefik Container

The Traefik container is pretty simple to deploy. This is the only container that we need to mount to the filesystem to maintain our SSL certificates.

```yml
traefik:
  restart: always
  image: traefik:1.7
  command:
    - "--api"
    - "--entrypoints=Name:http Address::80 Redirect.EntryPoint:https"
    - "--entrypoints=Name:https Address::443 TLS"
    - "--defaultentrypoints=http,https"
    - "--acme"
    - "--acme.storage=/etc/traefik/acme/acme.json"
    - "--acme.entryPoint=https"
    - "--acme.httpChallenge.entryPoint=http"
    - "--acme.onHostRule=true"
    - "--acme.onDemand=false"
    - "--acme.email=jason@raimondi.us"
    - "--docker"
    - "--docker.watch"
  volumes:
    - /var/run/docker.sock:/var/run/docker.sock:ro
    - ./traefik/acme:/etc/traefik/acme
  ports:
    - "80:80"
    - "443:443"
```

#### Deploying a Secure Site

The magic of Traefik is done through labels.

```yml
labels:
  - "traefik.enable=true"
  - "traefik.port=5000"
  - "traefik.frontend.rule=Host:containers.jasonraimondi.com"
```

- `traefik.enable` : will the site be available through the load balancer.
- `traefik.port`: the port the load balancer needs to connect to the application on (and Express.js application would be typically be port 3000).
- `traefik.frontend.rule`: the domain to host the site on, this value can be a comma separated list of multiple domains.

```yml
registry:
  restart: always
  image: registry:2
  volumes:
    - /mnt/data/registry/registry:/var/lib/registry
    - /mnt/data/registry/data:/data
  environment:
    REGISTRY_STORAGE_FILESYSTEM_ROOTDIRECTORY: /data
  labels:
    - "traefik.enable=true"
    - "traefik.port=5000"
    - "traefik.frontend.rule=Host:containers.jasonraimondi.com"
```

Once you have the configuration `traefik.toml` and the Traefik container ports exposed, just add more containers with labels and watch the magic. It takes about 10 seconds after booting the new containers to get your initial certificates. Subsequent boots will be near instantaneous.

#### Auto Renewing Certificates

Traefik maintains the auto renewing of the Lets Encrypt certificates, so you can sit back and not have to worry.

### Examples

A example of Traefik **WITH** Lets Encrypt can be viewed [here](https://github.com/jasonraimondi/docker-compose-traefik-example/tree/master/lets-encrypt-example).

A simple example of Traefik **WITHOUT** Lets Encrypt can be viewed [here](https://github.com/jasonraimondi/docker-compose-traefik-example/tree/master/simple-example).
