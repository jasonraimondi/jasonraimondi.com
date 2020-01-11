+++
title = "Setting Up Wallabag in Docker with Existing MYSQL DB"
slug = "setting-up-wallabag-in-docker-with-existing-mysql"
date = 2019-03-19
draft = true
description = "Setting Up Wallabag in Docker with Existing MYSQL DB"
tags = [
    "selfhosted",
]
categories = [
    "ops",
]
image = "https://d265ybhz09ikd5.cloudfront.net/posts/_covers/under-construction.jpg"
imageCredit = "@hojipago https://unsplash.com/photos/D46mXLsQRJw"
imageAlt = "under construction crane"
+++ 

# Setting Up Wallabag in Docker with Existing MYSQL DB
```
# the spacing in this file is wrong but you get it
version: '3.7'

    networks:
      cloud-net:
        driver: overlay
      traefik_traefik-net:
        external: true

    services:
      wallabag:
        image: wallabag/wallabag
        environment:
          MYSQL_ROOT_PASSWORD: mypassword
          SYMFONY__ENV__DATABASE_DRIVER: pdo_mysql
          SYMFONY__ENV__DATABASE_HOST: 10.138.43.236
          SYMFONY__ENV__DATABASE_PORT: 3306
          SYMFONY__ENV__DATABASE_NAME: wallabag
          SYMFONY__ENV__DATABASE_USER: wallabag
          SYMFONY__ENV__DATABASE_PASSWORD:  mypassword
          SYMFONY__ENV__DATABASE_CHARSET: utf8mb4
          SYMFONY__ENV__MAILER_HOST: 127.0.0.1
          SYMFONY__ENV__MAILER_USER: ~
          SYMFONY__ENV__MAILER_PASSWORD: ~
          SYMFONY__ENV__FROM_EMAIL: jason.nas.notifications@gmail.com
          SYMFONY__ENV__DOMAIN_NAME: https://save.jasonraimondi.com
        volumes:
          - /mnt/data/wallabag/images:/var/www/wallabag/web/assets/images 
        networks:
          - cloud-net
          - traefik_traefik-net
        deploy:
          restart_policy:
            condition: on-failure
          labels:
            - "traefik.enable=true"
            - "traefik.docker.network=traefik_traefik-net"
            - "traefik.port=80"
            - "traefik.frontend.rule=Host:save.jasonraimondi.com"

      redis:
        image: redis:alpine
        networks:
          - cloud-net
```


So the hardest part of this was:

1) waiting patiently for the thing to start or timeout

```
wallabag_wallabag.1.7fvkp@jason    | Starting provisioner...
wallabag_wallabag.1.7fvkp@jason    |  [WARNING]: Found both group and host with same name: localhost
wallabag_wallabag.1.7fvkp@jason    | Provisioner finished.
```

2) Entering the container manually and doing a composer install and seed of the database with 

```
composer install
bin/console wallabag:install
bin/console server:run
```

on the first run.