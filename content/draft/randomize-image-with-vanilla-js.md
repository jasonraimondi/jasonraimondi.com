---
categories:
- frontend
date: "2019-03-19T00:00:00-07:00"
description: Randomize vanilla js
draft: true
image: https://assets.jasonraimondi.com/posts/_covers/under-construction.jpg
imageAlt: under construction crane
imageCredit: '@hojipago https://unsplash.com/photos/D46mXLsQRJw'
slug: randomize-image-in-static-jekyll-or-hugo-site-with-vanilla-js
tags:
- javascript
title: Randomize image in static Jekyll or Hugo site with vanilla JavaScript
---

If you check out my [about](/about) page. Refresh the page to (hopefully) get a new one.

```html
<img id="js-random-image" alt="grey placeholder with number" />

<script>
    const images = [
      "https://via.placeholder.com/250&text=1",
      "https://via.placeholder.com/250&text=2",
      "https://via.placeholder.com/250&text=3",
    ];
    const randomPictureLink = images[Math.floor(Math.random()*images.length)];
    const picture = document.getElementById("js-random-image");
    picture.src = randomPictureLink;
</script>
```

<img id="js-random-image" alt="grey placeholder with number" />

<script>
    const images = [
      "https://via.placeholder.com/250&text=1",
      "https://via.placeholder.com/250&text=2",
      "https://via.placeholder.com/250&text=3",
    ];
    const randomPictureLink = images[Math.floor(Math.random()*images.length)];
    const picture = document.getElementById("js-random-image");
    picture.src = randomPictureLink;
</script>
