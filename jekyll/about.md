---
layout: master
---

<br />

<img id="photo-of-me" alt="Me" />

<script>
    var myArray = [
      "/assets/misc/about/us.png",
      "/assets/misc/about/us.png",
      "/assets/misc/about/codecraft-2018.jpg",
      "/assets/misc/about/codecraft-2018.jpg",
      "/assets/misc/about/colorado-2018.jpg",
    ];
    var randomItem = myArray[Math.floor(Math.random()*myArray.length)];
    var anchor = document.getElementById('photo-of-me'); //or grab it by tagname etc
    anchor.src = randomItem
</script>

My name is Jason Raimondi and I am a Full Stack Software Engineer currently living in Los Angeles, CA. I am a student of [Clean Code](https://cleancoders.com/), a [Software Crafter](https://scna.softwarecraftsmanship.org/).

I have a Bachelors of Fine Arts in Digital Media from the University of Florida, with my primary focus being on the web. I formed Digital Canvas Design LLC in January of 2014 to help maintain my growing number of clients.

I have been professionally developing for the web since 2009, primarily developing sites early on in **PHP** and **JavaScript**. I have experience writing microservices (ding!) libraries in **Golang** and **Python**. Recently, my favorite stack has been **React in TypeScript**. I manage a number of client projects on VPS' ranging from AWS, to Linode, Digital Ocean, as well as bare metal hosting at Liquid Web. I have migrated to an entire container based deploy using **Docker** and **Docker Swarm**. I build applications following the [The Twelve-Factor App](https://12factor.net/) methodology.

I have a passion for writing Clean software based on SOLID design principles. I have been a student of TDD, practicing daily since Fall 2016. The Event Farm API was rewritten using TDD practices, and has maintained an 85% coverage on a roughly 200K+ LOC Rest API written in PHP 7.1 using **Domain Driven Design** and a Command/Query JSON REST API. 

I am a technologist and all around computer geek. If I’m not learning a new language or practicing software architecture design patterns, I'm out with my amazing fiancé or watching, listening to, or reading to a good movie or book. 

Feel free to peek at my [Resume](./resume) or [GoodReads](https://www.goodreads.com/user/show/70344177-jason)
