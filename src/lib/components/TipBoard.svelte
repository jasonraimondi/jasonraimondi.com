<script lang="ts">
  import type { Snippet } from "svelte";

  interface Props {
    variant?: "default" | "info" | "error";
    title?: string;
    children: Snippet;
  }

  let { variant = "default", title, children }: Props = $props();
</script>

<div class="tipboard-wrapper" data-variant={variant}>
  <div class="tipboard">
    {#if title}
      <p class="title">{title}</p>
    {/if}
    {@render children()}
  </div>
</div>

<style>
  .tipboard-wrapper {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .tipboard {
    display: inline-block;
    padding: 0.5rem;
    border-radius: 0.25rem;
    font-size: 1rem;
    width: 100%;
    font-weight: 500;
    color: var(--color-gray-600);
    background-color: var(--color-gray-200);
    border: 1px solid var(--color-gray-600);
  }

  .tipboard .title {
    padding-bottom: 0;
    font-weight: 700;
    font-size: 1.2rem;
  }

  .tipboard-wrapper[data-variant="info"] .tipboard {
    color: var(--color-green-600);
    background-color: var(--color-green-200);
    border-color: var(--color-green-600);
  }

  :global([data-theme="dark"]) .tipboard-wrapper[data-variant="info"] .tipboard {
    color: var(--color-purple-600);
    background-color: var(--color-purple-200);
    border-color: var(--color-purple-600);
  }

  .tipboard-wrapper[data-variant="error"] .tipboard {
    color: var(--color-rose-600);
    background-color: var(--color-rose-200);
    border-color: var(--color-rose-600);
  }

  :global([data-theme="dark"]) .tipboard-wrapper[data-variant="error"] .tipboard {
    color: var(--color-rose-400);
    background-color: color-mix(in srgb, var(--color-rose-900) 30%, transparent);
    border-color: var(--color-rose-400);
  }

  :global([data-theme="dark"]) .tipboard-wrapper[data-variant="default"] .tipboard,
  :global([data-theme="dark"]) .tipboard {
    color: var(--color-gray-400);
    background-color: var(--color-gray-800);
    border-color: var(--color-gray-600);
  }

  .tipboard :global(pre) {
    margin: 0;
    background: transparent;
    padding: 0;
  }

  .tipboard :global(code) {
    font-size: 0.875rem;
    line-height: 1.5;
    background: transparent;
  }
</style>
