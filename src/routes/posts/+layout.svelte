<script lang="ts">
  import "$styles/style.css";

  import TopNav from "$lib/TopNav.svelte";
</script>

<TopNav />

<div class="container center">
  <slot />
</div>
