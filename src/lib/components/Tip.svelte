<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		type?: 'info' | 'warning';
		title?: string;
		children: Snippet;
	}

	let { type = 'info', title, children }: Props = $props();

	const displayTitle = $derived(title ?? type);
</script>

<div class="tip tip--{type}">
	{#if displayTitle.trim()}
		<span class="tip--title">{displayTitle}</span>
	{/if}
	{@render children()}
</div>

<style>
	.tip {
		background-color: var(--color-gray-200);
		color: var(--color-black);
		padding: 1rem;
		border-left: 0.5rem solid var(--color-gray-400);
		border-radius: 0 0.5rem 0.5rem 0;
		margin: 1rem 0;
	}

	.tip--info {
		background-color: var(--color-lightBlue-200);
		border-left-color: var(--color-lightBlue-400);
	}

	.tip--warning {
		background-color: var(--color-rose-200);
		border-left-color: var(--color-rose-400);
	}

	.tip--title {
		display: block;
		text-transform: uppercase;
		font-weight: var(--font-semibold);
		font-size: 0.8em;
		padding-bottom: 0.25em;
	}

	:global([data-theme='dark']) .tip {
		background-color: var(--color-gray-700);
		color: var(--color-gray-100);
	}

	:global([data-theme='dark']) .tip--info {
		background-color: color-mix(in oklch, var(--color-lightBlue-700) 50%, transparent);
		border-left-color: var(--color-lightBlue-500);
	}

	:global([data-theme='dark']) .tip--warning {
		background-color: color-mix(in oklch, var(--color-rose-700) 50%, transparent);
		border-left-color: var(--color-rose-500);
	}
</style>
