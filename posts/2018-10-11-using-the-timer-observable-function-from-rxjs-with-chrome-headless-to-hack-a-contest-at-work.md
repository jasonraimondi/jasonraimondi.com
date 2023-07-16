---
categories:
  - ops
  - backend
comments: true
date: "2018-10-11T00:00:00-07:00"
description: "The official rules read: “Everyone has their own tagged link that points
  to the landing page — each unique click = 1 point”. Interesting, very interesting."
images:
  - /covers/alice-butenko-R-Zo6IjKgH0-unsplash.jpg
slug: using-the-timer-observable-function-from-rxjs-with-chrome-headless-to-hack-a-contest-at-work
tags:
  - rxjs
  - typescript
  - puppeteer
  - docker
title: Using the 'timer' observable from Rxjs and Chrome Headless to hack a contest
  at work
---

![the conversation aftermath](/posts/2018/10/hack-contest/hack-contest-01.png)

I am going to begin by saying, I couldn’t not do it. It was calling to me like Ring calls to Sauron.

### Official Contest Rules

The official rules read: “Everyone has their own tagged link that points to the landing page — each unique click = 1 point”. That is very interesting... I present to you [jasonraimondi/hack-contest](https://github.com/jasonraimondi/hack-contest).

### The Code

```javascript
import * as puppeteer from "puppeteer";
import { Observable, Subscription, timer } from "rxjs";

const link = "http://bit.ly/2N9xokm";

async function addPageview() {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });
  const page = await browser.newPage();
  await page.goto(link);
  console.log(`Navigated to ${link}`);
  await browser.close();
}

const intervol = 15000;
const intervolTimer = timer(0, intervol);
const intervolTimerSubscription = intervolTimer.subscribe(addPageview);
```

We are using [puppetter](https://github.com/GoogleChrome/puppeteer), a Headless Chrome instance to spin up a new browser for us every time we want to view the page. The [‘timer’ function](http://reactivex.io/documentation/operators/timer.html) from the [Rxjs library](https://github.com/reactivex/rxjs) is what is powering our loop. We are then able to add a subscription to the timer that will execute every intervol.

### Dockerized

Running chrome headless can be a memory hog. [See here](https://github.com/GoogleChrome/puppeteer/blob/master/docs/troubleshooting.md#running-puppeteer-in-docker) for recommended way to run puppeteer in Docker. Luckily the image by alekzonder already does all of this for us. [GitHub - alekzonder/docker-puppeteer: docker image with Google Puppeteer installed](https://github.com/alekzonder/docker-puppeteer)

```dockerfile
FROM alekzonder/puppeteer
COPY package.json /app/package.json
COPY package-lock.json /app/package-lock.json
WORKDIR /app
RUN npm install -q --no-color --no-progress
COPY src /app/src
CMD ["npm", "run", "start"]
```

### Running the container

If you are interested in running the project and generating me even more page views and taking the lead of this contest even further, you can go ahead and run the container on your own machine, all you need is Docker.

```bash
docker run --rm jasonraimondi/hack-contest
```

It will give you a little heads up every time we’ve navigated to the page.

```bash
> hack-contest@1.0.0 start /app
> ts-node src/index.ts

Navigated to http://bit.ly/2N9xokm
Navigated to http://bit.ly/2N9xokm
Navigated to http://bit.ly/2N9xokm
Navigated to http://bit.ly/2N9xokm
Navigated to http://bit.ly/2N9xokm
Navigated to http://bit.ly/2N9xokm
```

### Disclaimer

I don’t actually expect to win. My goal was mostly to have fun and mess with marketing :sweat_smile:
