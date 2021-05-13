---
title: Using npm version to semantic version
description: Showing example of 72 bytes
date: 2021-05-12T09:25:00-0700
categories:
- software
- backend
- frontend
tags:
- nodejs
- versioning
draft: true
---

## Creating a prerelease version

If you are on version `1.0.0` and you want to go to `1.1.0-beta.0` you would use the **preminor** command. In addition to **preminor**, there are also **premajor** and **prepatch**. You can use `--preid=beta` (or identifier you want such as `alpha`, `beta`, or `rc`) to label your prerelease.

```bash
# this will take you to 2.0.0-beta.0
npm version premajor --preid=beta

# this will take you to 1.1.0-alpha.0
npm version preminor --preid=alpha

# this will take you to 1.0.1-rc.0
npm version preminor --preid=rc
```

Say you decided to update to a **preminor** release, so your app is now at `v1.1.0-beta.0`, you can release subsequent prerelease versions by using the **prerelease** command.

```bash
# this will take you to 1.1.0-beta.1
npm version prerelease

# and again will take you to 1.1.0-beta.2
npm version prerelease

# and again will take you to 1.1.0-beta.3 and so on
npm version prerelease
```

Once you are ready to make the minor version official, you can then use **minor**.

```bash
# this will take you to 1.1.0
npm version minor
```

Of course, depending on what you started with, you will need to update the command to match. In our case here we used `npm version preminor`, so the command to switch to the release would be `npm version minor`.
