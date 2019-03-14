+++
title = "Optimizing your Dockerfile build layers"
slug = "optimizing-your-dockerfile-build-and-layers"
date = 2018-10-10
description = "Too many layers and your machines take a large amount of storage and can take a long time to download and extract.  Too few layers and the machine takes F  O  R  E  V  E  R to rebuild."
tags = [ 
    "docker",
    "dockerfile",
]
+++

```bash
Unable to find image 'nginx:latest' locally
latest: Pulling from library/nginx
802b00ed6f79: Downloading [================================================>  ]  21.63MB/22.49MB
5291925314b3: Download complete
bd9f53b2c2de: Download complete
```

The number of layers a container is using is related to the number of RUN and COPY/ADD commands that were used in the Dockerfile during that containers build.

Too many layers and your machines take a large amount of storage and can take a long time to download and extract.  Too few layers and the machine takes F  O  R  E  V  E  R to rebuild.

### How a Dockerfile builds

The way that a Dockerfile’s build happens is sequentially from the top to the bottom. The build is cached each time, so if you don’t change anything, and then rebuild the same container, the build will happen pretty instantaneously.

### A Single RUN Command

If we look at the following Dockerfile, this container has 2 layers that is a smaller implementation of a container for this particular application.

```dockerfile
FROM node:alpine
WORKDIR /app
COPY . /app
RUN npm install -q --no-color --no-progress \
	&& npm run build
```

All of the work for this container is being done in a single RUN command. This means that any time that anything changes in the source application, the container is going to have to rerun install, fetch all the dependencies again, and then run our build.

### Optimizing Your Dockerfile

Now that we know our Dockerfile is building from top to bottom, and each layered command is cached and only rerun when when something was changed, we can optimize our Dockerfile to make our life much better.

If we look at the optimized Dockerfile, we will notice that we’ve increased the number of layers to 6. The container has a few more layers, but overall the size of the machine has not increased.

```dockerfile
FROM node:alpine

WORKDIR /app

COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json

RUN npm install -q --no-color --no-progress

COPY tsconfig.json /app/tsconfig.json
# The application source is here
COPY src /app/src/

RUN npm run build

CMD ["npm", "run", "serve"]
```

If we step through the Dockerfile above:

* First we are defining the work directory to `/app`, this is the directory we will copy our application into.
* Next we are copying the `package.json` and `package-lock.json` into the container. These are the pre-install dependencies, any changes to these files will cause the container to rerun all the following commands.
* After we copy the dependency list’s into the app (the `package.json` file is a list of dependencies), then we go ahead and run the dependency install command, in the above example it is a node dependency install via `npm install`. The rest of the flags are just to make the install quiet.
* After installing our dependencies we copy in our source application code. This way, when our source code changes and our dependencies don’t, we won’t need to rerun our install command.
* After copying in our source code, we need to run the build command, this command is only going to be run if the source code was changed.
* The CMD is the end command our container is actually running.

#### One More Example

Bundling a Rails app might look like:

```dockerfile
FROM ruby

RUN apt-get update -qq && apt-get install -y build-essential libpq-dev nodejs \
    && mkdir /myapp \
    && rm -rf tmp/pids/* tmp/db

WORKDIR /myapp

COPY Gemfile /myapp/Gemfile
COPY Gemfile.lock /myapp/Gemfile.lock

RUN bundle install

COPY . /myapp

CMD ["bundle", "exec", "rails", "s", "-p", "3000", "-b", "0.0.0.0"]
```

Notice that we are copying our `Gemfile` and `Gemfile.lock`, installing our bundle dependencies, and then copying in our app and running the Rails engine.

### Summary

Optimizing your Dockerfile can make rebuilds a lot more painless, while still keeping the slimness of your container and limiting the number of layers

