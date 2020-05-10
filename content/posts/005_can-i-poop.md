---
categories:
- software
- frontend
- backend
- hardware
comments: true
date: "2017-11-01T00:00:00-07:00"
description: A live view of Event Farm's upstairs/downstairs bathroom occupation status.
  Keep the window open for a few minutes during week day business hours and watch
  the room status. It will change without the need of a refresh.
image: https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-alfredo.png
slug: can-i-poop
tags:
- javascript
- firebase
- websockets
- vue.js
- raspberry-pi
- arduino
- alfred
title: Can I Poop?
---

A few months ago myself and a coworker attended one of the [LA Software Craftmanship](https://www.meetup.com/LA-Software-Craftsmanship/) workshops down at 8th Light centered around using the GPIO pins on the Raspberry Pi.  We wrote a few different programs in C and Python first using some sensors, and then the Tx/Rx to send messages between Pi’s.  It reminded me a lot of college where I had the opportunity to take classes like Sensors and Electronics Based Art, centered around using Arduino based sensors to make all different things, it was great.

In our LA office at Event Farm, we have two unisex bathrooms, one downstairs, and one upstairs, both in awkward spots, so you have to walk all the way over to them basically to see if they are occupied. Our LA office also happens to be our product office, including our engineering and design teams. For engineers and designers, it can be difficult to get back into a groove after walking over only to find the toilet is taken.

At first, there were several very janky proposals set up, with the first best idea being a 180 degree mirror so we could see the status of the door. That is pretty ridiculous, but not as ridiculous as what we really ended up with.

The Software Craftsmanship meet up was a great inspiration to get going, and it ultimately made us to realize that a Raspberry Pi would be a great way to solve our wee predicament.

I present to you [canipoop.com](http://canipoop.com), Yes, seriously.

{{< image/gallery/frame >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-website-1open.png" alt="Can I Poop Website Screenshot - One Open" >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-website-2open.png" alt="Can I Poop Website Screenshot - Two Open" >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-firebase.png" alt="Firebase Panel" >}}
{{< /image/gallery/frame >}}

When you open the page you are met with the bathroom status of the LA office of Event Farm. Open or closed, upstairs and downstairs.

We ended up using a Raspberry Pi downstairs and an Arduino upstairs, each hooked up to a reed switch on their respective bathroom door. On interrupt of the reed switch we are updating a firebase database with the most recent status of the door: open or closed.

The front end of the site is a simple Vue.js site that is connecting to firebase to reflect the status of the rooms. The top half of the site represents the upstairs bathroom, and the bottom half of the page represents the downstairs bathroom. Our connection to firebase is a websocket, so, basically instantly, if the door opens or closes, the site reflects the state.

We ended up with the domain [canipoop.com](http://canipoop.com) mostly because it was a really great one that was surprisingly still available, so we instantly hopped on it. I think we were originally joking around about www.isthebathroomopen.com; *luckily* that one was taken.

Since the internal release of [canipoop.com](http://canipoop.com) several months ago, we have built even more internal apps and tools for our poo problem. To my knowledge, the current CanIPoop Suite of apps  includes, well the website, then a native iPhone app that is reading the same firebase database. We also have an Alfred Workflow, and lastly a simple Go terminal app.

The whole suite of canipoop apps is available at [https://github.com/pdt256/canipoop](https://github.com/pdt256/canipoop), feel free to poke around, or maybe even contribute a PR.

{{< image/gallery/frame >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-raspberry-pi-behind-wall.jpg" alt="Raspberry Pi installed behind wall panel" >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-wiring-downstairs-3.jpg" alt="Speaker wiring around the mirror" >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-wiring-downstairs-1.jpg" alt="Reed switches on downstairs bathroom door, inside the door" >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-wiring-upstairs-2.jpg" alt="Reed switches on upstairs bathroom door, outside the door" >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-wiring-upstairs-3.jpg" alt="Reed switches on upstairs bathroom door, outside the door" >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-arduino-enclosure.jpg" alt="Arduino enclosure" >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-arduino-1.jpg" alt="Arduino Layout 1" >}}
    {{< image/gallery/image src="https://assets.jasonraimondi.com/posts/2017/11/canipoop/canipoop-ardunio-2.jpg" alt="Arduino Layout 2" >}}
{{< \/image/gallery/frame >}}
