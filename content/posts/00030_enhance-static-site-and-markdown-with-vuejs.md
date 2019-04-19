+++
title = "Enhancing your static site and markdown posts with Vue.js"
slug = "enhancing-your-static-site-and-markdown-posts-with-vuejs"
date = 2019-03-17
description = "Write inline web components in markdown posts to enhancing your static site"
tags = [ 
    "vue.js",
    "javascript",
    "markdown",
    "static-site",
]
categories = [
    "frontend",
]
+++

Adding some dynamic elements to your static generated site can be super easy using Vue.js and some dynamic components.

In this blog, I am able to add this to my markdown files:

```html
<image-pop
    src="/assets/posts/2019/03/william-fonteneau-1437891-unsplash-10p.jpg"
    alt="Photo by William Fonteneau on Unsplash"
></image-pop>
```

And when my code is published, it turns out a little something like this:

<image-pop
    src="/assets/posts/2019/03/william-fonteneau-1437891-unsplash-10p.jpg"
    alt="Photo by William Fonteneau on Unsplash"
></image-pop>

Photo by [William Fonteneau](https://unsplash.com/photos/lVpEY1BOTuM?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) on [Unsplash](https://unsplash.com/?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText) 

And code to implement the feature:

```javascript

const ImagePop = Vue.component('image-pop', {
    name: 'image-pop',
    props: ['src', 'alt', 'portrait'],
    computed: {
        isPortrait: function () {
            return !!this.portrait;
        },
    },
    template: `
 <div class="image-pop-container" v-bind:class="{ portrait: isPortrait }">
     <img :src="src" :alt="alt" :title="alt" class="pops">
     <small class="image-pop-title">{{ alt }}</small>
 </div>
`
});

const vm = new Vue({
    el: '#post-content',
    components: {
        VideoContainer,
        ImageGallery,
        ImagePop,
    }
});
```

It is a super simple way to add some life to your posts.