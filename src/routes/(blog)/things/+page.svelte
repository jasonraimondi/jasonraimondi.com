<script lang="ts">
	import { base } from '$app/paths';
	import type { Thing } from '$lib/data/types';

	interface Props {
		data: {
			things: Thing[];
		};
	}

	let { data }: Props = $props();

	const siteUrl = 'https://jasonraimondi.com';
	const pageUrl = `${siteUrl}/things/`;
	const pageTitle = 'Things | Jason Raimondi';
	const pageDescription =
		'Projects and things built by Jason Raimondi - software, apps, and experiments.';

	const jsonLdScript =
		'<script type="application/ld+json">' +
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'CollectionPage',
			name: pageTitle,
			description: pageDescription,
			url: pageUrl,
			isPartOf: {
				'@type': 'WebSite',
				name: 'Jason Raimondi',
				url: siteUrl
			}
		}) +
		'</' +
		'script>';

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
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={pageUrl} />

	<!-- OpenGraph -->
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:site_name" content="Jason Raimondi" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />

	<!-- JSON-LD -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD data is trusted -->
	{@html jsonLdScript}
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

	:global([data-theme='dark']) .thing-item time {
		color: var(--color-gray-400);
	}

	:global([data-theme='dark']) .thing-item p {
		color: var(--color-gray-300);
	}
</style>
