+++
title = "Flipp, the light up event"
slug = "flipp"
date = 2017-11-14
description = "At Event Farm, we love throwing cool events with engaging, interactive technology. This was a little something a few coworkers and I created at Event Farm."
tags = [ 
    "javascript", 
    "firebase",
    "websockets", 
    "vue.js",
]
categories = [
    "software",
    "backend",
    "frontend",
    "hardware",
]
comments = true
+++

<div class="video-responsive">
    <iframe src="https://player.vimeo.com/video/218034844" width="640" height="360" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
</div>

#### At Event Farm, we love throwing cool events with engaging, interactive technology.

At what was, in my opinion, one of the best events of our 2403 Main Street Office, we had a Art/Music show and decided to add a little even tech on top, and what came out of it was Flipp.

Meet Flipp:

{{< video/html5 mp4="https://s3.us-west-1.wasabisys.com/webcdn/posts/2017/11/flipp/flipp-mp4.mp4" webm="https://s3.us-west-1.wasabisys.com/webcdn/posts/2017/11/flipp/flipp-webm.webm" poster="https://s3.us-west-1.wasabisys.com/webcdn/posts/2017/11/flipp/flipp-screenshot.png" >}}

Flipp was an interactive piece where guests of the event could enter their phone number to get access to a controller website on their mobile devices that would allow them to vote for different artworks hanging around the office, and when they voted, they would trigger a scene change on Phillips Hue lights, signaling a vote for the particular pieces.

Overall the exhibit was a huge hit, and we had a lot of fun making it.

The source code of the front end is available on github at [https://github.com/jasonraimondi/hueInstallation](https://github.com/jasonraimondi/hueInstallation)

Firebase Usage: 

{{< image/pop portrait="true" src="https://s3.us-west-1.wasabisys.com/webcdn/posts/2017/11/flipp/firebase-usage.png" alt="Firebase Console" >}} 
