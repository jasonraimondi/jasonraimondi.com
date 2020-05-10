---
categories:
- ops
comments: true
date: "2018-11-27T00:00:00-08:00"
description: Drone.io is a great, Docker based alternative to Jenkins that is a lot
  like a self hosted alternative to TravisCI. One of the best ways to get Drone automatically
  building your images for you, especially images that have a build stage, is to use
  a multi-stage Dockerfile
image: https://assets.jasonraimondi.com/posts/_covers/jason-raimondi-PBtuf1i48Ow-unsplash.jpg
slug: auto-deploy-docker-container-using-self-hosted-ci-drone-io-and-multi-stage-dockerfile
tags:
- docker
- drone.io
- ci
title: Auto deploy Docker containers using a self hosted CI (Drone 1.0.0-rc.1) and
  a multi stage Dockerfile
---

Drone.io is a great, Docker based alternative to Jenkins that is a lot like a self hosted alternative to TravisCI.

For a while, Drone was relatively stable, versioned at 0.8. Recently, Drone is approaching version 1.0.0, so the API has changed a bit. Examples will be using the version 1.0.0-rc.1 markup and may change slightly as we approach the full version 1.0.0

### Automating With Drone

To configure drone with your repository, you need to activate the repository inside of your running Drone Server. The [installation documentation](https://docs.drone.io/intro/) on the Drone website is straightforward, and will vary depending on the source code management system you use.

![Activate Drone for Repository Screenshot](https://assets.jasonraimondi.com/posts/2018/11/activate-drone.png)

After you’ve activated your repository, you are going to need to add a `.drone.yml` file to your repository. This file is going to contain the build steps and conditions that will trigger Drone to run.

```yml
# .drone.yml

kind: pipeline
name: default

steps:
- name: test
  image: node:alpine
  commands:
  - npm install
  - npm test

- name: publish
  image: plugins/docker
  when:
    event:
    - tag
  settings:
    repo: jasonraimondi/jasonraimondi.com
    username:
      from_secret: docker_username
    password:
      from_secret: docker_password
    tags = [
     - latest
     - ${DRONE_TAG}
    auto_tag: true
    force_tag: true
```


#### Step: Test

The “test” step has no conditions to run, thus will run for every commit that is pushed up to the repository. Every commit will run the test step, which will use the [node:alpine](https://hub.docker.com/_/node/) container and run the “commands” consecutively.

#### Step: Publish

The “publish” step has the condition that it will only be run on a new tag being created. Conditions can be anything from new tags, to pull requests, or even commits to a specific branch.

This step is also using the [Docker plugin by drone-plugins](http://plugins.drone.io/drone-plugins/drone-docker/).  At the time of writing this documentation, the linked page is out of date and is showing the version 0.8 syntax. My example above is showing the version 1.0.0-rc.1 syntax. Most of the API is the same, it is the `.drone.yml` syntax that is different.

### Multi Stage Dockerfile

One of the best ways to get Drone automatically building your images for you, especially images that have a build stage, is to use a [multi-stage](https://docs.docker.com/develop/develop-images/multistage-build/) Dockerfile.

The following Dockerfile is the one that is running and building this Jekyll site.

```dockerfile
FROM jekyll/builder as builder
RUN apk update && apk add --update nodejs nodejs-npm
WORKDIR /app/jekyll
COPY ./jekyll/Gemfile* /app/jekyll/
RUN bundle install
COPY ./jekyll /app/jekyll/
RUN mkdir -p /app/jekyll/_site && jekyll build

FROM nginx:alpine
LABEL maintainer="Jason Raimondi <jason@raimondi.us>"
RUN rm -f /etc/nginx/conf.d/* && rm -rf /app/*
COPY --from=builder /app/jekyll/_site /app
COPY ./nginx /etc/nginx/
```

This is a two stage Dockerfile, with the first “builder” stage pulling a `jekyll/builder` container, downloading the Gemfile dependencies and then building the jekyll site into `/app/jekyll/_site`.

The second stage of this is pulling from a base `nginx:alpine` container and it is copying the `_site` directory that was built in the previous stage into the `/app` directory.

### Automagic

Every time a tag is made on the repository, drone runs and builds the docker container, and pushes and tags them to either the public Docker Hub registry, or a private one. Going one step further, if you are using Docker Hub, you can have a hook that makes a post to your desired URL. If you listen to that URL, you can know when your containers/images were updated, so you can automate the pulling and redeploying the updated containers.

If you aren’t using Dockerhub, you can just use an “on success” step that happens after a successful tag build to submit the post to your URL.
