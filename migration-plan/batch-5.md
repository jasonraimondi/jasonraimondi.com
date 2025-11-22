# Recap

Batch 4 complete: All CSS files migrated from Hugo to SvelteKit with exact structure preservation.

# Batch 5: Create Content Loader for Markdown Posts

## Task 1: Install frontmatter parser

### Files
- Modify: `package.json`

### Step 1: Install gray-matter for YAML frontmatter parsing

```bash
npm install gray-matter
```

Expected output:
```
added 1 package
```

### Step 2: Commit dependency

```bash
git add package.json package-lock.json
git commit -m "feat: install gray-matter for frontmatter parsing

- Add gray-matter for YAML frontmatter extraction
- Will use to parse markdown post metadata"
```

---

## Task 2: Create post type definitions

### Files
- Create: `src/lib/types/post.ts`

### Step 1: Create types directory

```bash
mkdir -p src/lib/types
```

### Step 2: Create post type definition

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/types/post.ts`:

```typescript
/**
 * Blog post frontmatter metadata
 * Matches Hugo YAML frontmatter structure
 */
export interface PostMetadata {
	title: string;
	slug?: string;
	date: string;
	description?: string;
	categories?: string[];
	tags?: string[];
	draft?: boolean;
	toc?: boolean;
	archived?: boolean;
}

/**
 * Full post with metadata and content
 */
export interface Post {
	metadata: PostMetadata;
	slug: string;
	content: string;
}

/**
 * Post summary for list pages (no content)
 */
export interface PostSummary {
	metadata: PostMetadata;
	slug: string;
	path: string;
}
```

### Step 3: Commit type definitions

```bash
git add src/lib/types/post.ts
git commit -m "feat: create post type definitions

- Add PostMetadata interface matching Hugo frontmatter
- Add Post interface for full post data
- Add PostSummary interface for list pages
- TypeScript types for type-safe post handling"
```

---

## Task 3: Create slug utility

### Files
- Create: `src/lib/utils/slugify.ts`

### Step 1: Create utils directory

```bash
mkdir -p src/lib/utils
```

### Step 2: Create slugify utility

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/utils/slugify.ts`:

```typescript
/**
 * Extract slug from file path
 *
 * Examples:
 * - "/content/posts/2024-10-18-my-post/index.md" → "2024-10-18-my-post"
 * - "/content/posts/hello-world.md" → "hello-world"
 */
export function extractSlugFromPath(path: string): string {
	// Remove file extension
	const withoutExt = path.replace(/\.(md|svx)$/, '');

	// Get the last segment (folder name or filename)
	const segments = withoutExt.split('/');
	let slug = segments[segments.length - 1];

	// If it's "index", use the parent folder name
	if (slug === 'index' && segments.length > 1) {
		slug = segments[segments.length - 2];
	}

	return slug;
}

/**
 * Generate URL-safe slug from string
 */
export function slugify(text: string): string {
	return text
		.toLowerCase()
		.replace(/[^\w\s-]/g, '') // Remove special chars
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-') // Remove duplicate hyphens
		.trim();
}
```

### Step 3: Commit slug utilities

```bash
git add src/lib/utils/slugify.ts
git commit -m "feat: create slug utilities

- Add extractSlugFromPath for Hugo post path parsing
- Add slugify for URL-safe slug generation
- Support both folder/index.md and direct .md files"
```

---

## Task 4: Create post loader utility

### Files
- Create: `src/lib/utils/posts.ts`

### Step 1: Create posts loader

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/utils/posts.ts`:

```typescript
import matter from 'gray-matter';
import { extractSlugFromPath } from './slugify';
import type { Post, PostMetadata, PostSummary } from '$lib/types/post';

/**
 * Load all markdown posts from /content/posts/
 * Returns array of post summaries (no content)
 */
export async function loadPostSummaries(): Promise<PostSummary[]> {
	// Import all .md files from content/posts/
	const modules = import.meta.glob('/content/posts/**/*.md', {
		eager: false,
		query: '?raw',
		import: 'default'
	});

	const posts: PostSummary[] = [];

	for (const [path, resolver] of Object.entries(modules)) {
		try {
			const raw = (await resolver()) as string;
			const { data } = matter(raw);
			const metadata = data as PostMetadata;

			// Use slug from frontmatter or extract from path
			const slug = metadata.slug || extractSlugFromPath(path);

			// Skip drafts in production
			if (metadata.draft && import.meta.env.PROD) {
				continue;
			}

			posts.push({
				metadata,
				slug,
				path
			});
		} catch (error) {
			console.error(`Error loading post: ${path}`, error);
		}
	}

	// Sort by date (newest first)
	posts.sort((a, b) => {
		const dateA = new Date(a.metadata.date).getTime();
		const dateB = new Date(b.metadata.date).getTime();
		return dateB - dateA;
	});

	return posts;
}

/**
 * Load a single post by slug (with full content)
 */
export async function loadPost(slug: string): Promise<Post | null> {
	const modules = import.meta.glob('/content/posts/**/*.md', {
		eager: false,
		query: '?raw',
		import: 'default'
	});

	for (const [path, resolver] of Object.entries(modules)) {
		const pathSlug = extractSlugFromPath(path);

		if (pathSlug === slug) {
			try {
				const raw = (await resolver()) as string;
				const { data, content } = matter(raw);
				const metadata = data as PostMetadata;

				return {
					metadata,
					slug: metadata.slug || slug,
					content
				};
			} catch (error) {
				console.error(`Error loading post: ${path}`, error);
				return null;
			}
		}
	}

	return null;
}

/**
 * Get all post slugs (for prerendering)
 */
export async function getAllPostSlugs(): Promise<string[]> {
	const summaries = await loadPostSummaries();
	return summaries.map((s) => s.slug);
}
```

### Step 2: Commit posts utility

```bash
git add src/lib/utils/posts.ts
git commit -m "feat: create post loader utilities

- Add loadPostSummaries for listing posts
- Add loadPost for single post with content
- Add getAllPostSlugs for prerendering
- Use gray-matter for frontmatter parsing
- Support Hugo post structure (folder/index.md)
- Filter drafts in production
- Sort posts by date (newest first)"
```

---

## Task 5: Test content loader with sample post

### Files
- Create: `content/posts/test-post/index.md` (temporary)

### Step 1: Create test post

```bash
mkdir -p content/posts/test-post
```

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/content/posts/test-post/index.md`:

```markdown
---
title: "Test Post for Content Loader"
slug: "test-post"
date: 2024-01-01T10:00:00-08:00
description: "Testing the content loader"
categories:
  - testing
tags:
  - test
  - migration
---

# Hello from Test Post

This is a **test post** to verify the content loader works.

## Code Block Test

\`\`\`javascript
function test() {
  console.log('Content loader works!');
}
\`\`\`

## List Test

- Item 1
- Item 2
- Item 3
```

### Step 2: Create test route to verify loader

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/routes/test-loader/+page.server.ts`:

```typescript
import { loadPostSummaries, loadPost } from '$lib/utils/posts';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async () => {
	const summaries = await loadPostSummaries();
	const testPost = await loadPost('test-post');

	return {
		summaries,
		testPost
	};
};
```

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/routes/test-loader/+page.svelte`:

```svelte
<script lang="ts">
	let { data } = $props();
</script>

<h1>Content Loader Test</h1>

<h2>Post Summaries ({data.summaries.length})</h2>
<ul>
	{#each data.summaries as post}
		<li>
			<strong>{post.metadata.title}</strong>
			<br />
			Slug: {post.slug}
			<br />
			Date: {post.metadata.date}
		</li>
	{/each}
</ul>

<h2>Single Post Test</h2>
{#if data.testPost}
	<p>Title: {data.testPost.metadata.title}</p>
	<p>Slug: {data.testPost.slug}</p>
	<p>Content length: {data.testPost.content.length} characters</p>
	<details>
		<summary>Show content</summary>
		<pre>{data.testPost.content}</pre>
	</details>
{:else}
	<p>Test post not found</p>
{/if}
```

### Step 3: Test loader

```bash
npm run dev
```

Expected: Dev server starts

### Step 4: Open test page

Open http://localhost:5173/test-loader

Expected output:
- See "Post Summaries (1)"
- See test post title, slug, date
- See single post data with content length
- Can expand to see markdown content

### Step 5: Stop dev server

Press Ctrl+C

### Step 6: Clean up test files

```bash
rm -rf content/posts/test-post/
rm -rf src/routes/test-loader/
```

### Step 7: Commit content loader verification

```bash
git add .
git commit -m "test: verify content loader works

- Create test post in Hugo structure
- Create test route to load posts
- Verify loadPostSummaries works
- Verify loadPost works
- Clean up test files"
```

---

## Task 6: Handle Vite glob imports configuration

### Files
- Create: `vite.config.ts` (update if exists)

### Step 1: Check if vite.config.ts needs updating

```bash
cat vite.config.ts
```

### Step 2: Update vite.config.ts if needed

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/vite.config.ts`:

```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],

	server: {
		fs: {
			// Allow serving files from content directory
			allow: ['content']
		}
	}
});
```

### Step 3: Commit vite config

```bash
git add vite.config.ts
git commit -m "feat: configure Vite to allow content directory

- Add content/ to Vite fs.allow
- Enables import.meta.glob to read /content/posts/**/*.md"
```

---

## Batch 5 Complete!

**Verification checklist:**
- [ ] gray-matter installed for frontmatter parsing
- [ ] Post type definitions created (TypeScript)
- [ ] Slug utilities created and tested
- [ ] Post loader utilities created (loadPostSummaries, loadPost, getAllPostSlugs)
- [ ] Content loader tested with sample post
- [ ] Vite configured to allow content directory access
- [ ] All changes committed to git

**Created utilities:**
- `src/lib/types/post.ts` - TypeScript interfaces
- `src/lib/utils/slugify.ts` - Slug extraction and generation
- `src/lib/utils/posts.ts` - Post loading functions

**Next**: Batch 6 - Create root layout with global styles
