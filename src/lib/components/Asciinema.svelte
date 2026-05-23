<script lang="ts">
  import LazyEmbed from "./LazyEmbed.svelte";

  interface Props {
    id: string;
    description?: string;
  }

  let { id, description }: Props = $props();

  const srcdoc = $derived(
    `
			<!DOCTYPE html>
			<html>
			<head>
				<base target="_blank">
				<style>
					body { margin: 0; }
					.asciinema-player-wrapper { margin: 0 !important; }
				</style>
			</head>
			<body>
				<script id="asciicast-${id}" src="https://asciinema.org/a/${id}.js" async><` +
      `/script>
			</body>
			</html>
		`,
  );
</script>

<LazyEmbed {srcdoc} title={description || `Asciinema recording: ${id}`} minHeight={200}>
  {#snippet placeholder(loading)}
    <div class="asciinema-placeholder">
      <div class="asciinema-placeholder-icon">
        <!-- Terminal icon -->
        <svg viewBox="0 0 24 24" width="24" height="24" aria-hidden="true">
          <path
            fill="currentColor"
            d="M4 4h16a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm0 2v12h16V6H4zm2 2l4 3-4 3v-6zm6 5h6v2h-6v-2z"
          ></path>
        </svg>
      </div>
      <span class="asciinema-placeholder-text">
        {#if loading}
          Loading terminal recording...
        {:else if description}
          {description}
        {:else}
          Terminal Recording
        {/if}
      </span>
    </div>
  {/snippet}
</LazyEmbed>

<style>
  .asciinema-placeholder {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    padding: 2rem;
    background: var(--color-gray-900);
    border: 1px solid var(--color-gray-700);
    border-radius: 6px;
    min-height: 200px;
  }

  .asciinema-placeholder-icon {
    color: var(--color-green-500);
  }

  .asciinema-placeholder-text {
    font-size: 0.875rem;
    color: var(--color-gray-400);
  }
</style>
