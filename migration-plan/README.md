# Hugo to SvelteKit Migration Plan

This directory contains a comprehensive, step-by-step migration plan for converting jasonraimondi.com from Hugo to SvelteKit.

## Plan Structure

### Core Documents

- **[design.md](./design.md)** - Complete design document covering current state, target state, architecture, and strategy
- **[plan.md](./plan.md)** - Master implementation plan with all 29 batches listed in order

### Detailed Implementation Batches (1-13)

These batches provide complete, step-by-step instructions with commands, expected output, and git commits:

**Foundation & Setup (1-5)**
- [batch-1.md](./batch-1.md) - Initialize SvelteKit project with TypeScript
- [batch-2.md](./batch-2.md) - Configure mdsvex with Shiki syntax highlighting
- [batch-3.md](./batch-3.md) - Set up PostCSS pipeline (exact Hugo configuration)
- [batch-4.md](./batch-4.md) - Migrate CSS files (100% style preservation)
- [batch-5.md](./batch-5.md) - Create content loader for markdown posts

**Core Structure (6-10)**
- [batch-6.md](./batch-6.md) - Create root layout with global styles
- [batch-7.md](./batch-7.md) - Create base page layout component
- [batch-8.md](./batch-8.md) - Create Nav component with mobile menu ($state)
- [batch-9.md](./batch-9.md) - Create Footer component ($derived)
- [batch-10.md](./batch-10.md) - Create blog post dynamic route

**Blog Functionality (11-13)**
- [batch-11.md](./batch-11.md) - Create blog list/archive page
- [batch-12.md](./batch-12.md) - Create Breadcrumbs component ($derived)
- [batch-13.md](./batch-13.md) - Create Pagination component

### Remaining Batches (14-29)

**[batch-14-to-29-summary.md](./batch-14-to-29-summary.md)** contains summaries for:

**Components (14-18)**
- Batch 14: RelatedPosts component
- Batch 15: Image component
- Batch 16: Video component
- Batch 17: Tip & TipBoard components
- Batch 18: Quote, Asciinema, Gist components

**Pages & Features (19-23)**
- Batch 19: Home page
- Batch 20: Static pages (things, books, repos, archives, uses, wishlist)
- Batch 21: Resume system with JSON endpoint
- Batch 22: SEO & meta tags
- Batch 23: RSS feed

**Migration & Deployment (24-29)**
- Batch 24: Content migration (40+ posts)
- Batch 25: Static assets migration
- Batch 26: Cloudflare deployment setup
- Batch 27: Analytics integration
- Batch 28: Final testing & Lighthouse audit
- Batch 29: Deployment workflow

## How to Use This Plan

### For Implementation

1. **Start with design.md** - Understand the full scope and architecture
2. **Review plan.md** - See the complete batch sequence
3. **Execute batches in order** - Each batch builds on the previous one
4. **Follow the pattern** - Batches 1-13 establish the implementation pattern
5. **Expand remaining batches** - Use batches 1-13 as templates for 14-29

### Implementation Pattern (from batches 1-13)

Each batch follows this structure:
```
# Recap - What was completed in previous batch

# Batch N: Title

## Task 1: Description
### Files - What will be created/modified
### Step 1: Action with command
### Step 2: Verify with expected output
### Step 3: Commit

## Task 2: Next task
[... continue ...]

## Batch N Complete!
- Verification checklist
- Next batch reference
```

### Key Principles

- **DRY** (Don't Repeat Yourself) - Reuse utilities and components
- **YAGNI** (You Aren't Gonna Need It) - Build only what's specified
- **TDD** (Test-Driven Development) - Test after each significant change
- **Frequent commits** - Commit after each completed task
- **Incremental** - Each batch must work before moving to next
- **Style preservation** - CSS copied exactly, zero visual changes

### Testing After Each Batch

```bash
# Development server
npm run dev

# Build test
npm run build

# Preview build
npm run preview

# Verification
# - Open browser to test
# - Check console for errors
# - Verify expected behavior
```

### Git Workflow

```bash
# After each task completion
git add [files]
git commit -m "feat/fix: descriptive message"

# At end of each batch
git status # Verify clean state
```

## Migration Timeline

Based on 2-5 minute tasks:

- **Phase 1** (Batches 1-5): 2-4 hours - Foundation
- **Phase 2** (Batches 6-13): 3-5 hours - Core structure
- **Phase 3** (Batches 14-23): 4-6 hours - Components & features
- **Phase 4** (Batches 24-29): 2-3 hours - Migration & deployment

**Total**: 12-19 hours of focused implementation

## Success Criteria

✅ All 40+ blog posts render correctly with exact Hugo styling
✅ All static pages functional
✅ Dark mode works via prefers-color-scheme
✅ Mobile responsive at all 6 breakpoints
✅ Lighthouse: 95+ performance, 100 accessibility, 100 SEO
✅ Cloudflare deployment successful
✅ Analytics tracking functional
✅ Zero visual differences from Hugo site

## Tech Stack

- **SvelteKit 2** - Modern meta-framework
- **Svelte 5** - Using runes ($state, $derived, $effect, $props)
- **mdsvex** - Markdown preprocessor
- **Shiki** - Syntax highlighting
- **PostCSS** - CSS processing (matching Hugo)
- **TypeScript** - Type safety
- **Cloudflare Workers** - Deployment target

## Resources

- [SvelteKit Docs](https://kit.svelte.dev/)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)
- [mdsvex Docs](https://mdsvex.pngwn.io/)
- [Shiki Docs](https://shiki.style/)

## Notes

- **Hugo files remain intact** during migration (work in parallel)
- **Content stays in `/content/posts/`** (custom loader)
- **CSS structure preserved** exactly from `assets/css/` → `src/lib/styles/`
- **All shortcodes** become Svelte components
- **Svelte 5 only** - No legacy syntax, only runes

---

**Ready to begin?** Start with [batch-1.md](./batch-1.md)!
