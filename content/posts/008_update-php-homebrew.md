+++
title = "Update PHP using homebrew"
slug = "update-php-homebrew"
date = 2018-04-12
description = "Update PHP on your Mac using after the homebrew/php tap has been deprecated."
tags = [
    "macos",
    "homebrew",
    "php",
]
categories = [
    "backend",
    "ops,"
]
comments = true
image = "https://assets.jasonraimondi.com/posts/_covers/christin-hume-08tX2fsuSLg-unsplash.jpg"
imageAlt = "labeled glass bottles on shelf"
imageCredit = "@christinhumephoto https://unsplash.com/photos/08tX2fsuSLg"
+++

[Homebrew/php](https://github.com/Homebrew/homebrew-php) has been deprecated.

As [announced on the 19th of January](https://brew.sh/2018/01/19/homebrew-1.5.0/) this tap was archived on 31st March 2018.

All formulae were migrated to [Homebrew/homebrew-core](https://github.com/Homebrew/homebrew-core) or deleted.

#### Find what existing PHP libraries you are using loaded through homebrew.

```bash
brew list | grep php
brew uninstall php56 php71 php71-intl etc
```

#### Remove leftover references to existing configurations.

If you skip this step, you may see errors down the road where php is referencing incorrect extension paths.

```bash
rm -rf /usr/local/etc/php/{7.0,7.1,5.6}
```

#### Install PHP from the new brew namespace

```bash
brew install php@7.1
```

Follow the instructions when that command is finished to add `$PATH` to your `.bashrc` or `.zshrc`

#### PHP extensions have been removed from brew, by default, most common extensions are already bundled, including intl and crypt.

Un[Fortunately] mongo was left out of the default. If you need it, go ahead and grab it using pecl.

```bash
pecl install mongodb
```

#### If you see this error, error `fatal error: 'openssl/sha.h' file not found on installation` after running `pecl install mongodb`

```bash
cd /usr/local/include
ln -s ../opt/openssl/include/openssl .
```
