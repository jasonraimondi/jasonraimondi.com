+++
title = "Using the exec command in node.js"
slug = "exec-command-in-nodejs"
date = 2019-03-14
description = "Using the exec command in Node.js is pretty simple, first import the exec function, and then call it."
tags = [ 
    "javascript", 
    "node.js", 
]
categories = [
    "backend"
]
comments = true
image = "https://d265ybhz09ikd5.cloudfront.net/posts/_covers/sam-loyd-qy27JnsH9sU-unsplash.jpg"
+++

Using the exec command in Node.js is pretty simple, first import the exec function, and then call it with the the first argument being the command you are running, and the second argument a callback with params for **error**, **stdout**, **stderr**.

```javascript
const exec = require('child_process').exec;

const command = `rsync -Pavu "/origin/${special}" "/destination/${show}/"`;

exec(command, function(err, stdout, stderr) {
    if (err) {
        console.log(err);
        return;
    }
    console.log(stdout);
});
```