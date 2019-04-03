+++
title = "Recovery Passport"
slug = "recovery-passport-three-tiered-support-system"
date = 2019-03-18
description = "Recovery Passport  is a three tiered support system for mental and drug rehab patients, and those closest to them."
tags = [ 
    "vue.js",
    "php",
    "javascript",
]
categories = [
    "frontend",
    "backend",
    "ops",
]
featuredImage = "/assets/posts/2019/03/recovery-passport/recovery-passport_1.png"
+++

[Jack Powers](https://www.linkedin.com/in/jackpowersjr/) - Cofounder/CEO

[Jason Ibarra](https://www.linkedin.com/in/jasonibarraseo/) - Cofounder/COO

[Jason Raimondi](https://www.linkedin.com/in/jasonraimondi/) - Lead Software Engineer

Recovery Passport is a tool used by several mental and drug rehabilitation patients in South Florida, allowing the member to enter daily if they have been taking care of themselves and staying sober, as well as entering journal entries and goals viewable by their counselors and supporters.

Members are invited by their counselors and asked to journal daily about their thoughts and feelings. After each entry, the member is presented with  three questions:

1. How big of a deal is this for you?
2. Pick a color to describe this entry? Blue skies, Yellow caution, or Red zone.
3. How are you feeling? 1 horrible to 10 excellent

Journal entries are locked after a 30 minute period.

<image-pop
    v-bind:portrait="true"
    src="/assets/posts/2019/03/recovery-passport/recovery-passport_1.png"
    alt="When logging into the app, members need to answer daily if they have maintained sobriety, or taken care of themselves (if mental rehab)."
></image-pop>

<image-pop
    v-bind:portrait="true"
    src="/assets/posts/2019/03/recovery-passport/recovery-passport_2.png"
    alt="Basic example member profile"
></image-pop>

<image-pop
    v-bind:portrait="true"
    src="/assets/posts/2019/03/recovery-passport/recovery-passport_3.png"
    alt="Adding an entry to Recovery Passport"
></image-pop>

<image-pop
    v-bind:portrait="true"
    src="/assets/posts/2019/03/recovery-passport/recovery-passport_4.png"
    alt="After your entry, you need to answer how this event makes you feel"
></image-pop>

<image-pop
    v-bind:portrait="true"
    src="/assets/posts/2019/03/recovery-passport/recovery-passport_5.png"
    alt="Entries are only editable for 30 minutes"
></image-pop>

<image-pop
    v-bind:portrait="true"
    src="/assets/posts/2019/03/recovery-passport/recovery-passport_7.png"
    alt="Notifications list"
></image-pop>

### Stack

The app was developed using the LEMP stack in Laravel, and uses elements of Vue.js on the front end. Deployed to a Docker Swarm on Digital Ocean.