<script>
  export let src;
  export let alt;
</script>

<a class="image-gallery-anchor" target="_blank" href={src}>
  <img class="image-gallery-image" alt="my profile image" {src} />
  <small class="image-alt-text">{alt}</small>
</a>

<style lang="postcss">
  .image-gallery-anchor {
    text-decoration: none;
    font-style: italic;
    color: var(--colors-gray-500);

    & a:hover {
      background-image: none !important;
    }
  }
</style>
