---
layout: post
title: "Brew Install Everything"
date: 2018-01-16T10:23:00 -08:00
excerpt: "So you just got yourself a fresh Mac, now what? Getting your Mac configured to your workflow is essential to productivity.  You spend the better part of every day using it, it is worth spending the time to get it set up right the first time."
tags: apple macos brew homebrew
---

*Note: This is a modified and updated version of my original post [here](http://blog.eventfarm.com/developers/fresh-mac-now-what-brew-install-everything) on the Event Farm Engineering blog on Mar 14, 2016.*

#### Install Brew

Visit [Homebrew](http://brew.sh/) for the download link.. Before you are able to install Homebrew, you first need to have [Xcode installed](https://itunes.apple.com/us/app/xcode/id497799835?mt=12) and up to date. Open up your Terminal and agree to the Xcode and Apple SDKs Agreement by type `sudo xcodebuild -license` and then type 'agree' to agree.

Now you need to enter in the Homebrew install script and let it run. You're good to go!


```bash
/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"
```

There are only 5 commands you need to remember to be fluent.

```bash
# Updates the package list from the repository
brew update

# This will fetch the new version of
brew upgrade

# Search for a package
brew search <package name>

# Install a package
brew install <package name>

# Gets you a list of installed packages
brew list
````

Applications that duplicate software provided by OS X need to tap the *duplicate repository* to install them. If you would have installed one of these from Homebrew, you would get a notification requiring you to go through the "homebrew/dupes" repository. For example, installing rsync without first tapping the dupes repository results in:

```bash
brew install rsync
Error: No available formula with the name "rsync"

==> Searching taps...
This formula was found in a tap:
     homebrew/dupes/rsync

To install it, run:
brew install homebrew/dupes/rsync
````

Fret not, this is a simple task. You can install it directly using the full path as stated above, or you can tap the repository first so you won't have to reference it during the installation.

```bash
# Tap the new homebrew/dupes repository.
brew tap homebrew/dupes

brew install rsync
````

### Updating

Two fundamental commands you'll be using often are `brew update` and `brew upgrade`. It is important to understand the difference between *updating* and *upgrading*. The concept of updating versus upgrading is consistent with the APT package manager on Debian and Ubuntu.

## Homebrew Cask

What originally started out as a "tap" or addable extra repository has become part of Homebrew's core installation. No more tapping required!

Homebrew Cask is centered around installing GUI applications through the CLI. With Homebrew Cask, you can install the latest versions of applications by typing in a single command.

Want to install Google Chrome? There is a cask for that. Want to install 1Password? There is a cask for that too.: `brew cask install google-chrome` and `brew cask install 1password`.

In fact, there is a Cask for pretty much all applications, from Google Chrome to Slack to PHPStorm. There is a Cask for that!

```bash
brew cask search <package name>
brew cask install <package name>
brew cask list
````

Homebrew Cask allows you to install software that would typically require visiting the web, download a .dmg, and then installing manually. Homebrew Cask makes it super simple to grab the latest version of software, like Google Chrome from Homebrew Cask.
