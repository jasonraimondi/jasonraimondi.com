+++
title = "Setting up a private git server using Gogs"
slug = "setting-up-gogs-with-docker"
date = 2017-09-04
description = "Getting a private Git/Gogs server behind SSL is actually surprisingly easy to get going. Let's see what it takes to get a containerized Gogs + MySQL running on a VPS server behind SSL using Docker."
tags = [
    "gogs",
    "ssl",
    "nginx",
    "lets-encrypt",
    "docker",
]
categories = [
    "ops",
]
+++

Update: Shortly after writing this article, I found out the shortcomings of Gogs, and how Gitea, a community maintained fork of Gogs is much more active and has a lot more features. Gitea is a lot better than Gogs, the installation is mostly the same.

### 1. Cloning the Starter Project

Lets start with my base project found on github [here, starter-docker-gogs](https://github.com/digitalcanvasdesign/starter-docker-gogs).  This project is meant to be a kicking off point and I would assume if anyone uses it they are just nuking the `.git` directory at project root and starting their own history.

```md
git clone https://github.com/digitalcanvasdesign/starter-docker-gogs
cd starter-docker-gogs
rm -rf .git
``````

Yep, **nuke the git instance included and reinitialize it with your own** git history using `git init`.

#### Be Aware of your Environment Configurations (`.env`)

The contents of our `.env.sample` are as follows:

```md
MYSQL_ROOT_PASSWORD=rootpass
MYSQL_DATABASE=gogs
MYSQL_USER=gogs
MYSQL_PASSWORD=gogs
````

- `MYSQL_ROOT_PASSWORD` = This variable is mandatory and specifies the password that will be set for the MySQL root superuser account. In the above example, it was set to 'gogs'.
- `MYSQL_DATABASE` = This variable is optional and allows you to specify the name of a database to be created on image startup. If a user/password was supplied (see below) then that user will be granted superuser access (corresponding to GRANT ALL) to this database.
- `MYSQL_USER`, `MYSQL_PASSWORD` = These variables are optional, used in conjunction to create a new user and to set that user's password. This user will be granted superuser permissions (see above) for the database specified by the MYSQL_DATABASE variable. Both variables are required for a user to be created.

#### Update the `Makefile` Command `generate-ssl-cert` with Domain Info

Inside of our main `Makefile`, you will find a command called `generate-ssl-cert` with some defaults still in there.

```makefile
generate-ssl-cert:
	docker run -ti -v ./data/letsencrypt:/etc/letsencrypt -v ./data/certs:/etc/certs certbot/certbot certonly --webroot -w /etc/letsencrypt/webrootauth -d YOUR_DOMAIN --email YOUR_EMAIL --agree-tos
````

You need to edit the `Makefile` and update the fields 'YOUR_DOMAIN' and 'YOUR_EMAIL' to the domain you are using, and your email for registration with Let's Encrypt.

- `YOUR_DOMAIN` = to the domain you are going to be using
- `YOUR_EMAIL` = email address for Let's Encrypt to send info about certs (i.e. a certificate expiring soon)


### 2. Getting Your Server Configured with Docker and Docker Compose

Any VPS will do; Digital Ocean, Linode, AWS... whatever. We just need to have a domain with your DNS pointing your domain correctly to the server. We need to be hitting an actual domain and not an IP address that Let’s Encrypt can directly ping.

#### Install Docker

If you have not installed Docker yet, it is pretty easy, just follow the install guide for your distro. You are going to want to install the CE version, this is the Community Edition.

- [Get Docker CE for Debian](https://docs.docker.com/engine/installation/linux/docker-ce/debian/)
- [Get Docker CE for Ubuntu](https://docs.docker.com/engine/installation/linux/docker-ce/ubuntu/)

#### Install Docker Compose

This project is using Docker's Compose, which is a tool by Docker that assists in the management of multi-container docker images.

If you don't already have `docker-compose` installed, you can go ahead and grab it with the following command:

```bash
sudo apt-get update
sudo apt-get install docker-compose
```

You can check out the [official Docker Compose docs](https://docs.docker.com/compose/overview/) if you are interested in learning more.

#### Familiarize Yourself with our `docker-compose.yml`

The docker-compose.yml is what is bootstrapping this project. It may seem like our `make` commands are doing this, but if you look inside of our `Makefile`, all of our makefiles are just wrapping docker-compose commands.

```yml
version: "2"

services:
  nginx:
    build: ./nginx-ssl
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/conf.d:/etc/nginx/conf.d
      - ./nginx/include:/etc/nginx/include
      - ./data/letsencrypt:/etc/letsencrypt
      - ./data/certs:/etc/certs

  gogs:
    image: gogs/gogs
    ports:
      - "2222:22"
      - "127.0.0.1:3000:3000"
    volumes:
      - ./data/gogs:/data

  mysql:
    image: mariadb:latest
    volumes:
      - ./data/mysql:/var/lib/mysql
    ports:
      - "127.0.0.1:3306:3306"
    env_file:
      - .env
````


Both MySQL and Gogs section, we are directly referencing the official image. You can see under the nginx section, we are defining a build directory of `nginx-ssl`. This is because we need to add some SSL certificates and keys inside of this container to get it ready to serve our Gogs instance over https.

#### The Three Containers

We will have a Gogs instance running with MySQL as our database and Nginx to reverse proxy and serve our private Git repo over SSL.

In our case, the we are going to be using three separate containers:

- [Nginx](https://hub.docker.com/r/_/nginx/)
- [MySQL](https://hub.docker.com/_/mariadb/) (Technically MariaDB, an Open Source fork of MySQL)
- [Gogs](https://hub.docker.com/r/gogs/gogs/)

All three of our containers will be using the official containers as our base. Our Gogs and MySQL containers are going to be used without the need to add additional layers to them. Our Nginx container is going to need some very minor additions added into the base container.

### 3. Using Let's Encrypt to Generate SSL Certificates with `make install`

First before running our `make install`, we need to set up our production `.env` file so our production Mysql instance is secure. Please generate a random secure password for both the **MYSQL_ROOT_PASSWORD** and the **MYSQL_PASSWORD**.

#### Set Up Production `.env` File.

We are using a `.env` file to maintain our environment variables. Right now, our variables are pretty limited, we really only have the settings for our MySQL container.

Go ahead and run the following command:

```bash
make copy-env
```

This is going to copy our `.env.sample` to `.env` without worry about overwriting an existing copy.

```makefile
copy-environment:
	cp -n .env.sample .env
```

#### Using the `make install` Command

I have bundled a simple helper that will basically chain together everything that needs to be done in order to generate your Let's Encrypt certificates on a new server with Docker and Docker Compose installed.

```makefile
install: generate-dhparam pull build start generate-ssl-cert
```

What the `make install` command is doing is basically chaining together and running the following commands consecutively:

```bash
make generate-dhparam
make pull
make build
make start
make generate-ssl-cert
```

##### Part A `make install`: generate-dhparam

Before we are able to generate an SSL certificate using Let's Encrypt, we need to first generate a  your Diffie-Hellman key. There is little risk if this key is exposed, but you probably want to keep this key private.

If you already have `openssl` installed on your machine, **from the root of our starter-docker-gogs project**, run the command:

```bash
openssl dhparam -out dhparam.pem 2048
```

If you do not already have `openssl` installed on your machine, do not fret, you should definitely have Docker installed on your machine. We can generate this file using a super slim (3M) container I built as a helper. So, **still from the root of our starter-docker-gogs project**, run `make generate-dhparam` to run the following command in our `Makefile`:

```makefile
generate-dhparam:
	docker run -ti -v $PWD/nginx-ssl:/certs digitalcanvasdesign/openssl dhparam -out /certs/dhparam.pem 2048

```

Please check out my openssl container on [Docker Hub](https://hub.docker.com/r/digitalcanvasdesign/openssl/) or the [GitHub Project](https://github.com/digitalcanvasdesign/docker-openssl) if you are interested in poking around.

##### Part B `make install`: pull

Simply running `docker-compose pull`, this pulls all remote images and updates them to the latest version hosted.

##### Part C `make install`: build

Simply running `docker-compose build`, this runs any Dockerfile builds that are used in the project. In our case, we are building the `nginx-ssl` container.

##### Part D `make install`: start

On the first run, we are going to use this simple nginx server block to open an empty webroot for our Let's Encrypt SSL generation.

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN;
    include /etc/nginx/include/lets-encrypt-location;
}
```

What we are doing is opening our server to port 80 to allow the Let's Encrypt tool, `certbot`, to ping our server and generate certificates for us.

##### Part E `make install`: generate-ssl-cert

This should only take a second or two, it is going to hit Let's Encrypt servers and then ping back to us. Since we already have the two flags `--email` and `--agree-tos`, we should not get any subsequent prompts (although recently I have noticed the `certbot` tool asking to share your email with the EFF to build their mailing list).

### 4. Update the Nginx Server Block in `gogs-ssl.conf` to Listen for SSL Traffic

After we run Certbot the first time, we can delete the small Let's Encrypt block and uncomment the two blocks below.

For our final file at `./nginx-ssl/conf.d/gogs-ssl.conf` should look exactly like the following, but with `YOUR_DOMAIN` of course replaced with yours.

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN;
    include /etc/nginx/include/lets-encrypt-location;

    return 301 https://YOUR_DOMAIN$request_uri;
}

server {
    listen 443 ssl http2;

    server_name YOUR_DOMAIN;

    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN/privkey.pem;
  	include /etc/nginx/include/ssl-security;

    error_log  /var/log/nginx/YOUR_DOMAIN.error.log;
    access_log /var/log/nginx/YOUR_DOMAIN.access.log;

    include /etc/nginx/include/lets-encrypt-location;

    location / {
        proxy_pass http://gogs:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_read_timeout 90;
    }
}
```

We have two server blocks in this file; the first is listening to traffic to your domain on port 80, catching any non-ssl traffic, and redirecting it through the same domain over SSL on port 443.

One interesting thing about this is the `proxy_pass http://gogs:3000`. Typically, you'd proxy pass to the same machine you are on (i.e. `proxy_pass 127.0.0.1:3000`), but since Gogs is running in a container, it is not technically running on `127.0.0.1`, but instead, it is sort of inside a subnet on your local machine.  This is a Docker thing; one way two Docker containers can talk to each other is by the literal machine name. In our case, this is as defined in our `docker-compose.yml`, our container running Gogs is simply named `gogs`.

```yml
gogs:
    image: gogs/gog
    ...
```

### 5. Restart the Containers

After you've updated your `gogs-ssl.conf`  we can go ahead and restart our

```md
make stop clean build start
```

This is basically just going to run the commands, `stop -> clean -> build -> start`, in a series without having to type them out one by one.

Ideally you should see something similar to the following (note the **up** state):

```bash
            Command               State                        Ports
---------------------------------------------------------------------------------------------------------
dockergogs_gogs_1      /app/gogs/docker/start.sh  ...   Up      0.0.0.0:2222->22/tcp, 127.0.0.1:3000->3000/tcp
dockergogs_mysql_1     docker-entrypoint.sh mysqld      Up      127.0.0.1:3306->3306/tcp
dockergogs_nginx_1     nginx -g daemon off;             Up      0.0.0.0:443->443/tcp, 0.0.0.0:80->80/tcp
```


### 6. Configure Gogs

Now we are getting to the home stretch, really all we have left to do is set up our Gogs settings now. First, we will set up Gogs using the GUI installer, and then we are going to move on and do some further settings in our main Gogs config file located in your project at `data/gogs/gogs/conf/app.ini`.

A full list of settings can be found in the [Gogs Cheat Sheet](https://gogs.io/docs/advanced/configuration_cheat_sheet)

#### Initial Gogs Setup

- DB Connection
- Domain Information
- Port Info
- SSH Info
- Admin User

#### Further Configuration of Gogs

- Mailer
- Private Mode
- Full Private Mode

## Overview

**[1.](#1-cloning-the-starter-project) Clone a copy of the project:**
```bash
git clone https://github.com/digitalcanvasdesign/starter-docker-gogs` on your local machine**
```

  - Nuke the contained git history and reinitialize your own with `git init`
  - Edit to the `Makefile` and update the fields 'YOUR_DOMAIN' and 'YOUR_EMAIL'

**[2.](#2-getting-your-server-configured-with-docker-and-docker-compose) Get your server configured.**
  - Install Docker & Docker Compose
  - Clone your repository to your server

**[3.](#3-using-lets-encrypt-to-generate-ssl-certificates-with-make-install) Using Let's Encrypt to Generate SSL Certificates with `make install`**
  - Part A `make install`: copy-environment
  - Part B `make install`: generate-dhparam  - The dhparam.pem generation takes a bit.
  - Part C `make install`: pull
  - Part D `make install`: build
  - Part E `make install`: start
  - Part F `make install`: generate-ssl-cert -  You may need to answer Let's Encrypt Prompts here

**[4.](#4-update-the-nginx-server-block-in-gogs-sslconf-to-listen-for-ssl-traffic) Update your `gogs-ssl.conf`**
  - Remove the first server block, leaving the port 80 redirect to https and the main server block listening on port 443.

**[5.](#5-restart-the-containers) Run `make build start`.**
  - This is going to copy the new `gogs-ssl.conf` file into your container and then restart it.

**[6.](#6-configure-gogs) Visit Your SSL domain, you should see the Initialize Gogs screen.**
  - Now you have to set up gogs
  - Commit the gogs `app.ini` generated from your server and push to your repository.

