<script lang="ts">
	import { onMount } from 'svelte';

	interface Props {
		id: string;
		description?: string;
	}

	let { id, description }: Props = $props();

	let container: HTMLElement;
	let loaded = $state(false);
	let loading = $state(false);

	function loadAsciinema() {
		if (loaded || loading) return;
		loading = true;

		// Asciinema uses document.write, so we need to capture its output in an iframe
		const iframe = document.createElement('iframe');
		iframe.style.width = '100%';
		iframe.style.border = 'none';
		iframe.style.overflow = 'hidden';
		iframe.setAttribute('title', description || `Asciinema recording: ${id}`);

		// eslint-disable-next-line svelte/no-dom-manipulating -- Required for iframe-based embedding
		container.innerHTML = '';
		// eslint-disable-next-line svelte/no-dom-manipulating -- Required for iframe-based embedding
		container.appendChild(iframe);

		const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
		if (!iframeDoc) {
			loading = false;
			return;
		}

		// Write the iframe content with the asciinema script
		iframeDoc.open();
		iframeDoc.write(`
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
				<script id="asciicast-${id}" src="https://asciinema.org/a/${id}.js" async><` + `/script>
			</body>
			</html>
		`);
		iframeDoc.close();

		// Resize iframe to fit content
		const resizeObserver = new ResizeObserver(() => {
			const height = iframeDoc.body?.scrollHeight;
			if (height) {
				iframe.style.height = `${height}px`;
			}
		});

		iframe.onload = () => {
			loaded = true;
			loading = false;
			if (iframeDoc.body) {
				resizeObserver.observe(iframeDoc.body);
				// Initial resize
				const height = iframeDoc.body.scrollHeight;
				if (height) {
					iframe.style.height = `${height}px`;
				}
			}
		};
	}

	onMount(() => {
		const observer = new IntersectionObserver(
			(entries) => {
				entries.forEach((entry) => {
					if (entry.isIntersecting) {
						loadAsciinema();
						observer.disconnect();
					}
				});
			},
			{
				rootMargin: '100px' // Start loading slightly before it enters viewport
			}
		);

		observer.observe(container);

		return () => observer.disconnect();
	});
</script>

<div class="asciinema-container" bind:this={container}>
	{#if !loaded}
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
	{/if}
</div>

<style>
	.asciinema-container {
		margin: 1.5rem 0;
		min-height: 200px;
	}

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
