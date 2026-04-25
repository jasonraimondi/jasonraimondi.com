<script lang="ts">
	import { base } from '$app/paths';
	import type { Post } from '$lib/data/types';

	interface Props {
		data: {
			posts: Post[];
		};
	}

	let { data }: Props = $props();

	const siteUrl = 'https://jasonraimondi.com';
	const pageUrl = `${siteUrl}/posts/`;
	const pageTitle = 'Posts | Jason Raimondi';
	const pageDescription =
		'Blog posts by Jason Raimondi on software engineering, web development, and technology.';

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

<section class="posts-list">
	<h1>Posts</h1>

	{#if data.posts.length === 0}
		<p>No posts yet.</p>
	{:else}
		<ul class="post-items">
			{#each data.posts as post (post.slug)}
				<li class="post-item">
					<article>
						<h2>
							<a href="{base}/posts/{post.slug}/">{post.title}</a>
						</h2>
						<time datetime={post.date}>{formatDate(post.date)}</time>
						{#if post.description}
							<p>{post.description}</p>
						{/if}
						{#if post.archived}
							<span class="archived-badge">Archived</span>
						{/if}
					</article>
				</li>
			{/each}
		</ul>
	{/if}
</section>

<style>
	.posts-list h1 {
		margin-bottom: 2rem;
	}

	.post-items {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	.post-item {
		margin-bottom: 2rem;
	}

	.post-item h2 {
		margin: 0 0 0.5rem;
		font-size: 1.5rem;
	}

	.post-item h2 a {
		text-decoration: none;
	}

	.post-item h2 a:hover {
		text-decoration: underline;
	}

	.post-item time {
		display: block;
		color: var(--color-gray-600);
		font-size: 0.875rem;
		margin-bottom: 0.5rem;
	}

	.post-item p {
		margin: 0;
		color: var(--color-gray-700);
	}

	.archived-badge {
		display: inline-block;
		margin-top: 0.5rem;
		padding: 0.25rem 0.5rem;
		background-color: var(--color-gray-200);
		color: var(--color-gray-700);
		font-size: 0.75rem;
		border-radius: 0.25rem;
	}

	:global([data-theme='dark']) .post-item time {
		color: var(--color-gray-400);
	}

	:global([data-theme='dark']) .post-item p {
		color: var(--color-gray-300);
	}

	:global([data-theme='dark']) .archived-badge {
		background-color: var(--color-gray-700);
		color: var(--color-gray-300);
	}
</style>
