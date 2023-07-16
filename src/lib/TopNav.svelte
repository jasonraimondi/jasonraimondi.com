<script>
  import zombie from "../assets/zombie-avatar.webp?run&width=250;500&format=avif;webp;png";

  import Img from "@zerodevx/svelte-img";
  import { page } from "$app/stores";

  export const links = [
    { name: "Posts", url: "/posts" },
    // { name: "Apps", url: "/posts/somethingyes" },
    // { name: "Apps", url: "/things" },
    // { name: "Uses", url: "/uses" },
  ];

  $: isHome = new URL($page.url).pathname === "/";
</script>

<nav class="container center">
  <a class="avatar" href="/">
    <Img alt="my profile image" src={zombie} />
  </a>

  <ul class="bar">
    <li style={isHome && "visibility: hidden"}>
      <h2 class="title"><a href="/" class="unstyled">jason raimondi</a></h2>
    </li>
    <li>
      <ul class="links">
        {#each links as link}
          <li class="mr-2"><a href={link.url}>{link.name}</a></li>
        {/each}
        <li>
          <a href="/resume" class="mr-1">Resume</a>
          <a href="/resume.pdf" class="label" target="_blank"><span>pdf</span></a>
          <a href="/resume.json" class="label" target="_blank"><span>json</span></a>
        </li>
      </ul>
    </li>
  </ul>
</nav>

<style lang="postcss">
  .container {
    display: flex;
    align-items: center;
  }

  .avatar {
    :global(img) {
      height: 8rem;
      width: auto;
    }
  }

  .bar {
    position: relative;
    top: -10px;
  }

  .links {
    display: flex;

    & li:not(:first-child) {
      margin-left: 1rem;
    }
  }

  .title {
    font-size: var(--h1);
    margin: 0;
    text-transform: uppercase;
  }
</style>
