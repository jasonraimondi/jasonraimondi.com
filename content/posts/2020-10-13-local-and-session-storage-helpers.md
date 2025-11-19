---
categories:
- frontend
comments: true
date: "2020-10-13T10:46:00-07:00"
description: Local storage and session storage helpers for the window. Prefixes keys while handling json encoding/decoding as well as null values.
images: 
- /covers/afonso-morais-JXgdQzexK9M-unsplash.jpg
imageCredit: '@morais_afonso https://unsplash.com/photos/JXgdQzexK9M'
slug: local-and-session-storage-helpers
tags:
- javascript
- typescript
- frontend
title: LocalStorage and SessionStorage helpers
---

## What do they do?

* Adds a prefix to storage keys
* Handle JSON encoding/decoding for simple JSON object storage
* Handle Null values

## Local Storage Service

Data in [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) does not expire.

{{< gist jasonraimondi 0ad3edc41c77cd02568adbee16c34500 "LocalStorageService.ts" >}}

## Session Storage Service

Data in [sessionStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/sessionStorage) is cleared when the page session ends.

{{< gist jasonraimondi 0ad3edc41c77cd02568adbee16c34500 "SessionStorageService.ts" >}}
