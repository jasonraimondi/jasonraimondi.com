---
categories:
- frontend
- backend
- ops
date: "2019-03-19T00:00:00-07:00"
description: Signing Git commits with GPG Key.
draft: true
image: /posts/_covers/under-construction.jpg
imageAlt: under construction crane
imageCredit: '@hojipago https://unsplash.com/photos/D46mXLsQRJw'
slug: code-syntax-highlighting-with-pygment
tags:
- hugo
- javascript
title: Signing Git commits with GPG Key
---

#### Always Sign Git Commits

```bash
git config --global commit.gpgsign true
```

#### Multiple Keys

Find your signing key

```bash
$ gpg --list-secret-keys --keyid-format LONG
/Users/jason/.gnupg/pubring.kbx
-------------------------------
sec   rsa4096/1755B5C35R6G56E5 2015-02-12 [SC] [expires: 2020-02-11]
      399C78FEE2273EA3CF9B4668UDHEN4CFJEIS56E5
uid                 [ultimate] Jason Raimondi <jason@raimondi.us>
ssb   rsa4096/DF6B171SDJE87BD1 2015-02-12 [E] [expires: 2020-02-11]
```

To set your GPG signing key in Git, paste the text below, substituting in the GPG key ID you'd like to use. In this example, the GPG key ID is 1755B5C35R6G56E5:

```bash
git config --global user.signingkey 3AA5C34371567BD2
```

#### GPG keys Hijacking Mac Keybindings

Remove the `command + shift + d` hijacking on Mac using via System Preferences… Keyboard… Shortcuts and finding the PGP_Toolbox
