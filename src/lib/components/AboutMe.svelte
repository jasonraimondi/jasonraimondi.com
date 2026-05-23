<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { fade } from "svelte/transition";

  const adjectives1 = ["technologist", "technologist", "technophile", "technophile"];

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

  function sample<T>(arr: T[]): T {
    return arr[Math.floor(Math.random() * arr.length)];
  }

  function sampleAndRemove<T>(arr: T[]): T {
    const idx = Math.floor(Math.random() * arr.length);
    const [item] = arr.splice(idx, 1);
    return item;
  }

  let adjective1 = $state(sample(adjectives1));
  let adjective2 = $state(sample(adjectives2));

  let doingsList = $state([...doings]);
  let doing1 = $state("");
  let doing2 = $state("");

  function updateDoings() {
    if (doingsList.length < 2) {
      doingsList = [...doings];
    }
    doing1 = sampleAndRemove(doingsList);
    doing2 = sampleAndRemove(doingsList);
  }

  function updatePage() {
    adjective1 = sample(adjectives1);
    adjective2 = sample(adjectives2);
    updateDoings();
  }

  let interval: ReturnType<typeof setInterval>;

  onMount(() => {
    updateDoings();
    interval = setInterval(updatePage, 60000);
  });

  onDestroy(() => {
    if (interval) clearInterval(interval);
  });
</script>

<div class="home">
  <h1>Hey, I’m Jason. 👋</h1>

  <h2>
    I am a
    {#key adjective1}
      <span in:fade={{ duration: 300 }}>{adjective1}</span>
    {/key}
    and
    {#key adjective2}
      <span in:fade={{ duration: 300 }}>{adjective2}</span>
    {/key}.
  </h2>

  <p>
    ⚠️⚠️ It has come to my attention that someone may be impersonating me. I am currently employed
    and am not applying for or seeking new opportunities. If you receive any communication claiming
    to be from me, please contact me at jason@raimondi.us.
  </p>

  <p>I work at <a href="https://intelligems.io">Intelligems</a> as a Senior Software Engineer.</p>

  <p>
    I have been developing for the web since 2007. I’ve worked on everything from terrible
    old-school spaghetti monsters 🍝, to MVC frameworks, to tested domain-driven applications. Early
    on, I was developing traditional server-rendered PHP applications. These days, I really enjoy
    full stack TypeScript.
  </p>

  <p>I have professional experience building modular, horizontally scalable applications.</p>

  <p>
    If I’m not hanging out with my amazing <a href="https://kimcalderone.com">wife</a> and
    <a
      href="https://jasonraimondi.com/images/zombie-avatar_hu9363f3c1e4663e069451d44174bd9478_83191_0x1000_resize_q75_h2_box_3.webp"
      >pup</a
    >, I am most likely
    {#key doing1}
      <span in:fade={{ duration: 300 }}>{doing1}</span>
    {/key}
    or
    {#key doing2}
      <span in:fade={{ duration: 300 }}>{doing2}</span>
    {/key}.
  </p>
</div>

<style>
  .home {
    line-height: 1.4;

    & p {
      padding-bottom: 1em;
    }

    & h1,
    & h2 {
      font-family: var(--font-family-sans);
    }

    & h1 {
      font-size: 2.2rem;
    }

    & h2 {
      font-size: 1.6rem;
      line-height: 1;
    }
  }
</style>
