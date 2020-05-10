---
categories:
- ops
comments: true
date: "2017-08-22T00:00:00-07:00"
description: Some notes on setting up HTTPS on your server using the official Let's
  Encrypt Docker Image.
slug: configure-ssl-lets-encrypt-nginx-docker
tags:
- php
- nginx
- lets-encrypt
- docker
- ssl
title: Configure SSL Using Let’s Encrypt, Nginx, and Docker
---

We will be using the official [Docker Hub Cerbot Image](https://hub.docker.com/r/certbot/certbot/) that will handle the Let’s Encrypt SSL Certificate generation.

### 1. Generate your Diffie-Hellman Key

Run the following command to generate your `dhparam.pem` key. There is little risk if this key is exposed, but you probably want to keep this key private. This Stack Overflow answer, [Can they be public?](https://security.stackexchange.com/a/94397) was fairly informative on the subject.

```markdown
git clone git@github.com:jasonraimondi/post-docker-php-nginx.git sample-app
cd sample-app
cd docker/prod/nginx
openssl dhparam -out dhparam.pem 2048
```

### 2. Set Nginx to Listen on Port 80

The first run is going to be a little bit different than subsequent ones. We are going to need to modify our sites nginx configuration to listen on Port 80 instead of 443.

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_HERE;

    access_log /var/log/nginx/YOUR_DOMAIN_HERE.access.log;
    error_log  /var/log/nginx/YOUR_DOMAIN_HERE.error.log;

    root /var/www/public;
    index index.php;

    location = /favicon.ico {
        access_log off;
        return 204;
    }

    location / {
        try_files $uri $uri/ /index.php?_url=$uri&$args;
    }

    location = /index.php {
        include fastcgi_params;
        fastcgi_param ENVIRONMENT “dev”;
        fastcgi_pass php-fpm:9000;
        fastcgi_index index.php;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

### 3. Run the Let’s Encrypt certbot Docker container to generate certificates.

We need to generate the our Let’s Encrypt SSL certificates so we can serve our production site over https. We are using Let’s Encrypt because it is a free service that is reliable and well estableshed in the community.

The following is our command to run the certbot command to create your initial ssl certificates. What we are doing here is grabbing the latest version of the [certbot/certbot](https://hub.docker.com/r/certbot/certbot/) container.

```bash
docker run -ti certbot/certbot certonly
	-d $YOUR_DOMAIN
	-v </path/to/letsencrypt>:/etc/letsencrypt
	-v </path/to/certs>:/etc/certs
	—webroot -w /var/www/public
	—email $YOUR_EMAIL
	—agree-tos
```

What is a little tricky about this one is that you need to have the paths correct for the volumes. The host path
The volume parameters are split into two, separated by a colon. The left hand side is the host machine and the right hand side is the path inside of our container.

Here is an example of one for this site:

```bash
docker run -ti certbot/certbot certonly
	-d jasonraimondi.com
	-d www.jasonraimondi.com
	-v ./data/letsencrypt:/etc/letsencrypt
	-v ./data/certs:/etc/certs
	—webroot -w /var/www/public
	—email jason@digitalcanvasdesign.net
	—agree-tos
```

### 4. Update Nginx to Forward Traffic Over SSL

After you’ve run the `certbot` command and completed the initial generation of the certificates from Let’s Encrypt you are going to need to update your sites nginx conf to serve our site out of port 443 with http2 enabled.

Inside of the docker image, this should be located at:

```markdown
/etc/nginx/ssl_security.conf
```

```nginx
ssl_dhparam /etc/nginx/ssl/dhparam.pem;
ssl_protocols TLSv1.2 TLSv1.1 TLSv1;
ssl_ciphers ‘ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA’;

ssl_prefer_server_ciphers on;

add_header Strict-Transport-Security “max-age=31536000”;
```

### 5. Include Let’s Encrypt Default Location

Include a Let’s Encrypt default location out of the webroot.

Inside of the docker image, this should be located at:

```markdown
/etc/nginx/conf.d/lets-encrypt-location
```

```nginx
location /.well-known/acme-challenge {
    root /etc/letsencrypt/webrootauth;
    default_type “text/plain”;
}
```

We need to update the contents of our sites `nginx.conf` file to the following:

```nginx
server {
	listen 80;

	server_name $YOUR_DOMAIN;

	include /etc/nginx/conf.d/lets-encrypt-location;

	return 301 https://$YOUR_DOMAIN$request_uri;
}

server {
	listen 443 ssl http2;

	server_name $YOUR_DOMAIN;

	ssl_certificate /etc/letsencrypt/live/$YOUR_DOMAIN/fullchain.pem;
	ssl_certificate_key /etc/letsencrypt/live/$YOUR_DOMAIN/privkey.pem;

	include /etc/nginx/conf.d/ssl-security;

	access_log /var/log/nginx/$YOUR_DOMAIN.access.log;
	error_log /var/log/nginx/$YOUR_DOMAIN.error.log;

	root /var/www/public;
	index index.php;

	include /etc/nginx/conf.d/lets-encrypt-location;
	include /etc/nginx/conf.d/gzip-compression;
	include /etc/nginx/conf.d/browser-caching;

	location = /favicon.ico {

		access_log off;
		return 204;
	}

	location / {

		try_files $uri $uri/ /index.php?_url=$uri&$args;
	}

	location = /index.php {
		include fastcgi_params;
		fastcgi_param ENVIRONMENT "prod";
		fastcgi_pass php-fpm:9000;
		fastcgi_index index.php;
		fastcgi_split_path_info ^(.+\.php)(/.+)$;
		fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
	}
}
```

### 6. Restart your Nginx Config after setting for SSL

Lucky we have a sweet make command:

```bash
cd docker/prod
make reload-nginx
```

This is a zero downtime solution for reloading Nginx with Docker.

```makefile
reload-nginx:
	docker-compose kill -s HUP nginx
```
