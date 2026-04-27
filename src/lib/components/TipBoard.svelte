<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		variant?: 'default' | 'info' | 'error';
		title?: string;
		children: Snippet;
	}

	let { variant = 'default', title, children }: Props = $props();
</script>

<div class="tipboard-wrapper {variant}">
	<div class="tipboard">
		{#if title}
			<p class="title">{title}</p>
		{/if}
		{@render children()}
	</div>
</div>
