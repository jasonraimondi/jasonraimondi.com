# Recap

Batch 10 complete: Blog post dynamic route with prerendering.

# Batch 11: Create Blog List Page

## Task 1: Create posts list loader

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/routes/posts/+page.server.ts`:

```typescript
import { loadPostSummaries } from '$lib/utils/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const posts = await loadPostSummaries();

	return {
		posts
	};
};
```

## Task 2: Create posts list page

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/routes/posts/+page.svelte`:

```svelte
<script lang="ts">
	import Default from '$lib/layouts/Default.svelte';
	
	let { data } = $props();
</script>

<svelte:head>
	<title>Blog Posts | Jason Raimondi</title>
	<meta name="description" content="All blog posts by Jason Raimondi" />
</svelte:head>

<Default>
	<div class="posts-list">
		<h1>Blog Posts</h1>

		{#each data.posts as post}
			<article class="post-summary">
				<h2>
					<a href="/posts/{post.slug}">
						{post.metadata.title}
					</a>
				</h2>
				<time datetime={post.metadata.date}>
					{new Date(post.metadata.date).toLocaleDateString('en-US', {
						year: 'numeric',
						month: 'long',
						day: 'numeric'
					})}
				</time>
				{#if post.metadata.description}
					<p>{post.metadata.description}</p>
				{/if}
				{#if post.metadata.tags}
					<div class="tags">
						{#each post.metadata.tags as tag}
							<span class="tag">{tag}</span>
						{/each}
					</div>
				{/if}
			</article>
		{/each}
	</div>
</Default>
```

## Task 3: Test posts list

```bash
npm run dev
```

Open http://localhost:5173/posts

Expected: See list of all posts (should see test post if you have one)

## Task 4: Commit posts list page

```bash
git add src/routes/posts/+page.server.ts src/routes/posts/+page.svelte
git commit -m "feat: create blog posts list page

- Add server load function for post summaries
- Create posts list template
- Display title, date, description, tags
- Add SEO meta tags"
```

## Batch 11 Complete!

**Next**: Batch 12 - Create Breadcrumbs component
