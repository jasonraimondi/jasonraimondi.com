<div class="image-gallery-container">
  <slot />
</div>

<style>
  .image-gallery-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    grid-gap: 1rem;
  }
</style>
