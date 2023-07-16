---
title: Fix the error `Binary not found for version` when installing Node.js using asdf on an M1 Mac
description: If you are running into the error `Binary not found for version X.X.X` when trying to install Node.js version 14 (or earlier) on your M1 Mac, give this a try.
slug: fix-binary-not-found-error-asdf-nodejs-v14-with-m1-mac
date: 2021-10-27T10:50:00-0700
categories:
  - macos
  - software
tags:
  - asdf
  - nodejs
---

## Whats the problem?

If you are using [asdf](https://github.com/asdf-vm/asdf) and keep running into the error `Binary not found for version 14.18.0` when trying to install Node.js version 14.18.0.

```bash
$ asdf install nodejs 14.18.0
Binary not found for version 14.18.0
```

## Why does it happen?

The reason is that there are no prebuilt binaries for Apple Silicon (darwin-arm64) bundles provided by the Node team for these older versions of node. This isn't a problem, since an M1 Mac can use programs compiled for Intel x86.

## How to fix it?

First [find the version](https://nodejs.org/en/download/releases/) of Node you are looking to install. For me, it was [v14.18.0](https://nodejs.org/dist/v14.18.0/)

You just need to visit the node directory

```bash
# Enter what version you want
VERSION=14.18.0
# Download and extract
wget -c https://nodejs.org/dist/v$VERSION/node-v$VERSION-darwin-x64.tar.gz -O - | tar -xz
#
mv node-v$VERSION-darwin-x64 $ASDF_DIR/installs/nodejs/$VERSION
```

## Reshim and reload

This [recreates the shims](http://asdf-vm.com/manage/core.html#reshim) for the current version of a package. This might technically not be necessary, but it's harmless to work.

```bash
asdf reshim nodejs
asdf shell nodejs 14.18.0
```

## Test the version

Hope it works :four_leaf_clover:

```bash
$ node -v
v14.18.0
```
