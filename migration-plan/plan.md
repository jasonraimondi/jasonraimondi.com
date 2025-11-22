# Hugo to SvelteKit Migration Implementation Plan

## Goal

Migrate jasonraimondi.com from Hugo to SvelteKit while preserving 100% of existing visual styling, content, and functionality.

## Architecture

This migration transforms a Hugo-based blog into a modern SvelteKit application using Svelte 5 runes for reactivity. Content stays in `/content/posts/` with a custom loader, styling is copied exactly from Hugo's PostCSS setup, and all Hugo shortcodes become Svelte components. The site will be statically prerendered and deployed to Cloudflare Workers.

## Tech Stack

- **SvelteKit 2** - Modern meta-framework for Svelte
- **Svelte 5** - Component framework with runes ($state, $derived, $effect, $props)
- **mdsvex** - Markdown preprocessor for Svelte (MDX equivalent)
- **Shiki** - Syntax highlighting (replacing Pygments)
- **PostCSS** - CSS processing (same pipeline as Hugo)
- **TypeScript** - Type safety
- **@sveltejs/adapter-cloudflare** - Cloudflare Workers deployment
- **Playwright** - Resume PDF generation

## Task Batches

Implement in this exact order. Each batch builds on the previous one.

### Foundation & Setup
- [batch-1.md](./batch-1.md) - Initialize SvelteKit project with TypeScript
- [batch-2.md](./batch-2.md) - Configure mdsvex with Shiki syntax highlighting
- [batch-3.md](./batch-3.md) - Set up PostCSS pipeline (exact Hugo configuration)
- [batch-4.md](./batch-4.md) - Migrate CSS files from Hugo to SvelteKit
- [batch-5.md](./batch-5.md) - Create content loader for `/content/posts/` markdown files

### Core Structure
- [batch-6.md](./batch-6.md) - Create root layout with global styles
- [batch-7.md](./batch-7.md) - Create base page layout component
- [batch-8.md](./batch-8.md) - Create Nav component with mobile menu (using $state)
- [batch-9.md](./batch-9.md) - Create Footer component
- [batch-10.md](./batch-10.md) - Create blog post dynamic route and template

### Blog Functionality
- [batch-11.md](./batch-11.md) - Create blog list/archive page
- [batch-12.md](./batch-12.md) - Create Breadcrumbs component (using $derived)
- [batch-13.md](./batch-13.md) - Create Pagination component
- [batch-14.md](./batch-14.md) - Create RelatedPosts component (using $derived)

### Shortcode Migration (Components)
- [batch-15.md](./batch-15.md) - Create Image component (from {{< image >}})
- [batch-16.md](./batch-16.md) - Create Video component (from {{< video >}})
- [batch-17.md](./batch-17.md) - Create Tip and TipBoard components (from {{< tip >}})
- [batch-18.md](./batch-18.md) - Create Quote, Asciinema, Gist components

### Static Pages & Features
- [batch-19.md](./batch-19.md) - Create home page
- [batch-20.md](./batch-20.md) - Create static pages (things, books, repos, archives, uses, wishlist)
- [batch-21.md](./batch-21.md) - Create resume page with JSON endpoint
- [batch-22.md](./batch-22.md) - Add SEO meta tags and Schema.org markup
- [batch-23.md](./batch-23.md) - Create RSS feed endpoint

### Content & Assets Migration
- [batch-24.md](./batch-24.md) - Copy and validate all markdown posts
- [batch-25.md](./batch-25.md) - Copy static assets (fonts, images, covers)

### Deployment & Validation
- [batch-26.md](./batch-26.md) - Configure Cloudflare adapter and deployment
- [batch-27.md](./batch-27.md) - Add analytics (Plausible)
- [batch-28.md](./batch-28.md) - Final testing and Lighthouse audit
- [batch-29.md](./batch-29.md) - Create deployment workflow

## Testing Strategy

Each batch includes:
1. Clear steps with expected output
2. Validation commands to verify success
3. Visual/functional testing where applicable
4. Git commit at batch completion

Final validation (Batch 28):
- All 40+ posts render correctly
- All styling matches Hugo exactly
- All features functional
- Lighthouse scores: 95+ performance, 100 accessibility, 100 SEO
- Mobile responsive, dark mode works

## Success Criteria

- ✅ Zero visual differences from Hugo site
- ✅ All content migrated and rendering correctly
- ✅ All features working (navigation, pagination, related posts, etc.)
- ✅ Lighthouse scores meet targets
- ✅ Deployment to Cloudflare successful
- ✅ Analytics tracking functional

## Implementation Notes

- **Work on `sveltekit` branch** (already exists)
- **Commit after each batch**
- **Test incrementally** - don't move to next batch until current works
- **Keep Hugo intact** - don't delete Hugo files during migration
- **Visual comparison** - compare SvelteKit output to Hugo output regularly
- **DRY, YAGNI, TDD** - Follow best practices throughout