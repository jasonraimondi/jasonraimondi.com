---
categories:
- misc
- ops
date: "2020-05-09T00:00:00-07:00"
description: Keep an always up to date archive of the GitHub repositories that matter to you using Gitea mirror repositories.
draft: true
image: https://assets.jasonraimondi.com/posts/_covers/under-construction.jpg
imageAlt: under construction crane
imageCredit: '@hojipago https://unsplash.com/photos/D46mXLsQRJw'
slug: always-up-to-date-archive-of-github-repositories
tags:
- deno
- github
- gitea
- data hoarding
- typescript
title: Archive GitHub repositories using Gitea Mirror Repos
---

One of the many great features of Gitea is the mirror repository. 
Mirror repositories are a feature of Gitea that allows you to local copies of external repositories. 

## What is a mirror repository?

Using the **New Migration** option will allow you to initialize a repository in Gitea from an existing repository url. 

We can keep a backup of the [Gitea codebase](https://github.com/go-gitea/gitea), synced every 8 hours to our local gitea instance. 

Check the box **This repository will be a mirror** to have Gitea keep the repository up to date.

The mirror repo allows us to mirror repositories from existing sources, such your favorite open-source GitHub projects. 

Mirror repositories update on cronjobs managed by Gitea. 

// image of  

## How?

[Deno-mirror-to-gitea](https://github.com/jasonraimondi/deno-mirror-to-gitea) is a tool I wrote that will spider through GitHub users and add their relevant repositories as mirror repositories to an existing [Gitea](https://gitea.io) server. Gitea is a self-hosted git platform that has many great features, one of my favorites is the syncing mirror repositories.

### Create a Gitea access token

Now you need to go in and create an access token for [deno-mirror-to-gitea](https://github.com/jasonraimondi/deno-mirror-to-gitea) to work.

So now we have the token `1548f65934f5034d9803bdfd46a6a25e85e30de2`

### Create a GitHub access token

The GitHub GraphQL v4 API requires an access token. The only permission we are going to give the token is `public_repo` allowing **deno-mirror-to-gitea** to view only public repositories. The API is used to fetch a list of a users public repositories, repositories they've starred, repositories they've contributed to, and a list of users who they are following. 

Follow this link to create a github access token: <a href="https://github.com/settings/tokens/new?description=deno-mirror-to-gitea&scopes=public_repo" target="_blank" rel="noopener noreferrer">https://github.com/settings/tokens/new?description=deno-mirror-to-gitea&scopes=public_repo</a>

