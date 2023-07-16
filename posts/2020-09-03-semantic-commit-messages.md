---
categories:
  - ops
comments: true
date: "2020-09-03T13:00:00-07:00"
description: Semantic commit messages
images:
  - /covers/afonso-morais-JXgdQzexK9M-unsplash.jpg
imageCredit: "@morais_afonso https://unsplash.com/photos/JXgdQzexK9M"
slug: semantic-commit-messages
tags:
  - git
title: Semantic Commit Messages
---

```html
feat: add hat wobble ^--^ ^------------^ | | | +-> Summary keyword: add, drop, fix, start, stop,
bump, test, make refactor, reformat, optimize, document, license, revert | +-------> Type: build,
chore, ci, docs, feat, fix, perf, refactor, revert, style, or test
```

---

| type     |                                                                                           |
| -------- | ----------------------------------------------------------------------------------------- |
| feat     | new feature for the user, not a new feature for build script                              |
| fix      | a bug fix                                                                                 |
| docs     | changes to the documentation only                                                         |
| style    | formatting, white-space, etc; no production code change                                   |
| refactor | code change that does not fix a bug or add a feature, eg. renaming a variable             |
| perf     | code change that improves performance                                                     |
| test     | adding missing tests, refactoring tests; no production code change                        |
| build    | change that affects the build system or external dependencies (example scopes: gulp, npm) |
| ci       | change to the CI configuration files and scripts                                          |
| chore    | change that does not modify src or test files                                             |
| revert   | reverts a previous commit                                                                 |

---

| summary keyword |                                                                |
| --------------- | -------------------------------------------------------------- |
| add             | create a capability e.g. feature, test, dependency.            |
| drop            | remove a capability e.g. feature, test, dependency.            |
| fix             | fix an issue e.g. bug, typo, accident, misstatement.           |
| start           | begin doing something; e.g. create a feature flag.             |
| stop            | end doing something; e.g. remove a feature flag.               |
| bump            | increase the version of something e.g. dependency.             |
| test            | add or refector anything regard test, e.g add a new testcases. |
| make            | change the build process, or tooling, or infra.                |
| refactor        | a code change that must be just a refactoring.                 |
| reformat        | refactor of formatting, e.g. omit whitespace.                  |
| optimize        | refactor of performance, e.g. speed up code.                   |
| document        | refactor of documentation, e.g. help files.                    |
| license         | edits regarding licensing; no production code change.          |
| revert          | change back to the previous commit                             |

## Sources:

- https://gist.github.com/joshbuchea/6f47e86d2510bce28f8e7f42ae84c716
