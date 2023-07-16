---
categories:
  - backend
comments: true
date: "2019-03-14T00:00:00-07:00"
description: Using the exec command in Node.js is pretty simple, first import the
  exec function, and then call it.
images:
  - /covers/wendy-scofield-fnlNwb5sB5Y-unsplash.jpg
slug: exec-command-in-nodejs
tags:
  - javascript
  - node.js
title: Using the exec command in node.js
---

Using the exec command in Node.js is pretty simple, first import the exec function, and then call it with the the first argument being the command you are running, and the second argument a callback with params for **error**, **stdout**, **stderr**.

```javascript
const exec = require("child_process").exec;

const command = `rsync -Pavu "/origin/${special}" "/destination/${show}/"`;

exec(command, function (err, stdout, stderr) {
  if (err) {
    console.log(err);
    return;
  }
  console.log(stdout);
});
```
