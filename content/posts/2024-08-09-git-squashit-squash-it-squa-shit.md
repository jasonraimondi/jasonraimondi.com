---
title: git squashit squash-it squa-shit
description: A bash helper function for squashing the last number of commits
slug: git-squashit-squash-it-squa-shit
date: 2024-08-09T10:30:00-05:00
categories:
- ops
tags:
- git
---

# Git Squashit

A bash/zsh helper function to squash multiple Git commits.

## Definition

```bash
function squashit () {
  git reset --soft HEAD~$1 &&
  git commit --edit -m"$(git log --format=%B --reverse HEAD..HEAD@{1})"
}
```

## Usage

```bash
squashit <number_of_commits>
```

- `<number_of_commits>`: Number of recent commits to squash
- Opens default text editor for commit message modification

## Note

- Modifies Git history. Use cautiously.
- Best for combining small, 'wip' commits into a meaningful one.
- Consider creating a backup branch.
