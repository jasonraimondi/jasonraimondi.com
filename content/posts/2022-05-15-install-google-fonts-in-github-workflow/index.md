---
title: "Install Google Fonts in Github Workflow"
slug: "install-google-fonts-in-github-workflow"
date: 2022-05-15T20:36:13-07:00
description: "An example workflow showing how to install Google Fonts into a Github Workflow"
# images: 
# - /covers/under-construction.jpg
categories: 
- ops
tags:
- google-fonts
- github-actions
---

Sharing this for my future self, and anyone else who has spent more than 10 minutes trying to install Google Font's into a Github Workflow.

```markdown
name: install google fonts

on: push

jobs:
  build:
    name: install google fonts
    runs-on: ubuntu-latest
    steps:
      - name: Install Google Fonts
        run: |
          wget -O Fira_Sans.zip https://fonts.google.com/download?family=Fira%20Sans
          unzip -d fira_sans/ Fira_Sans.zip
          mv fira_sans /usr/share/fonts/
          fc-cache -fv
```
