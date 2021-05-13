---
title: Use the npm version command to semantically version your node project
description: How to use `npm version` using examples
slug: use-the-npm-version-command-to-semantically-version-your-node-project
date: 2021-05-12T09:25:00-0700
categories:
- software
- backend
- frontend
tags:
- nodejs
- semantic-version
draft: true
---

## Create a prerelease version

If you are on version `1.0.0` and you want to go to `1.1.0-beta.0` you would use the **preminor** command. In addition to **preminor**, there are also **premajor** and **prepatch**. You can use `--preid=beta` (or identifier you want such as `alpha`, `beta`, or `rc`) to label your prerelease.

```bash
# this will take you to 2.0.0-rc.0
npm version premajor --preid=rc

# this will take you to 1.1.0-beta.0
npm version preminor --preid=beta

# this will take you to 1.0.1-alpha.0
npm version prepatch --preid=alpha
```

## Bump the prerelease version

Say you decided to update to a **preminor** release, so your app is now at `v1.1.0-beta.0`, you can release subsequent prerelease versions by using the **prerelease** command.

```bash
# this will take you to 1.1.0-beta.1
npm version prerelease

# and again will take you to 1.1.0-beta.2
npm version prerelease

# and again will take you to 1.1.0-beta.3 and so on
npm version prerelease
```

## Promote the prerelease to a release

Once you are ready to make the minor version official, depending on what you started with, you will need to update the command to match. In our case here we used `npm version preminor`, so the command to switch to the release would be `npm version minor`.

```bash
# from 2.0.0-rc.1 to 2.0.0
npm version major

# from 1.1.0-beta.0 to 1.1.0
npm version minor

# from 1.0.1-alpha.0 to 1.0.1
npm version patch
```

