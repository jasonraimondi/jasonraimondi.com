# Recap

Batch 12 complete: Breadcrumbs component with $derived.

# Batch 13: Create Pagination Component

## Task 1: Create Pagination component

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/components/Pagination.svelte`:

```svelte
<script lang="ts">
	let { currentPage = 1, totalPages = 1, baseUrl = '/posts' } = $props<{
		currentPage?: number;
		totalPages?: number;
		baseUrl?: string;
	}>();

	let pages = $derived(Array.from({ length: totalPages }, (_, i) => i + 1));
	let hasPrev = $derived(currentPage > 1);
	let hasNext = $derived(currentPage < totalPages);
</script>

{#if totalPages > 1}
	<nav class="pagination" aria-label="Pagination">
		{#if hasPrev}
			<a href="{baseUrl}/page/{currentPage - 1}" class="pagination-link">
				← Previous
			</a>
		{/if}

		<div class="pagination-numbers">
			{#each pages as page}
				{#if page === currentPage}
					<span class="pagination-current">{page}</span>
				{:else}
					<a href="{baseUrl}/page/{page}" class="pagination-link">
						{page}
					</a>
				{/if}
			{/each}
		</div>

		{#if hasNext}
			<a href="{baseUrl}/page/{currentPage + 1}" class="pagination-link">
				Next →
			</a>
		{/if}
	</nav>
{/if}
```

## Task 2: Commit Pagination component

```bash
git add src/lib/components/Pagination.svelte
git commit -m "feat: create Pagination component

- Add Pagination with \$derived for page calculations
- Support prev/next navigation
- Configurable base URL
- Accessible with aria-label"
```

## Batch 13 Complete!

**Next**: Batch 14 - Create RelatedPosts component
