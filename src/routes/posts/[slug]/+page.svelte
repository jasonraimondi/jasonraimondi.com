<script lang="ts">
	import type { Post } from '$lib/data/types';
	import type { Component } from 'svelte';
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import ArchivedBanner from '$lib/components/ArchivedBanner.svelte';

	interface Props {
		data: {
			content: Component;
			metadata: Post;
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

	const breadcrumbItems = $derived([
		{ label: 'Posts', href: '/posts/' },
		{ label: data.metadata.title }
	]);
</script>

<svelte:head>
	<title>{data.metadata.title} | Jason Raimondi</title>
	<meta name="description" content={data.metadata.description} />
	<meta property="og:title" content={data.metadata.title} />
	<meta property="og:description" content={data.metadata.description} />
	<meta property="og:type" content="article" />
	{#if data.metadata.images?.[0]}
		<meta property="og:image" content={data.metadata.images[0]} />
	{/if}
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={data.metadata.title} />
	<meta name="twitter:description" content={data.metadata.description} />
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
