---
categories:
- frontend
comments: true
date: "2019-04-18T00:00:00-07:00"
description: Write inline web components in markdown posts to enhancing your static
  site
images: 
- /covers/ruslan-bogdanov-vfqBtntwQc8-unsplash.jpg
slug: enhancing-your-static-site-and-markdown-posts-with-vuejs
tags:
- vue
- javascript
- frontend
title: Enhancing your static site and markdown posts with Vue.js
---

Adding some dynamic elements to your static generated site can be super easy using Vue.js and some dynamic components.

In this blog, I am able to add this to my markdown files:

```html
<image-pop
    src="./imgs/william-fonteneau-1437891-unsplash-10p.jpg"
    alt="Photo by William Fonteneau on Unsplash"
></image-pop>
```

And when my code is published, it turns out a little something like this:

{{< image/pop src="./imgs/william-fonteneau-1437891-unsplash-10p.jpg" alt="Photo by William Fonteneau on Unsplash" >}}

Photo by [William Fonteneau](https://unsplash.com/photos/lVpEY1BOTuM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) 

And code to implement the feature is on [GitHub](https://gist.github.com/jasonraimondi/e03b0c4506901b8c9f2f62eee6fe313b).

It is a super simple way to add some life to your posts.
