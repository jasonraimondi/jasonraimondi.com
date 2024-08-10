---
draft: true
title: "Autogenerating Resume"
slug: "autogenerating-resume"
date: 2024-07-12T11:37:00-08:00
description: "Autogenerating Resume using Resume JSON, Hugo, Playwright, and Github Actions"
categories: 
- software
tags: 
- resume
- github-actions
---

## Steps

Steps:

1. Create a resume.json file following the JSON Resume standard.
1. Develop an HTML template that uses your JSON Resume as a data source.
1. Implement a PDF Generator using Playwright to convert the HTML to PDF.
1. Set up a GitHub workflow to automatically regenerate the PDF when resume.json changes.

## JSON Resume
 
<a href="https://jsonresume.org/" target="_blank">JSON Resume</a> is an open-source initiative for creating a JSON-based resume standard. Start by creating your resume.json file:

```json
{
  "basics": {
    "name": "Jason Raimondi",
    "label": "Senior Software Engineer",
    "picture": "https://jasonraimondi.com/misc/me/avatar-2021.jpg",
    "email": "resume@raimondi.us",
    "website": "https://jasonraimondi.com",
    ...
```


First, the [resume.json](/resume.json).

Then, the [resume](/resume) template.


Add a [PDF Generator.](https://github.com/jasonraimondi/jasonraimondi.com/blob/91281de48b335a04804f4e47b7ca8abb20a7e48e/resume-snapshotter.ts)

## Generate PDF using Playwright

> Starts server, waits for URL, then runs test command; when the tests end, shuts down server

Add a [PDF Generator](https://github.com/jasonraimondi/jasonraimondi.com/blob/91281de48b335a04804f4e47b7ca8abb20a7e48e/resume-snapshotter.ts) that uses Playwright to generate a PDF from the HTML template.

I use the [start-server-and-test](https://github.com/bahmutov/start-server-and-test) action to 

```ts
import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const resumePath = "./static/resume";
  try {
    await page.goto("http://localhost:1313/resume");
  } catch {
    await page.goto("https://jasonraimondi.com/resume");
  }
  await page.pdf({
    path: `${resumePath}.pdf`,
    margin: { top: 25, bottom: 25, left: 50, right: 50 },
  });
  await browser.close();
})();
```

And the [Regenerate Resume Github Action](https://github.com/jasonraimondi/jasonraimondi.com/blob/45c16e3b4f584a010457a0a95ad57829abdf1ab2/.github/workflows/regenerate_resume.yml)


```yaml
# ./github/workflows/regenerate_resume.yaml
name: Regenerate Resume

on:
  push:
    paths:
      - '.github/actions/setup/action.yml'
      - '.github/workflows/regenerate_resume.yml'
      - 'assets/resume.css'
      - 'assets/resume/*.css'
      - 'content/resume.json'
      - 'layouts/_default/resume.html'
      - 'layouts/partials/*.html'
      - 'resume-snapshotter.ts'

jobs:
  regenerate_resume:
    runs-on: ubuntu-latest
    if: "! contains(github.event.head_commit.message, '[skip ci]')"
    steps:
      - uses: actions/checkout@v3
      - uses: pnpm/action-setup@v2
        with:
          version: "9.x"
      - uses: actions/setup-node@v3
        with:
          node-version: 20
          cache: pnpm
          cache-dependency-path: pnpm-lock.yaml
          registry-url: "https://registry.npmjs.org"
      - run: pnpm install --frozen-lockfile
      - run: npx playwright install --with-deps chromium
      - run: pnpm gen:resume:ci
      - uses: stefanzweifel/git-auto-commit-action@v5
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
        with:
          file_pattern: 'static/resume.*'
          commit_message: | 
            gen: generate update resume [skip ci]
          branch: main
          commit_user_name: resume-generator 🤖
          commit_user_email: actions@github.com
          commit_author: resume-generator 🤖 <actions@github.com>
```

<div style="display: flex; justify-content: center;">
    <iframe src="https://jasonraimondi.com/resume.pdf" width="75%" height="650"></iframe>
</div>
