+++
title = "Archive the GitHub repositories that matter"
slug = "always-up-to-date-archive-of-github-repositories"
date = 2020-05-09
description = "Keep an always up to date archive of the GitHub repositories that matter to you using Gitea mirror repositories"
tags = [ 
    "deno",
    "github",
    "gitea",
    "data hoarding",
    "typescript",
]
categories = [
    "misc",
    "ops",
]
image = "https://assets.jasonraimondi.com/posts/_covers/under-construction.jpg"
imageCredit = "@hojipago https://unsplash.com/photos/D46mXLsQRJw"
imageAlt = "under construction crane"
+++ 

There will be many buzz words, many.

[Gitea](https://gitea.io) is a self-hosted git platform that has many great features, among them are a great web interface and mirror repositories.

I wrote a tool using [Deno](https://deno.land/) to spider through a GitHub user's relevant repositories and add them to an instance of Gitea as [mirror repositories](#gitea-and-the-mirror-repository-type). 

## Gitea and the mirror repository type

One of the many great features of Gitea is the "mirror repository". The mirror repo allows us to mirror repositories from existing sources, such your favorite open-source GitHub projects. 

Mirror repositories update on cronjobs managed by Gitea. 

### Try Gitea using Docker

For a quick look, try docker run

```bash
docker run --rm -p 3000:3000 gitea:gitea
```

For a more permanent, use docker-compose

Here is a lean `docker-compose.yml` file for getting a local gitea running and mounting repositories and configs. Using this configuration, repositories will be saved in a directory called `repositories` next to your `docker-compose.yml` file.

```yaml
version: "3.7"

services:
  server:
    image: gitea/gitea:latest
    environment:
      - USER_UID=1000 # owner user of repos user uid
      - USER_GID=1000 # owner group of repos gid
    restart: unless-stopped
    volumes:
      - ./config:/data
      - ./repositories:/data/git/repositories
      - /etc/timezone:/etc/timezone:ro
      - /etc/localtime:/etc/localtime:ro
    ports:
      - "3000:3000" # bind serve port directly or use reverse proxy 
      - "222:22"    # ssh port into container
```

Boot the gitea instance

```bash
docker-compose up -d
```

Follow install steps.

![gitea install screen](/)

Most of the default configuration should be correct for a local testing instance. If you are using the docker-compose configuration, all of these fields are available for editing in the file `./config/`

If you have created a user in the install step, go ahead and log in. If you havent, you can register a user now via the "Register" link and this user will be an administrator.

Now you need to go in and create an access token for [deno-mirror-to-gitea](https://github.com/jasonraimondi/deno-mirror-to-gitea) to work.

![gitea create access token screen](/)
