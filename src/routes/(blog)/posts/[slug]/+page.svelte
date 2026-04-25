<script lang="ts">
	import type { Post } from '$lib/data/types';
	import type { Component } from 'svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ArchivedBanner from '$lib/components/ArchivedBanner.svelte';
	import EditOnGitHub from '$lib/components/EditOnGitHub.svelte';

	interface Props {
		data: {
			content: Component;
			metadata: Post;
		};
	}

	let { data }: Props = $props();

	const siteUrl = 'https://jasonraimondi.com';
	const pageUrl = $derived(`${siteUrl}/posts/${data.metadata.slug}/`);
	const imageUrl = $derived(
		data.metadata.images?.[0]
			? data.metadata.images[0].startsWith('http')
				? data.metadata.images[0]
				: `${siteUrl}${data.metadata.images[0]}`
			: null
	);

	function formatDate(dateString: string): string {
		const date = new Date(dateString);
		return date.toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		});
	}

	function formatISODate(dateString: string): string {
		return new Date(dateString).toISOString();
	}

	const breadcrumbItems = $derived([
		{ label: 'Posts', href: '/posts/' },
		{ label: data.metadata.title }
	]);

	const jsonLdScript = $derived(
		'<script type="application/ld+json">' +
			JSON.stringify({
				'@context': 'https://schema.org',
				'@type': 'BlogPosting',
				headline: data.metadata.title,
				description: data.metadata.description,
				url: pageUrl,
				datePublished: formatISODate(data.metadata.date),
				dateModified: data.metadata.lastmod
					? formatISODate(data.metadata.lastmod)
					: formatISODate(data.metadata.date),
				author: {
					'@type': 'Person',
					name: 'Jason Raimondi',
					url: siteUrl
				},
				publisher: {
					'@type': 'Person',
					name: 'Jason Raimondi',
					url: siteUrl
				},
				...(imageUrl && { image: imageUrl }),
				...(data.metadata.tags?.length && { keywords: data.metadata.tags.join(', ') }),
				mainEntityOfPage: {
					'@type': 'WebPage',
					'@id': pageUrl
				}
			}) +
			'</' +
			'script>'
	);
</script>

<svelte:head>
	<title>{data.metadata.title} | Jason Raimondi</title>
	<meta name="description" content={data.metadata.description} />
	<link rel="canonical" href={pageUrl} />

	<!-- OpenGraph -->
	<meta property="og:title" content={data.metadata.title} />
	<meta property="og:description" content={data.metadata.description} />
	<meta property="og:type" content="article" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:site_name" content="Jason Raimondi" />
	<meta property="article:published_time" content={formatISODate(data.metadata.date)} />
	{#if data.metadata.lastmod}
		<meta property="article:modified_time" content={formatISODate(data.metadata.lastmod)} />
	{/if}
	{#if imageUrl}
		<meta property="og:image" content={imageUrl} />
	{/if}

	<!-- Twitter Card -->
	<meta name="twitter:card" content={imageUrl ? 'summary_large_image' : 'summary'} />
	<meta name="twitter:title" content={data.metadata.title} />
	<meta name="twitter:description" content={data.metadata.description} />
	{#if imageUrl}
		<meta name="twitter:image" content={imageUrl} />
	{/if}

	<!-- JSON-LD -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD data is trusted -->
	{@html jsonLdScript}
</svelte:head>

<Breadcrumbs items={breadcrumbItems} />

{#if data.metadata.archived}
	<ArchivedBanner />
{/if}

<article class="single" itemscope itemtype="http://schema.org/BlogPosting">
	<header class="single--header">
		<h1 class="single--title" itemprop="name headline">
			{data.metadata.title}
			<div class="hidden" itemprop="author" itemscope itemtype="http://schema.org/Person">
				<span itemprop="name">Jason Raimondi</span>
			</div>
		</h1>
	</header>

	<section class="single--post">
		<section class="single--post--block1">
			{#if data.metadata.categories?.length || data.metadata.tags?.length}
				<ul class="single--post--tags">
					{#each data.metadata.categories ?? [] as category (category)}
						<li><span class="label inline">{category}</span></li>
					{/each}
					{#each data.metadata.tags ?? [] as tag (tag)}
						<li><span class="label">{tag}</span></li>
					{/each}
				</ul>
			{/if}
			<EditOnGitHub filePath="posts/{data.metadata.slug}.svx" />
		</section>

		<section>
			<p class="single--date">
				Published:
				<time datetime={data.metadata.date} itemprop="datePublished">
					{formatDate(data.metadata.date)}
				</time>
			</p>
		</section>

		<article class="single--post-body" itemprop="articleBody">
			<data.content />
		</article>
	</section>
</article>

<style>
	.hidden {
		display: none;
	}
</style>
