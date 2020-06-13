---
categories:
- ops
date: "2020-05-09T00:00:00-07:00"
description: Configure gitea
draft: true
image: /posts/_covers/under-construction.jpg
imageAlt: under construction crane
imageCredit: '@hojipago https://unsplash.com/photos/D46mXLsQRJw'
slug: configure-gitea
tags:
- gitea
title: Configure Gitea
---
 

`/gitea/conf/app.ini`

Check out the [sample app.ini](https://github.com/go-gitea/gitea/blob/master/custom/conf/app.ini.sample) file for a full list of options.

```text
APP_NAME = Jason's Git Mirror
RUN_MODE = prod
RUN_USER = git

[repository]
ROOT = /data/git/repositories

[repository.local]
LOCAL_COPY_PATH = /data/gitea/tmp/local-repo

[repository.upload]
TEMP_PATH = /data/gitea/uploads

[server]
APP_DATA_PATH    = /data/gitea
DOMAIN           = localhost
SSH_DOMAIN       = localhost
HTTP_PORT        = 3000
ROOT_URL         = http://localhost:3000/
DISABLE_SSH      = false
SSH_PORT         = 22
SSH_LISTEN_PORT  = 22
LFS_START_SERVER = true
LFS_CONTENT_PATH = /data/git/lfs
LFS_JWT_SECRET   = THIS_IS_GENERATED
OFFLINE_MODE     = false

[database]
PATH     = /data/gitea/gitea.db
DB_TYPE  = sqlite3
HOST     = localhost:3306
NAME     = gitea
USER     = root
PASSWD   = 
SCHEMA   = 
SSL_MODE = disable
CHARSET  = utf8

[indexer]
ISSUE_INDEXER_PATH = /data/gitea/indexers/issues.bleve

[session]
PROVIDER_CONFIG = /data/gitea/sessions
PROVIDER        = file

[picture]
AVATAR_UPLOAD_PATH            = /data/gitea/avatars
REPOSITORY_AVATAR_UPLOAD_PATH = /data/gitea/repo-avatars
DISABLE_GRAVATAR              = true
ENABLE_FEDERATED_AVATAR       = false

[attachment]
PATH = /data/gitea/attachments

[log]
ROOT_PATH = /data/gitea/log
MODE      = file
LEVEL     = info

[security]
INSTALL_LOCK   = true
SECRET_KEY     = THIS_IS_GENERATED
INTERNAL_TOKEN = THIS_IS_GENERATED

[service]
DISABLE_REGISTRATION              = false
REQUIRE_SIGNIN_VIEW               = false
REGISTER_EMAIL_CONFIRM            = false
ENABLE_NOTIFY_MAIL                = false
ALLOW_ONLY_EXTERNAL_REGISTRATION  = false
ENABLE_CAPTCHA                    = false
DEFAULT_KEEP_EMAIL_PRIVATE        = false
DEFAULT_ALLOW_CREATE_ORGANIZATION = true
DEFAULT_ENABLE_TIMETRACKING       = true
NO_REPLY_ADDRESS                  = noreply.localhost

[oauth2]
JWT_SECRET = THIS_IS_GENERATED

[mailer]
ENABLED = false

[openid]
ENABLE_OPENID_SIGNIN = false
ENABLE_OPENID_SIGNUP = false
```
