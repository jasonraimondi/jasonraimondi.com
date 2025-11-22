# Hugo to SvelteKit Migration Design

## Overview

Migrate jasonraimondi.com from Hugo static site generator to SvelteKit while preserving 100% of existing visual styling, content, and functionality.

## Current State (Hugo)

### Architecture
- **Framework**: Hugo v0.142.0 (Go-based static site generator)
- **Content**: 40+ blog posts in `/content/posts/` (Markdown with YAML frontmatter)
- **Templates**: Go templates in `/layouts/`
- **Styling**: PostCSS with OKLCH colors, dark mode, custom media queries
- **Assets**: Fonts, images, covers in `/static/`
- **Features**: Pagination, breadcrumbs, related posts, syntax highlighting (Pygments), resume PDF generation

### Content Structure
```
content/
├── posts/                    # 40+ blog posts
│   └── 2024-10-18-title/
│       └── index.md          # YAML frontmatter + markdown
├── things/                   # Portfolio projects
├── uses/                     # Uses page
├── resume.json              # JSON Resume format
├── resume.md
├── _index.md                # Home page
├── archives.md
├── books.md
├── repos.md
└── wishlist.md
```

### Styling Architecture
```
assets/css/
├── _base.css                # Global variables
├── _colors.css              # OKLCH color system
├── _typography.css          # Font definitions
├── base/                    # HTML element styles
├── components/              # Component styles
├── content/                 # Content-specific styles
├── layouts/                 # Page layout styles
├── partials/                # Partial component styles
└── lib/                     # normalize.css, Pygments
```

### PostCSS Pipeline
- postcss-import (path resolution)
- postcss-mixins
- postcss-custom-media (6 responsive breakpoints + light/dark)
- postcss-preset-env (stage 2, CSS nesting)
- autoprefixer

### Hugo Shortcodes (to migrate)
- `{{< image >}}` - Image with gallery/popup
- `{{< video >}}` - Video embed
- `{{< tip >}}` - Info/warning boxes
- `{{< tipboard >}}` - Tip container
- `{{< quote >}}` - Block quotes
- `{{< asciinema >}}` - Terminal recordings
- `{{< gist >}}` - GitHub gist embeds

## Target State (SvelteKit)

### Architecture
- **Framework**: SvelteKit 2 + Svelte 5 (runes)
- **Content**: Same markdown files in `/content/posts/` (custom loader)
- **Templates**: Svelte components with runes ($state, $derived, $effect, $props)
- **Styling**: Exact same PostCSS pipeline (OKLCH, dark mode, media queries)
- **Assets**: Same fonts/images in `/static/`
- **Features**: All existing features + potential enhancements

### Directory Structure
```
src/
├── routes/
│   ├── +layout.svelte              # Root layout (global styles)
│   ├── +page.svelte                # Home page
│   ├── +page.server.ts             # Load recent posts
│   ├── posts/
│   │   ├── +page.svelte            # Posts archive
│   │   ├── +page.server.ts         # Load all posts
│   │   └── [slug]/
│   │       ├── +page.ts            # Dynamic post loader
│   │       └── +page.svelte        # Post template
│   ├── things/
│   │   └── +page.svelte            # Portfolio
│   ├── resume/
│   │   └── +page.svelte            # Resume page
│   ├── archives/+page.svelte
│   ├── books/+page.svelte
│   ├── repos/+page.svelte
│   ├── wishlist/+page.svelte
│   ├── uses/+page.svelte
│   ├── rss.xml/+server.ts          # RSS feed
│   └── resume.json/+server.ts      # Resume JSON endpoint
├── lib/
│   ├── components/                 # Svelte components
│   │   ├── Nav.svelte
│   │   ├── Footer.svelte
│   │   ├── Breadcrumbs.svelte
│   │   ├── Pagination.svelte
│   │   ├── RelatedPosts.svelte
│   │   ├── Image.svelte            # From {{< image >}}
│   │   ├── Video.svelte            # From {{< video >}}
│   │   ├── Tip.svelte              # From {{< tip >}}
│   │   ├── Quote.svelte            # From {{< quote >}}
│   │   ├── Asciinema.svelte        # From {{< asciinema >}}
│   │   └── Gist.svelte             # From {{< gist >}}
│   ├── layouts/
│   │   ├── Default.svelte          # Base page layout
│   │   └── BlogPost.svelte         # Blog post layout
│   ├── utils/
│   │   ├── posts.ts                # Content loader utilities
│   │   ├── frontmatter.ts          # YAML parsing
│   │   └── slugify.ts              # Slug generation
│   └── styles/                     # Exact copy of assets/css/
│       ├── _base.css
│       ├── _colors.css
│       ├── _typography.css
│       ├── base/
│       ├── components/
│       ├── content/
│       ├── layouts/
│       ├── partials/
│       ├── lib/
│       └── style.css               # Main entry
├── static/                         # Static assets (served at /)
│   ├── fonts/
│   ├── covers/
│   └── misc/
└── content/                        # Markdown posts (custom location)
    └── posts/                      # Keep Hugo structure
```

### Tech Stack
- **SvelteKit**: v2.x (latest)
- **Svelte**: v5.x (with runes)
- **mdsvex**: Markdown preprocessor for Svelte
- **Shiki**: Syntax highlighting (modern, VS Code themes)
- **PostCSS**: Same plugins as Hugo
- **TypeScript**: v5.x
- **Adapter**: @sveltejs/adapter-cloudflare
- **Deployment**: Cloudflare Workers

### Configuration Files
- `svelte.config.js` - SvelteKit + mdsvex + adapter config
- `mdsvex.config.js` - mdsvex options (extensions, layouts, Shiki)
- `postcss.config.js` - PostCSS plugins (same as Hugo)
- `vite.config.ts` - Vite configuration (if needed)
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencies

## Migration Principles

### 1. Style Preservation (100%)
- **Zero visual changes**: Exact same look and feel
- **Copy, don't rewrite**: Transfer CSS files as-is
- **Same class names**: Maintain HTML structure and classes
- **Same PostCSS config**: Identical pipeline and plugins
- **Same colors**: Keep OKLCH color system
- **Same typography**: Keep fonts and font-face declarations
- **Same breakpoints**: Keep 6 responsive breakpoints
- **Same dark mode**: Keep prefers-color-scheme approach

### 2. Content Preservation (100%)
- **Keep location**: Posts stay in `/content/posts/`
- **Keep frontmatter**: YAML frontmatter unchanged
- **Keep structure**: Date-based folder naming preserved
- **Keep assets**: Images, covers stay in same relative paths
- **Keep metadata**: All post metadata (title, date, tags, categories)

### 3. Feature Parity (100% + enhancements)
- **Core features**: All Hugo features replicated
- **Shortcodes → Components**: Hugo shortcodes become Svelte components
- **Partials → Components**: Hugo partials become Svelte components
- **Data flow**: Server-side data loading with SvelteKit load functions
- **Potential additions**: Client-side search, better TOC, enhanced interactivity

### 4. Modern Patterns (Svelte 5 Runes)
- **$state**: Reactive state (e.g., mobile menu toggle, search query)
- **$derived**: Computed values (e.g., filtered posts, formatted dates)
- **$effect**: Side effects (e.g., TOC generation, scroll tracking)
- **$props**: Component props (replace export let)
- **No legacy syntax**: Use only Svelte 5 runes, not old reactivity

### 5. Performance Goals
- **Comparable build time**: Should match or beat Hugo
- **Comparable bundle size**: Minimal JS overhead
- **Same or better Lighthouse**: Target 95+ scores
- **Prerendering**: All routes prerendered at build time
- **Edge-ready**: Cloudflare Workers for potential dynamic features

## Implementation Strategy

### Phase 1: Foundation (Batches 1-3)
Setup SvelteKit, configure mdsvex, migrate styling infrastructure, create content loader

### Phase 2: Core Structure (Batches 4-7)
Layouts, routing, basic post rendering, list pages

### Phase 3: Components (Batches 8-10)
Convert Hugo shortcodes and partials to Svelte components

### Phase 4: Content & Features (Batches 11-15)
Syntax highlighting, static pages, resume, SEO, RSS

### Phase 5: Migration & Testing (Batches 16-20)
Content migration, asset migration, deployment, validation

## Testing Strategy

### Per-Batch Testing
- **Visual regression**: Compare rendered output to Hugo site
- **Functionality**: Test interactive components work
- **Build validation**: Ensure prerendering succeeds
- **Git commits**: Commit after each successful batch

### Final Validation
- **All posts render**: Verify 40+ posts work correctly
- **All pages exist**: Check all routes accessible
- **All assets load**: Fonts, images, covers
- **All links work**: Internal navigation functional
- **Lighthouse audit**: Performance, accessibility, SEO, best practices
- **Cross-browser**: Test in Chrome, Firefox, Safari
- **Mobile**: Test responsive design
- **Dark mode**: Test theme switching

## Rollback Strategy

### Git-based Safety
- **Feature branch**: Do all work on `sveltekit` branch (already exists)
- **Frequent commits**: Commit after each batch completion
- **Keep Hugo intact**: Don't delete Hugo files until SvelteKit confirmed working
- **Parallel deployment**: Test SvelteKit on staging URL before production

### Batch Checkpoints
- Each batch is independently testable
- Can rollback to previous batch if issues arise
- Progressive validation ensures early error detection

## Success Criteria

1. ✅ All 40+ blog posts render correctly with correct styling
2. ✅ All static pages (resume, books, repos, etc.) functional
3. ✅ All images and assets load correctly
4. ✅ Syntax highlighting works on all code blocks
5. ✅ Dark mode toggles correctly (prefers-color-scheme)
6. ✅ Mobile responsive (all breakpoints work)
7. ✅ Navigation, breadcrumbs, pagination functional
8. ✅ Related posts display correctly
9. ✅ RSS feed generates correctly
10. ✅ Resume PDF generation works
11. ✅ Lighthouse scores: Performance 95+, Accessibility 100, SEO 100
12. ✅ Cloudflare deployment successful
13. ✅ Analytics (Plausible) tracking works
14. ✅ Build time comparable to Hugo
15. ✅ Zero visual differences from Hugo site

## Timeline Estimate

- **Phase 1**: 2-4 hours (setup, styling, content loader)
- **Phase 2**: 3-5 hours (layouts, routing, basic rendering)
- **Phase 3**: 2-3 hours (component migration)
- **Phase 4**: 3-4 hours (features, SEO, RSS)
- **Phase 5**: 2-3 hours (migration, testing, deployment)

**Total**: 12-19 hours of focused implementation

## Dependencies

### npm Packages (to install)
```json
{
  "dependencies": {
    "@sveltejs/kit": "^2.x",
    "svelte": "^5.x"
  },
  "devDependencies": {
    "@sveltejs/adapter-cloudflare": "^4.x",
    "@sveltejs/vite-plugin-svelte": "^4.x",
    "mdsvex": "^0.12.x",
    "shiki": "^1.x",
    "postcss": "^8.x",
    "postcss-import": "^16.x",
    "postcss-mixins": "^11.x",
    "postcss-custom-media": "^11.x",
    "postcss-preset-env": "^10.x",
    "autoprefixer": "^10.x",
    "typescript": "^5.x",
    "vite": "^6.x",
    "playwright": "^1.x"
  }
}
```

## Risk Mitigation

### Risk: Content loader complexity
**Mitigation**: Test with subset of posts first, build utilities incrementally

### Risk: Styling differences
**Mitigation**: Side-by-side visual comparison, copy CSS exactly as-is

### Risk: Frontmatter compatibility
**Mitigation**: Validate YAML parsing early, test with real post samples

### Risk: Shiki vs Pygments visual differences
**Mitigation**: Configure Shiki theme to match, keep existing code CSS

### Risk: Build performance
**Mitigation**: Measure early, optimize imports, use vite plugins

### Risk: Deployment issues
**Mitigation**: Test Cloudflare adapter locally, validate wrangler config

## Open Questions

1. Should we keep the same URL structure for posts? (Yes, for SEO)
2. Should we add client-side search? (Optional enhancement)
3. Should we keep analytics on Plausible? (Yes)
4. Should we add view transitions? (Optional, Svelte 5 feature)
5. Should we add reading time? (Optional enhancement)

## References

- [SvelteKit Docs](https://kit.svelte.dev/)
- [Svelte 5 Runes](https://svelte.dev/docs/svelte/what-are-runes)
- [mdsvex Docs](https://mdsvex.pngwn.io/)
- [Shiki Docs](https://shiki.style/)
- [Josh Collinsworth - Build Static SvelteKit Markdown Blog](https://joshcollinsworth.com/blog/build-static-sveltekit-markdown-blog)
- [Joy of Code - SvelteKit Markdown Blog](https://joyofcode.xyz/sveltekit-markdown-blog)
