+++
title = "Install Golang"
slug = "install-golang"
date = 2019-08-07
draft = true
description = "Install golang."
tags = [
    "golang",
]
categories = [
    "backend",
]
image = "https://assets.jasonraimondi.com/posts/_covers/under-construction.jpg"
imageCredit = "@hojipago https://unsplash.com/photos/D46mXLsQRJw"
imageAlt = "under construction crane"
+++ 

### Install Golang 
 
```bash
brew install go
```

* https://golang.org/doc/install
* https://github.com/quii/learn-go-with-tests
* https://quii.gitbook.io/learn-go-with-tests/go-fundamentals/install-go

One of the quirky things about go is, it expects your code in a specific folder. Most languages, you can put your code anywhere you want.

```bash
# here is what I have added to my .zshrc
export GOPATH=${HOME}/go; 
export GO111MODULE=on; 
export PATH="$GOPATH/bin:$PATH"
```

An EXCELLENT starters guide to getting your feet wet with Golang is _Learn Go with Tests_ [Gitbook available](https://quii.gitbook.io/learn-go-with-tests/go-fundamentals/install-go)

The source code for everything we are working on can be found here: https://github.com/jasonraimondi/nextjs-jwt-example
