# Recap

Batch 9 complete: Footer component created with $derived rune.

# Batch 10: Create Blog Post Dynamic Route

## Task 1: Create blog post page loader

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/routes/posts/[slug]/+page.ts`:

```typescript
import { error } from '@sveltejs/kit';
import { loadPost } from '$lib/utils/posts';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params }) => {
	const post = await loadPost(params.slug);

	if (!post) {
		throw error(404, 'Post not found');
	}

	return {
		post
	};
};

// Enable prerendering for all blog posts
export const prerender = true;
```

## Task 2: Create blog post layout component

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/layouts/BlogPost.svelte`:

```svelte
<script lang="ts">
	import type { PostMetadata } from '$lib/types/post';

	let { metadata, children } = $props<{
		metadata: PostMetadata;
		children: any;
	}>();

	// Format date using $derived
	let formattedDate = $derived(
		new Date(metadata.date).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'long',
			day: 'numeric'
		})
	);
</script>

<article class="blog-post">
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

## Task 3: Create blog post template page

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/routes/posts/[slug]/+page.svelte`:

```svelte
<script lang="ts">
	import { SvelteComponent } from 'svelte';
	import Default from '$lib/layouts/Default.svelte';
	import BlogPost from '$lib/layouts/BlogPost.svelte';
	
	let { data } = $props();
</script>

<svelte:head>
	<title>{data.post.metadata.title} | Jason Raimondi</title>
	{#if data.post.metadata.description}
		<meta name="description" content={data.post.metadata.description} />
	{/if}
</svelte:head>

<Default>
	<BlogPost metadata={data.post.metadata}>
		{@html data.post.content}
	</BlogPost>
</Default>
```

## Task 4: Create entries for prerendering

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/routes/posts/[slug]/+page.server.ts`:

```typescript
import { getAllPostSlugs } from '$lib/utils/posts';

export async function entries() {
	const slugs = await getAllPostSlugs();
	return slugs.map((slug) => ({ slug }));
}
```

## Task 5: Commit blog post route

```bash
git add src/routes/posts/
git add src/lib/layouts/BlogPost.svelte
git commit -m "feat: create blog post dynamic route

- Add [slug] route with page loader
- Create BlogPost layout component with \$derived
- Add SEO meta tags
- Configure prerendering with entries()
- Support Hugo frontmatter structure"
```

## Batch 10 Complete!

**Next**: Batch 11 - Create blog list/archive page
