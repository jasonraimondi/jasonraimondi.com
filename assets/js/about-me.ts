const adjectives1 = [
  "technologist",
  "technologist",
  "technophile",
  "technophile",
  "tinkerer",
];

const adjectives2 = [
  "computer geek",
  "computer geek",
  "computer geek",
  "dog lover",
  "dog lover",
  "hacker",
  "gamer",
];

const doings = [
  "playing frisbee with Ruby",
  "out on a hike",
  "playing video games",
  "downloading Linux ISO's",
  "securing my network",
  "learning a new language",
  "looking at self-hosted software",
  "practicing software design patterns",
];

function arrSample(arr) {
  const id = Math.floor(Math.random() * arr.length);
  return [arr[id], id];
}

function setDoingThings(span) {
  const [doings1, id1] = arrSample(doings);
  doings.splice(id1, 1);
  span.textContent = doings1;
}

function updatePage() {
  const adj1 = document.getElementById("adjective1");
  const adj2 = document.getElementById("adjective2");

  if (adj1) adj1.textContent = arrSample(adjectives1)[0];
  if (adj2) adj2.textContent = arrSample(adjectives2)[0];

  const do1 = document.getElementById("doing1");
  const do2 = document.getElementById("doing2");

  if (do1) setDoingThings(do1);
  if (do2) setDoingThings(do2);
}

void (function () {
  updatePage();
  setInterval(updatePage, 60000);
})();
