# Recap

Batch 5 complete: Content loader created with frontmatter parsing and post utilities.

# Batch 6: Create Root Layout with Global Styles

## Task 1: Update root layout

### Files
- Modify: `src/routes/+layout.svelte`

### Step 1: Edit root layout

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/src/routes/+layout.svelte`:

```svelte
<script lang="ts">
	import '$lib/styles/style.css';
</script>

<svelte:head>
	<meta charset="utf-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1" />
</svelte:head>

<slot />
```

### Step 2: Test layout

```bash
npm run dev
```

Open http://localhost:5173/

Expected: Page loads with global styles applied

### Step 3: Stop dev server

Press Ctrl+C

### Step 4: Commit root layout

```bash
git add src/routes/+layout.svelte
git commit -m "feat: configure root layout with global styles

- Import global CSS (style.css)
- Add meta tags for charset and viewport
- Foundation for all pages"
```

---

## Batch 6 Complete!

**Next**: Batch 7 - Create base page layout component
