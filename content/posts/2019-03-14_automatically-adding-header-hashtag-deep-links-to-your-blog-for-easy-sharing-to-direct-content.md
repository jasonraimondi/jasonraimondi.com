+++
title = "A vanilla JS solution to adding header deep links to your blog for easy sharing to direct content"
slug = "adding-vanilla-js-header-hashtag-deep-links-to-your-blog-for-easy-sharing-to-direct-content"
date = 2019-03-14
description = "Now every time I am about to launch Chrome, I see the \"Launch Firefox Instead of Chrome\" launcher."
tags = [ 
    "javascript", 
    "blog", 
]
categories = [
    "frontend",
]
+++

#### <-- This # lets you return directly to this link!

In the markdown that I write to create this blog post, I don't need to worry about anchoring my title links. Here is a little preview of my page so far.

```markdown
#### <-- This # lets you return directly to this link!

In the markdown that I write to create this blog post, I don't need to worry about anchoring my title links. Here is a little preview of my page so far.

```

I can just go on my day blogging, sectioning out content as I deem appropriate.

#### Creating the links dynamically on page load

Using vanilla JavaScript, we can dig in and grab all the header tags inside of our `#post-content` and dynamically add an anchor element and prepend it to the header tag.

```javascript
const addHeaderDeepLinks = function() {
    const postDoc = document.getElementById('post-content');
    const elements = [
        postDoc.getElementsByTagName('h2'),
        postDoc.getElementsByTagName('h3'),
        postDoc.getElementsByTagName('h4'),
        postDoc.getElementsByTagName('h5'),
        postDoc.getElementsByTagName('h6'),
    ];
    for (let i = 0; i < elements.length; i++) {
        for (let k = 0; k < elements[i].length; k++) {
            const header = elements[i][k];
            const anchor = document.createElement('a');
            anchor.className = 'header-link mr-2 text-grey';
            anchor.href = '#' + header.id;
            anchor.innerHTML = '#';
            header.insertBefore(anchor, header.firstChild);
        }
    }
};
addHeaderDeepLinks();
```

Simple and effective. View the source of this page. that is how these links are being generated.
