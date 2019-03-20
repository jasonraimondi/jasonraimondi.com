+++
title = "Randomize image in static Jekyll or Hugo site with vanilla JavaScript"
slug = "randomize-image-in-static-jekyll-or-hugo-site-with-vanilla-js"
date = 2019-03-19
draft = true
description = "Randomize vanilla js"
tags = [
    "javascript",
]
categories = [
    "frontend",
]
+++

Randomize image in static Jekyll or Hugo site with vanilla JavaScript

If you check out my [about](/about) page.

```html
<img id="js-image-of-me" alt="image of me" />

<script>
    const myArray = [
      "/assets/misc/about/us.png",
      "/assets/misc/about/codecraft-2018.jpg",
      "/assets/misc/about/colorado-2018.jpg",
    ];
    const randomPictureLink = myArray[Math.floor(Math.random()*myArray.length)];
    const picture = document.getElementById("js-image-of-me");
    picture.src = randomPictureLink;
</script>
```

<img id="js-image-of-me" alt="image of me" />

<script>
    const myArray = [
      "/assets/misc/about/us.png",
      "/assets/misc/about/codecraft-2018.jpg",
      "/assets/misc/about/colorado-2018.jpg",
    ];
    const randomPictureLink = myArray[Math.floor(Math.random()*myArray.length)];
    const picture = document.getElementById("js-image-of-me");
    picture.src = randomPictureLink;
</script>