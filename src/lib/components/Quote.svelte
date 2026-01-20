<script lang="ts">
	import type { Snippet } from 'svelte';

	interface Props {
		author?: string;
		source?: string;
		link?: string;
		title?: string;
		children: Snippet;
	}

	let { author, source, link, title, children }: Props = $props();

	// Auto-generate title from link if not provided
	const displayTitle = $derived.by(() => {
		if (title) return title;
		if (!link) return undefined;

		// Remove protocol and www.
		let cleaned = link.replace(/^https?:\/\//, '').replace(/^www\./, '');

		// If longer than 32 chars, truncate at last slash before 32 chars
		if (cleaned.length > 32) {
			const truncated = cleaned.slice(0, 32);
			const lastSlash = truncated.lastIndexOf('/');
			if (lastSlash > 0) {
				cleaned = truncated.slice(0, lastSlash + 1) + '...';
			} else {
				cleaned = truncated + '...';
			}
		}

		return cleaned;
	});
</script>

<blockquote class="quote">
	<p>{@render children()}</p>
	{#if author || source || link}
		<footer>
			{#if author}
				<strong>{author}</strong>
			{/if}
			{#if source}
				<cite>{source}</cite>
			{:else if link}
				<cite>
					<a href={link} title={link} target="_blank" rel="noopener">{displayTitle}</a>
				</cite>
			{:else if title}
				<cite>{title}</cite>
			{/if}
		</footer>
	{/if}
</blockquote>

<style>
	.quote {
		margin: 1.5rem 0;
		padding: 1rem 1.5rem;
		border-left: 4px solid var(--color-gray-300);
		background: var(--color-gray-50);
		font-style: italic;
	}

	:global([data-theme='dark']) .quote {
		border-left-color: var(--color-gray-600);
		background: var(--color-gray-800);
	}

	.quote p {
		margin: 0 0 0.75rem 0;
	}

	.quote p:last-child {
		margin-bottom: 0;
	}

	.quote footer {
		font-size: 0.875rem;
		font-style: normal;
		color: var(--color-gray-600);
	}

	:global([data-theme='dark']) .quote footer {
		color: var(--color-gray-400);
	}

	.quote footer strong {
		font-weight: 600;
	}

	.quote footer cite {
		font-style: italic;
	}

	.quote footer cite::before {
		content: '— ';
	}

	.quote footer strong + cite::before {
		content: ', ';
	}

	.quote footer a {
		color: inherit;
		text-decoration: underline;
	}

	.quote footer a:hover {
		color: var(--link-color);
	}
</style>
