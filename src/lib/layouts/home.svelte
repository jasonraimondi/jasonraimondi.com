<script>
  import "normalize.css";
  import "$styles/style.css";
  import TopNav from "$lib/TopNav.svelte";
</script>

<TopNav />

<div class="home container center padded">
  <slot />
</div>
