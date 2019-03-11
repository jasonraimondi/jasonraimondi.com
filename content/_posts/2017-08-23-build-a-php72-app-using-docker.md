---
layout: post
title: "Building a PHP7.2 + Nginx application using Docker"
date: 2017-08-23T18:30:00 -08:00
excerpt: "The goal of this is to have a working development and production build for a PHP7.2 Application using Nginx as our web server."
tags: php nginx docker
---

A sample project is available on Github at [https://github.com/jasonraimondi/post-docker-php-nginx](https://github.com/jasonraimondi/post-docker-php-nginx)

Our end application structure is going to look consistent with following directory tree.

```markdown
project/
├── docker/
│   ├── dev/
│   │   ├── nginx/
│   │   └── docker-compose.yml
│   ├── prod/
│   │   ├── nginx/
│   │   ├── php-fpm/
│   │   └── docker-compose.yml
├── app/
│   ├── src
│   ├── tests
│   └── composer.json
└── public/
    └── index.php
```

Inside of our main app directory we are going to see three main folders, the docker directory, our public webroot, and our main app folder which is going to host our PHP application.

## The `public` directory
The public directory is going to be where we are serving out our web root. Here we can keep built assets and anything else that you would like to be publicly available to the web. This directory could easily be moved anywhere.

## The `app` directory
The src directory is going to be where our main PHP application lives. This is going to be where we define our `composer.json` file with our namespaces and dependencies are defined.

The reason we are containing our main app contents into a separate directory instead of keeping our `composer.json` located at `/` is just to simplify mounting our app volumes into our docker containers.

## The `docker` directory

The docker directory is going to house the containers for our builds different environments. We are currently going to have three directories, the first two being our dev and prod environment builds. The development build is basic and serves out of localhost out of port 8050 (`localhost:8050`) and a production container build is ready for SSL to generate certs from Lets Encrypt. The last is a tools directory for cross environment containers such as a node container for building assets and a composer container for installing vendor files.

### Building for Development
The development container is fairly bareboned and is using the same underlying machines as our Production builds. The machines here that I am using are my own compiled containers, but feel free to swap them out for any PHP or Nginx containers you see fit. Just note that may require a bit further tweaking than this article goes into.

### Building for Production
For the production build, we are using Let’s Encrypt Certbot tool to generate our SSL certificates and serve our site over https.

Testing our SSL settings using the [Qualy SSL Server Test](https://www.ssllabs.com/ssltest/) I was able to achieve an ‘A+’ security rating. PHP and Nginx are optimized and secured for a public facing site.

#### Setting Up Nginx for Production

The contents of `/etc/nginx/ssl_security.conf` are the following:

```nginx
ssl_dhparam /etc/nginx/ssl/dhparam.pem;
ssl_protocols TLSv1.2 TLSv1.1 TLSv1;
ssl_ciphers ‘ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-AES256-GCM-SHA384:DHE-RSA-AES128-GCM-SHA256:DHE-DSS-AES128-GCM-SHA256:kEDH+AESGCM:ECDHE-RSA-AES128-SHA256:ECDHE-ECDSA-AES128-SHA256:ECDHE-RSA-AES128-SHA:ECDHE-ECDSA-AES128-SHA:ECDHE-RSA-AES256-SHA384:ECDHE-ECDSA-AES256-SHA384:ECDHE-RSA-AES256-SHA:ECDHE-ECDSA-AES256-SHA:DHE-RSA-AES128-SHA256:DHE-RSA-AES128-SHA:DHE-DSS-AES128-SHA256:DHE-RSA-AES256-SHA256:DHE-DSS-AES256-SHA:DHE-RSA-AES256-SHA:AES128-GCM-SHA256:AES256-GCM-SHA384:AES128-SHA256:AES256-SHA256:AES128-SHA:AES256-SHA:AES:CAMELLIA:DES-CBC3-SHA:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!aECDH:!EDH-DSS-DES-CBC3-SHA:!EDH-RSA-DES-CBC3-SHA:!KRB5-DES-CBC3-SHA’;

ssl_prefer_server_ciphers on;

add_header Strict-Transport-Security “max-age=31536000”;
```

##### Enable Nginx to Leverage Browser Caching

Setting an expiry date or a maximum age in the HTTP headers for static resources instructs the browser to load previously downloaded resources from local disk rather than over the network.

```nginx
# /etc/nginx/conf.d/browser-caching
location ~* \.(?:ico|css|js|gif|jpe?g|png)$ {
    expires 30d;
    add_header Pragma public;
    add_header Cache-Control “public”;
}
```

##### Include Let’s Encrypt Default Location

Include a Let’s Encrypt default location out of the webroot. This is to allow

```nginx
# /etc/nginx/conf.d/lets_encrypt_location
location /.well-known/acme-challenge {
    root /etc/letsencrypt/webrootauth;
    default_type “text/plain”;
}
``

##### Enable Gzip for Asset Compression.

Enabling `gzip` compression can reduce the size of the transferred response by up to 90%.

```nginx
# /etc/nginx/conf.d/gzip-compression
gzip on;
gzip_disable “msie6”;

gzip_vary on;
gzip_proxied any;
gzip_comp_level 6;
gzip_buffers 16 8k;
gzip_http_version 1.1;
gzip_min_length 256;
gzip_types text/plain text/css application/json application/javascript application/x-javascript text/xml application/xml application/xml+rss text/javascript application/vnd.ms-fontobject application/x-font-ttf font/opentype image/svg+xml image/x-icon;
``

##### Nginx Site Configuration

Our sites nginx configuration is going to need a few tweaks to it on the first launch, you can check out my guide: [Configure Nginx with SSL using Let's Encrypt](https://www.jasonraimondi.com/posts/configure-ssl-using-let-s-encrypt-nginx-docker-and-the-official-docker-hub-cerbot-image)

Our final site configuration file is available here:

```nginx
server {
    listen 80;
    server_name YOUR_DOMAIN_HERE;

    include /etc/nginx/conf.d/lets_encrypt_location;

    return 301 https://YOUR_DOMAIN_HERE$request_uri;
 }

 server {
    listen 443 ssl http2;

    server_name YOUR_DOMAIN_HERE;

    ssl_certificate /etc/letsencrypt/live/YOUR_DOMAIN_HERE/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/YOUR_DOMAIN_HERE/privkey.pem;

    include /etc/nginx/ssl/ssl_security.conf;

    access_log /var/log/nginx/YOUR_DOMAIN_HERE.access.log;
    error_log  /var/log/nginx/YOUR_DOMAIN_HERE.error.log;

    root /var/www/public;
    index index.php;

    include /etc/nginx/conf.d/lets_encrypt_location;
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
        fastcgi_param ENVIRONMENT “dev”;
        fastcgi_pass php-fpm:9000;
        fastcgi_index index.php;
        fastcgi_split_path_info ^(.+\.php)(/.+)$;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
``

### Tools Containers
In future posts we are going to be expanding our containers to add in a Tools container for building front end assets, as well as DB support using the official Percona/MySQL Docker Container.

The tools containers are going to hold our images for building our front end assets using node as well as a Composer image for grabbing composer assets.
