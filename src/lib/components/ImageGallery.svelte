<script lang="ts">
  import { trapFocus } from "$lib/actions/trapFocus";
  import { fade, scale } from "svelte/transition";

  interface GalleryImage {
    src: string;
    alt?: string;
  }

  interface Props {
    images: GalleryImage[];
  }

  let { images }: Props = $props();

  let currentIndex = $state<number | null>(null);

  const isOpen = $derived(currentIndex !== null);
  const currentImage = $derived(currentIndex !== null ? images[currentIndex] : null);
  const hasPrev = $derived(currentIndex !== null && currentIndex > 0);
  const hasNext = $derived(currentIndex !== null && currentIndex < images.length - 1);

  function openLightbox(index: number) {
    currentIndex = index;
  }

  function closeLightbox() {
    currentIndex = null;
  }

  function showPrev() {
    if (currentIndex !== null && currentIndex > 0) {
      currentIndex = currentIndex - 1;
    }
  }

  function showNext() {
    if (currentIndex !== null && currentIndex < images.length - 1) {
      currentIndex = currentIndex + 1;
    }
  }

  function handleKeydown(event: KeyboardEvent) {
    if (!isOpen) return;

    switch (event.key) {
      case "Escape":
        closeLightbox();
        break;
      case "ArrowLeft":
        showPrev();
        break;
      case "ArrowRight":
        showNext();
        break;
    }
  }

  function handleBackdropClick(event: MouseEvent) {
    if (event.target === event.currentTarget) {
      closeLightbox();
    }
  }
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="image-gallery-container">
  {#each images as image, index (image.src)}
    <button type="button" class="image-gallery-anchor" onclick={() => openLightbox(index)}>
      <picture class="image-gallery-image">
        <img src={image.src} alt="" loading="lazy" />
      </picture>
      {#if image.alt}
        <small class="image-alt-text">{image.alt}</small>
      {/if}
    </button>
  {/each}
</div>

{#if isOpen && currentImage}
  <!-- svelte-ignore a11y_no_static_element_interactions -->
  <div
    class="lightbox-backdrop"
    transition:fade={{ duration: 200 }}
    onclick={handleBackdropClick}
    onkeydown={handleKeydown}
  >
    <div
      class="lightbox-content"
      role="dialog"
      aria-modal="true"
      aria-label={currentImage.alt || "Image viewer"}
      tabindex="-1"
      transition:scale={{ duration: 200, start: 0.9 }}
      use:trapFocus
    >
      <button type="button" class="lightbox-close" onclick={closeLightbox} aria-label="Close">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
          />
        </svg>
      </button>

      <div class="lightbox-navigation">
        <button
          type="button"
          class="lightbox-nav-button lightbox-prev"
          onclick={showPrev}
          disabled={!hasPrev}
          aria-label="Previous image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
          </svg>
        </button>

        <div class="lightbox-image-container">
          {#key currentIndex}
            <img src={currentImage.src} alt="" class="lightbox-image" in:fade={{ duration: 150 }} />
          {/key}
        </div>

        <button
          type="button"
          class="lightbox-nav-button lightbox-next"
          onclick={showNext}
          disabled={!hasNext}
          aria-label="Next image"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
            <path d="M8.59 16.59L10 18l6-6-6-6-1.41 1.41L13.17 12z" />
          </svg>
        </button>
      </div>

      {#if currentImage.alt}
        <p class="lightbox-caption">{currentImage.alt}</p>
      {/if}

      <p class="lightbox-counter">{(currentIndex ?? 0) + 1} / {images.length}</p>
    </div>
  </div>
{/if}

<style>
  .image-gallery-container {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 1rem;
  }

  .image-gallery-image,
  .image-gallery-image img {
    display: block;
    width: 100%;
    height: 100%;
  }

  .image-gallery-image img {
    object-fit: cover;
  }

  .image-gallery-anchor {
    display: block;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    cursor: zoom-in;
    text-decoration: none;
    font-style: italic;
    color: var(--color-gray-500);
    text-align: left;
  }

  .image-gallery-anchor:hover {
    background-image: none !important;
  }

  .image-alt-text {
    display: block;
    margin-top: 0.25rem;
  }

  .lightbox-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
  }

  .lightbox-content {
    position: relative;
    max-width: 95vw;
    max-height: 95vh;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lightbox-close {
    position: absolute;
    top: -40px;
    right: 0;
    width: 32px;
    height: 32px;
    padding: 4px;
    border: none;
    background: transparent;
    color: white;
    cursor: pointer;
    opacity: 0.8;
    transition: opacity 150ms;
    z-index: 10;
  }

  .lightbox-close:hover {
    opacity: 1;
  }

  .lightbox-close svg {
    width: 100%;
    height: 100%;
  }

  .lightbox-navigation {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  .lightbox-nav-button {
    width: 48px;
    height: 48px;
    padding: 8px;
    border: none;
    background: rgba(255, 255, 255, 0.1);
    color: white;
    cursor: pointer;
    border-radius: 50%;
    transition:
      opacity 150ms,
      background 150ms;
    flex-shrink: 0;
  }

  .lightbox-nav-button:hover:not(:disabled) {
    background: rgba(255, 255, 255, 0.2);
  }

  .lightbox-nav-button:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }

  .lightbox-nav-button svg {
    width: 100%;
    height: 100%;
  }

  .lightbox-image-container {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: calc(95vw - 120px);
    max-height: 75vh;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 75vh;
    object-fit: contain;
    border-radius: 4px;
  }

  .lightbox-caption {
    margin-top: 1rem;
    color: white;
    font-size: 0.875rem;
    text-align: center;
    max-width: 600px;
  }

  .lightbox-counter {
    margin-top: 0.5rem;
    color: rgba(255, 255, 255, 0.6);
    font-size: 0.75rem;
  }

  @media (max-width: 640px) {
    .lightbox-nav-button {
      width: 36px;
      height: 36px;
      padding: 6px;
    }

    .lightbox-image-container {
      max-width: calc(100vw - 100px);
    }
  }
</style>
