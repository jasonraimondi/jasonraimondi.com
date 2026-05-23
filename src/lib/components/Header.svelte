<script lang="ts">
  import { page } from "$app/state";
  import { base } from "$app/paths";
  import ThemeToggle from "./ThemeToggle.svelte";

  const isHome = $derived(page.url.pathname === "/");
</script>

<nav class="top-bar">
  <a class="avatar" href="{base}/">
    <picture>
      <source
        srcset="/misc/me/zombie-avatar.webp, /misc/me/zombie-avatar@2x.webp 2x"
        type="image/webp"
      />
      <img src="/misc/me/zombie-avatar.webp" alt="Jason Raimondi" />
    </picture>
  </a>

  <div class="top-bar--nav">
    {#if !isHome}
      <h2 class="top-bar--title">
        <a href="{base}/" class="unstyled">Jason Raimondi</a>
      </h2>
    {/if}
    <ul class="topbar--nav--itemlist">
      <li class="mr-2"><a href="{base}/posts">Posts</a></li>
      <li class="mr-2"><a href="{base}/things">Apps</a></li>
      <li class="mr-2"><a href="{base}/uses">Uses</a></li>
      <li>
        <a href="{base}/resume" class="mr-1">Resume</a>
        <a href="{base}/resume.pdf" class="label" target="_blank">pdf</a>
        <a href="{base}/resume.json" class="label" target="_blank">json</a>
      </li>
      <li>
        <ThemeToggle />
      </li>
    </ul>
  </div>
</nav>

<style>
  .top-bar {
    margin-bottom: 2rem;

    @media (--medium) {
      display: flex;
      font-size: var(--text-lg);
    }
  }

  .top-bar--title {
    text-transform: uppercase;
    margin: 0;
    font-size: var(--h1);
  }

  .top-bar--nav {
    list-style-type: none;
    padding-left: 0;
    text-transform: uppercase;
    font-weight: var(--font-semibold);

    & li {
      margin-right: 1em;
    }

    & .label {
      position: relative;
      bottom: 2px;
    }

    @media (--medium) {
      padding-left: 1rem;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .topbar--nav--itemlist {
    display: flex;
    height: 100%;
  }

  .avatar {
    display: block;
    grid-area: avatar;
    height: 4rem;
    margin-bottom: 0.5rem;

    & picture {
      display: block;
      height: 100%;
      width: 100%;
    }

    & img {
      height: 100%;
      border-radius: 0.5rem;
    }

    @media (--medium) {
      height: 5rem;
      transform: scale(1.2);
    }

    @media (--large) {
      height: 6rem;
      transform: scale(1.4);
    }

    @media (--xlarge) {
      height: 7rem;
    }

    @media (--xxlarge) {
      height: 8rem;
    }
  }
</style>
