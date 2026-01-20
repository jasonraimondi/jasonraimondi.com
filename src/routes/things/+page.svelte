<script lang="ts">
	import { base } from '$app/paths';
	import type { Thing } from '$lib/data/types';

	interface Props {
		data: {
			things: Thing[];
		};
	}

	let { data }: Props = $props();

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}
</script>

<svelte:head>
	<title>Things | Jason Raimondi</title>
	<meta
		name="description"
		content="Projects and things built by Jason Raimondi - software, apps, and experiments."
	/>
</svelte:head>

<section class="things-list">
	<h1>Things</h1>

	{#if data.things.length === 0}
		<p>No things yet.</p>
	{:else}
		<ul class="thing-items">
			{#each data.things as thing (thing.slug)}
				<li class="thing-item">
					<article>
						<h2>
							<a href="{base}/things/{thing.slug}/">{thing.title}</a>
						</h2>
						<time datetime={thing.date}>{formatDate(thing.date)}</time>
						{#if thing.description}
							<p>{thing.description}</p>
						{/if}
					</article>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.things-list h1 {
		margin-bottom: 2rem;
	}

	.thing-items {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.thing-item {
		margin-bottom: 2rem;
		padding-bottom: 2rem;
		border-bottom: 1px solid var(--color-gray-200);
	}

	.thing-item:last-child {
		border-bottom: none;
	}

	.thing-item h2 {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
	}

	.thing-item h2 a {
		text-decoration: none;
	}

	.thing-item h2 a:hover {
		text-decoration: underline;
	}

	.thing-item time {
		display: block;
		color: var(--color-gray-600);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.thing-item p {
		margin: 0;
		color: var(--color-gray-700);
	}

	:global([data-theme='dark']) .thing-item {
		border-bottom-color: var(--color-gray-700);
	}

	:global([data-theme='dark']) .thing-item time {
		color: var(--color-gray-400);
	}

	:global([data-theme='dark']) .thing-item p {
		color: var(--color-gray-300);
	}
</style>
