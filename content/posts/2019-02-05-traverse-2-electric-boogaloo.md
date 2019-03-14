+++
title = "Traverse 2: Electric Boogaloo"
slug = "traverse-2-electric-boogaloo"
date = 2019-03-14
description = "Traverse was rewritten open sourced!"
tags = [
    "electron",
    "javascript",
    "typescript",
]
draft = true
+++

<img height="100" src="https://res.cloudinary.com/jmondi/image/upload/c_scale,w_150/v1534475620/jasonraimondi.com/traverse/pointing.png" alt="Traverse" /> 

[![Test Coverage](https://travis-ci.org/jasonraimondi/traverse.svg?branch=master)](https://travis-ci.org/jasonraimondi/traverse#)
[![Test Coverage](https://api.codeclimate.com/v1/badges/ad2b588b8f655bc8f384/test_coverage)](https://codeclimate.com/github/jasonraimondi/traverse/test_coverage)
[![Maintainability](https://api.codeclimate.com/v1/badges/ad2b588b8f655bc8f384/maintainability)](https://codeclimate.com/github/jasonraimondi/traverse/maintainability)

[Traverse](https://traverse.site) is a GitHub explorer. You can browse repositories trending by frequency and language.

If you find Traverse interesting, please consider giving it a Star.

## Why?

I love browsing [trending repositories on GitHub](https://github.com/trending). Historically, that page was kinda hidden and took some digging to get to. I wanted to build an app that would make findind new repositories easier.

I was building this app, and ended up finding this awesome extension called [GitHunt](http://github.com/kamranahmedse/githunt) using Traverse. GitHunt is great, but it can be distracting when it opens and I am in the middle of something. I've gotten sidetracked before while working when I opened a new tab and finding a cool project and went down that whole rabbit hole.

Need to focus? Not a problem. Traverse is a dedicated application you can open and close at your hearts content.

## Installing

Traverse is available in Homebrew Cask. If you find Traverse interesting, please consider giving it a Star. I need a minimum of 50 stars to keep this project on Homebrew Cask.

```bash
brew cask install traverse
```

Note: Homebrew Cask might not have the most up to date version of Traverse, don't worry, when you launch Traverse, it will download the newest version in the background. Quitting and reopening Traverse will open the updated version.

## Stack

Traverse is an Electron app built with React, in TypeScript. It uses Jest/Chai + Enzyme for the test framework. Webpack to bundle, Redux and Redux Saga for the store, and uses the GitHub REST API with the Axios rest client. 

### License

Traverse is [MIT licensed](https://github.com/jasonraimondi/traverse/blob/master/LICENSE).

### Screen Shots

<image-pop
    v-bind:portrait="true"
    src="https://raw.githubusercontent.com/jasonraimondi/traverse/master/screenshots/0.10.2-1.png"
    alt="Version 0.10.2 Screenshot 1"
></image-pop>

<image-pop
    v-bind:portrait="true"
    src="https://raw.githubusercontent.com/jasonraimondi/traverse/master/screenshots/0.10.2-2.png"
    alt="Version 0.10.2 Screenshot 2"
></image-pop>

<image-pop
    v-bind:portrait="true"
    src="https://raw.githubusercontent.com/jasonraimondi/traverse/master/screenshots/0.10.2-3.png"
    alt="Version 0.10.2 Screenshot 3"
></image-pop>
