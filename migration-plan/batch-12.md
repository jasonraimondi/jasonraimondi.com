# Recap

Batch 11 complete: Blog posts list page created.

# Batch 12: Create Breadcrumbs Component

## Task 1: Create Breadcrumbs component with $derived

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/components/Breadcrumbs.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/stores';

	// Generate breadcrumb segments from URL using $derived
	let segments = $derived(() => {
		const path = $page.url.pathname;
		const parts = path.split('/').filter(Boolean);
		
		return parts.map((part, index) => {
			const href = '/' + parts.slice(0, index + 1).join('/');
			const label = part
				.split('-')
				.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
				.join(' ');
			
			return { href, label };
		});
	});
</script>

{#if segments.length > 0}
	<nav class="breadcrumbs" aria-label="Breadcrumb">
		<ol>
			<li><a href="/">Home</a></li>
			{#each segments as segment, index}
				<li>
					{#if index === segments.length - 1}
						<span aria-current="page">{segment.label}</span>
					{:else}
						<a href={segment.href}>{segment.label}</a>
					{/if}
				</li>
			{/each}
		</ol>
	</nav>
{/if}
```

## Task 2: Add Breadcrumbs to BlogPost layout

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/layouts/BlogPost.svelte`:

```svelte
<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import type { PostMetadata } from '$lib/types/post';

	let { metadata, children } = $props<{
		metadata: PostMetadata;
		children: any;
	}>();

	let formattedDate = $derived(
		new Date(metadata.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<article class="blog-post">
	<Breadcrumbs />
	
	<header class="post-header">
		<h1>{metadata.title}</h1>
		<time datetime={metadata.date}>{formattedDate}</time>
		{#if metadata.description}
			<p class="post-description">{metadata.description}</p>
		{/if}
	</header>

	<div class="post-content">
		{@render children()}
	</div>

	{#if metadata.tags && metadata.tags.length > 0}
		<footer class="post-footer">
			<div class="tags">
				{#each metadata.tags as tag}
					<a href="/tags/{tag}" class="tag">{tag}</a>
				{/each}
			</div>
		</footer>
	{/if}
</article>
```

## Task 3: Commit Breadcrumbs component

```bash
git add src/lib/components/Breadcrumbs.svelte src/lib/layouts/BlogPost.svelte
git commit -m "feat: create Breadcrumbs component

- Add Breadcrumbs with \$derived for path segments
- Auto-generate breadcrumbs from URL
- Include in BlogPost layout
- Accessible with aria-label"
```

## Batch 12 Complete!

**Next**: Batch 13 - Create Pagination component
