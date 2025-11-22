# Remaining Batches Summary (14-29)

Due to the length of creating all individual batch files, here's a summary of the remaining batches. Each batch follows the same detailed structure as batches 1-13.

## Batch 14: RelatedPosts Component
- Create RelatedPosts component using $derived to filter posts by matching tags
- Add to BlogPost layout
- Display 3-5 related posts based on tag similarity

## Batch 15: Image Component
- Convert Hugo {{< image >}} shortcode to Image.svelte component
- Support gallery and popup modes
- Use $state for popup open/close
- Support caption, alt text, responsive images

## Batch 16: Video Component
- Convert Hugo {{< video >}} shortcode to Video.svelte component
- Support multiple video formats
- Add HTML5 video player wrapper
- Support autoplay, loop, muted options

## Batch 17: Tip & TipBoard Components
- Convert Hugo {{< tip >}} to Tip.svelte
- Create TipBoard.svelte container
- Support types: info, warning, error
- Use $props for type and children

## Batch 18: Quote, Asciinema, Gist Components
- Convert remaining shortcodes to Svelte components
- Quote.svelte for block quotes
- Asciinema.svelte for terminal recordings
- Gist.svelte for GitHub gist embeds

## Batch 19: Home Page
- Create /routes/+page.svelte
- Create /routes/+page.server.ts to load recent posts
- Display bio, recent posts, featured projects
- Match Hugo home page layout

## Batch 20: Static Pages
- Create /routes/things/+page.svelte (portfolio)
- Create /routes/books/+page.svelte
- Create /routes/repos/+page.svelte (GitHub repos)
- Create /routes/archives/+page.svelte
- Create /routes/uses/+page.svelte
- Create /routes/wishlist/+page.svelte

## Batch 21: Resume System
- Create /routes/resume/+page.svelte
- Create /routes/resume.json/+server.ts (JSON endpoint)
- Load resume.json data
- Reuse existing resume CSS from Hugo
- Adapt resume-snapshotter.ts for SvelteKit URLs

## Batch 22: SEO & Meta Tags
- Add comprehensive meta tags to layouts
- Add Open Graph tags for social sharing
- Add Twitter Card tags
- Add Schema.org JSON-LD for BlogPosting
- Create reusable SEO component

## Batch 23: RSS Feed
- Create /routes/rss.xml/+server.ts
- Generate RSS 2.0 feed from posts
- Include full post content or excerpts
- Add feed autodiscovery link in head

## Batch 24: Content Migration
- Copy all 40+ posts from Hugo content/posts/ to SvelteKit content/posts/
- Verify frontmatter compatibility
- Test all posts render correctly
- Fix any broken internal links
- Update any Hugo-specific shortcodes to Svelte components

## Batch 25: Static Assets Migration
- Copy /static/fonts/ to new /static/fonts/
- Copy /static/covers/ to new /static/covers/
- Copy /static/misc/ files
- Verify all asset paths work
- Test fonts load correctly
- Test images display properly

## Batch 26: Cloudflare Deployment
- Configure adapter-cloudflare settings
- Set up wrangler.toml for Cloudflare Workers
- Test local build with adapter
- Verify prerendering works for all routes
- Test preview deployment

## Batch 27: Analytics
- Add Plausible analytics script to head
- Configure script.plausible.io integration
- Match Hugo analytics setup
- Test events tracking (optional)

## Batch 28: Final Testing & Validation
- Run full build
- Test all 40+ posts render correctly
- Verify all static pages work
- Test navigation, breadcrumbs, pagination
- Test dark mode switching
- Test mobile responsiveness at all breakpoints
- Run Lighthouse audit (target: 95+ performance, 100 accessibility, 100 SEO)
- Visual comparison with Hugo site
- Fix any styling discrepancies

## Batch 29: Deployment Workflow
- Create GitHub Actions workflow for deployment
- Configure Cloudflare Pages deployment
- Set up preview deployments for PRs
- Test automated deployment
- Update DNS if needed
- Final production deployment

---

**Note**: Each batch should be implemented with the same level of detail as batches 1-13:
- Step-by-step commands with expected output
- Git commits at completion
- Verification steps
- Test commands

The implementer should expand each batch following the established pattern.
