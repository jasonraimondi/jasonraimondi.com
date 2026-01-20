# Migration Progress

## 2026-01-18: Infrastructure - SvelteKit Initialization

### Completed
- Created SvelteKit project structure with TypeScript
- Installed core dependencies:
  - `@sveltejs/kit` v2.50.0
  - `@sveltejs/adapter-cloudflare` v5.1.0
  - `@sveltejs/enhanced-img` v0.5.1
  - `mdsvex` v0.12.6
  - `shiki` v3.21.0 for syntax highlighting
  - `svelte` v5.47.0
- Configured mdsvex with Shiki dual-theme (github-light/github-dark)
- Set up PostCSS pipeline with existing plugins
- Migrated CSS from `assets/css/` to `src/styles/`
- Created base layout and placeholder homepage
- Added ESLint + Prettier configuration
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `svelte.config.js` - SvelteKit config with mdsvex and Shiki
- `vite.config.ts` - Vite config with enhanced images
- `src/app.html` - HTML template
- `src/app.d.ts` - TypeScript declarations
- `src/routes/+layout.svelte` - Root layout
- `src/routes/+page.svelte` - Placeholder homepage
- `src/styles/style.css` - Main stylesheet (migrated)
- `eslint.config.js` - ESLint flat config
- `.prettierrc` / `.prettierignore` - Prettier config

### Notes for Next Developer
- Hugo files are still in place for reference (layouts/, content/, assets/)
- Content directory structure created at `src/content/{posts,things,pages}`
- The `@include scrollable` mixin was inlined in `base/_code.css` since postcss-mixins didn't auto-process it
- PostCSS uses array format for guaranteed plugin order
- Build output goes to `.svelte-kit/` (gitignored)

## 2026-01-18: Homepage Implementation

### Completed
- Created directory structure: `src/content/{posts,things,pages}`, `src/lib/{data,components}`
- Converted `data/projects.yaml` to `src/lib/data/projects.json` with TypeScript types
- Built Header component with navigation and responsive avatar
- Built Footer component with social links
- Built AboutMe component with rotating text using Svelte 5 `$state` and `fade` transitions
- Built RecentProjects component displaying project list from JSON
- Updated root layout to include Header and Footer
- Implemented full homepage with AboutMe and RecentProjects sections
- Disabled `svelte/no-navigation-without-resolve` ESLint rule (uses `base` from `$app/paths` instead)
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/lib/data/projects.json` - Project data from YAML
- `src/lib/data/types.ts` - TypeScript interfaces for data
- `src/lib/components/Header.svelte` - Navigation with avatar
- `src/lib/components/Footer.svelte` - Social links footer
- `src/lib/components/AboutMe.svelte` - Bio with animated text rotation
- `src/lib/components/RecentProjects.svelte` - Project list component

### Files Modified
- `src/routes/+layout.svelte` - Added Header/Footer, container structure
- `src/routes/+page.svelte` - Full homepage implementation
- `eslint.config.js` - Disabled navigation-without-resolve rule

### Notes for Next Developer
- Text rotation uses 60-second interval, same as original Hugo site
- Internal links use `{base}/path` pattern for proper base path handling
- External links in RecentProjects open in new tab with `rel="noopener"`
- The AboutMe component uses Svelte 5 runes (`$state`, `$derived`)
- Projects JSON is imported directly in page component

## 2026-01-18: Posts List Page

### Completed
- Created `Post` TypeScript interface in `src/lib/data/types.ts`
- Created `/posts` route with server-side data loading from `.svx` files
- Posts are loaded via `import.meta.glob` and sorted by date descending
- Created responsive posts list page with title, date, description, and archived badge
- Added 3 sample posts converted from Hugo to `.svx` format for testing
- Dark mode styles included using `:global([data-theme='dark'])` selectors
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/routes/posts/+page.svelte` - Posts list page component
- `src/routes/posts/+page.server.ts` - Server-side loader for .svx posts
- `src/content/posts/git-squashit-squash-it-squa-shit.svx` - Sample post
- `src/content/posts/use-the-npm-version-command-to-semantically-version-your-node-project.svx` - Sample post
- `src/content/posts/darknet-diaries.svx` - Sample post

### Files Modified
- `src/lib/data/types.ts` - Added `Post` interface

### Notes for Next Developer
- Posts are loaded from `src/content/posts/*.svx` via `import.meta.glob`
- The loader extracts metadata (frontmatter) and sorts by date descending
- Post detail pages (`/posts/[slug]/`) still need to be implemented
- Full content migration (39 posts) is tracked as a separate PRD task
- The `archived` flag shows a badge when true

## 2026-01-19: Post Detail Page

### Completed
- Implemented post detail route at `/posts/[slug]/` with dynamic slug routing
- Created `Breadcrumbs` component with home icon and hierarchical navigation
- Created `ArchivedBanner` component for outdated content warnings
- Added SEO metadata (OpenGraph, Twitter cards, schema.org markup)
- Post content renders from `.svx` files via mdsvex
- Categories and tags display as labels
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/routes/posts/[slug]/+page.svelte` - Post detail page component
- `src/routes/posts/[slug]/+page.server.ts` - Server-side loader for individual posts
- `src/lib/components/Breadcrumbs.svelte` - Reusable breadcrumb navigation
- `src/lib/components/ArchivedBanner.svelte` - Archived content warning banner

### Notes for Next Developer
- Post detail pages use `$derived` runes for reactive breadcrumbs
- The loader returns both the Svelte component and metadata from `.svx` files
- Content is rendered using `<data.content />` pattern for Svelte 5
- Existing CSS from `_single.css` and `_breadcrumbs.css` handles styling
- Dark mode support for ArchivedBanner uses `color-mix` for transparent backgrounds

## 2026-01-19: Things List and Detail Pages

### Completed
- Created `Thing` TypeScript interface in `src/lib/data/types.ts`
- Created `/things` route with server-side data loading from `.svx` files
- Created `/things/[slug]` detail route with breadcrumbs and SEO metadata
- Things are loaded via `import.meta.glob` and sorted by date descending
- Added 3 sample things converted from Hugo to `.svx` format for testing
- Dark mode styles included using `:global([data-theme='dark'])` selectors
- Reused Breadcrumbs component from posts
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/routes/things/+page.svelte` - Things list page component
- `src/routes/things/+page.server.ts` - Server-side loader for .svx things
- `src/routes/things/[slug]/+page.svelte` - Thing detail page component
- `src/routes/things/[slug]/+page.server.ts` - Server-side loader for individual things
- `src/content/things/typescript-oauth2-server.svx` - Sample thing
- `src/content/things/url-to-png.svx` - Sample thing
- `src/content/things/deno-mirror-to-gitea.svx` - Sample thing

### Files Modified
- `src/lib/data/types.ts` - Added `Thing` interface

### Notes for Next Developer
- Things routes mirror the posts pattern exactly
- Things use the same frontmatter schema as posts (title, date, description, slug, tags, categories)
- The `aliases` field is supported for URL redirects (to be implemented later)
- Full content migration (9 things) is tracked as a separate PRD task
- Some Hugo things use page bundles (directories with index.md + images) - these need special handling for images during full migration

## 2026-01-19: Uses Page

### Completed
- Created `/uses` route with static content from Hugo
- Migrated battlestation.jpg image to `static/covers/`
- Converted Hugo shortcodes to inline Svelte:
  - `image/pop` → Simple image figure with link
  - `tipboard` → Styled pre/code block
- Added SEO metadata (OpenGraph, Twitter cards)
- Responsive keyboard layout iframes with lazy loading
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/routes/uses/+page.svelte` - Uses page with hardware, dotfiles, keyboard layouts

### Files Added
- `static/covers/battlestation.jpg` - Workstation photo

### Notes for Next Developer
- Uses page does not use `.svx` content - it's a static Svelte page
- The `image/pop` shortcode was simplified to a basic clickable image. The full ImagePop component with lightbox modal is tracked as a separate PRD task
- The `tipboard` shortcode was inlined with basic styling. The full TipBoard component is tracked as a separate PRD task
- Keyboard layout iframes use lazy loading for performance

## 2026-01-19: Resume Page

### Completed
- Created `/resume` route with dedicated layout (no Header/Footer)
- Resume data loaded from `static/resume.json` via server-side fetch
- Created TypeScript interfaces for JSON Resume schema in `src/lib/data/resume.ts`
- Migrated resume-specific CSS to `src/styles/resume/` directory
- All sections render: Me, Contact, Summary, Experience, Education, Projects, Skills
- Experience section groups consecutive positions at the same company
- Work highlights support inline markdown links via `@html` (data is trusted)
- PDF download link points to `/resume.pdf`
- SEO metadata (OpenGraph) included
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/routes/resume/+layout.svelte` - Dedicated layout with Inter font (no Header/Footer)
- `src/routes/resume/+page.svelte` - Resume page component
- `src/routes/resume/+page.server.ts` - Server-side loader for resume.json
- `src/lib/data/resume.ts` - TypeScript interfaces for Resume data
- `src/styles/resume.css` - Resume stylesheet entry point
- `src/styles/resume/_layout.css` - Resume grid and section styles
- `src/styles/resume/_me.css` - Name/title section styles
- `src/styles/resume/_skills.css` - Skills section styles
- `src/styles/resume/_contact.css` - Contact section styles
- `src/styles/resume/base/_html.css` - Resume HTML base styles
- `static/resume.json` - JSON Resume data (copied from content/)

### Notes for Next Developer
- Resume page uses a separate layout that doesn't inherit from the main site layout
- The `shouldHide()` function filters entries where name/value starts with `__` (Hugo convention)
- Work entries are processed to show company info only once when there are consecutive roles
- The `@html` directive is used for work highlights that contain markdown links - data is trusted as it comes from the repo's own JSON file
- Resume PDF generation via Playwright is tracked as a separate PRD task

## 2026-01-19: Dark Mode Toggle

### Completed
- Created theme store with localStorage persistence and OS preference detection
- Built ThemeToggle component with sun/moon icons
- Added inline script to app.html to prevent flash of wrong theme on page load
- Updated all CSS files to use `[data-theme='dark']` selector instead of `@media (--dark)` media query
- Theme toggle integrated into Header component
- Store initializes on mount and listens for OS preference changes
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/lib/stores/theme.ts` - Theme store with Svelte 5 runes, localStorage persistence, OS preference detection
- `src/lib/components/ThemeToggle.svelte` - Toggle button with sun/moon SVG icons

### Files Modified
- `src/app.html` - Added inline script to set data-theme attribute before render (prevents FOUC)
- `src/routes/+layout.svelte` - Imports and initializes theme store on mount
- `src/lib/components/Header.svelte` - Integrated ThemeToggle component
- `src/styles/base/_html.css` - Updated to use `[data-theme='dark']` selector
- `src/styles/_shared/base/_anchor.css` - Updated dark mode styles
- `src/styles/_shared/base/_label.css` - Updated dark mode styles
- `src/styles/_shared/_mixins.css` - Removed `@media (--dark)` from date-item mixin
- `src/styles/base/_code.css` - Updated dark mode styles
- `src/styles/layouts/_single.css` - Updated dark mode styles for tables and dates
- `src/styles/layouts/_list.css` - Updated dark mode styles for list items and dates
- `src/styles/partials/_pagination.css` - Updated dark mode styles
- `src/styles/content/_layout.css` - Updated dark mode styles for nav and menu-toggle
- `src/styles/content/_nav.css` - Updated dark mode styles
- `src/styles/content/_posts.css` - Updated dark mode styles for post-date
- `src/styles/components/_tipboard.css` - Updated dark mode styles
- `src/styles/resume/base/_html.css` - Updated to use `[data-theme='dark']` selector

### Notes for Next Developer
- Theme is stored in localStorage under key `theme-preference`
- The inline script in app.html sets `data-theme` before first render to prevent flash
- Theme store uses Svelte 5 runes (`$state`) for reactivity
- CSS uses `:root[data-theme='dark']` pattern for dark mode styles
- Store listens for OS preference changes but only applies them if user hasn't set a preference
- ThemeToggle shows sun icon in dark mode (to switch to light) and moon icon in light mode (to switch to dark)

## 2026-01-20: Tip Component

### Completed
- Created `Tip` Svelte component for styled info/warning boxes
- Component accepts `type` prop (`info` or `warning`) and optional `title` prop
- Uses Svelte 5 Snippets for children content
- Dark mode styles using `color-mix` for semi-transparent backgrounds
- Fixed ESLint parsing errors across all pages with JSON-LD `</script>` tags
  - Used string concatenation pattern (`'</' + 'script>'`) to avoid Svelte/ESLint parsing issues
  - Added `eslint-disable-next-line` comments for `@html` tags with trusted JSON-LD data
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/lib/components/Tip.svelte` - Styled info/warning box component

### Files Modified
- `src/routes/+page.svelte` - Fixed JSON-LD script escaping
- `src/routes/posts/+page.svelte` - Fixed JSON-LD script escaping
- `src/routes/posts/[slug]/+page.svelte` - Fixed JSON-LD script escaping
- `src/routes/resume/+page.svelte` - Fixed JSON-LD script escaping
- `src/routes/things/+page.svelte` - Fixed JSON-LD script escaping
- `src/routes/things/[slug]/+page.svelte` - Fixed JSON-LD script escaping
- `src/routes/uses/+page.svelte` - Fixed JSON-LD script escaping

### Notes for Next Developer
- To use Tip in .svx files, import and use as: `<script>import Tip from '$lib/components/Tip.svelte';</script>` then `<Tip type="warning" title="Warning">Content here</Tip>`
- The `type` defaults to `info` if not specified
- The `title` defaults to the type name if not specified (e.g., "info" or "warning")
- Pass empty string as title (`title=" "`) to hide the title completely
- JSON-LD script tags must use string concatenation to avoid Svelte parser issues with `</script>` literals

## 2026-01-20: Quote Component

### Completed
- Created `Quote` Svelte component for styled blockquotes with attribution
- Component accepts `author`, `source`, `link`, and `title` props
- Uses Svelte 5 Snippets for children content
- Auto-generates display title from link URL if title not provided (truncates long URLs)
- Dark mode styles using CSS custom properties
- Styled footer with author, source/cite, and optional link
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/lib/components/Quote.svelte` - Styled blockquote component with attribution

### Notes for Next Developer
- To use Quote in .svx files: `<script>import Quote from '$lib/components/Quote.svelte';</script>` then `<Quote author="Name" link="https://...">Quote text</Quote>`
- Props are all optional: `author` (string), `source` (string), `link` (string), `title` (string)
- If `link` is provided but `title` is not, the title is auto-generated from the URL (protocol/www stripped, truncated to 32 chars)
- `source` takes precedence over `link` for the citation display
- Component uses scoped styles with `:global([data-theme='dark'])` for dark mode

## 2026-01-20: TipBoard Component

### Completed
- Created `TipBoard` Svelte component for styled code containers
- Component accepts `variant` prop (`default`, `info`, `error`) and optional `title` prop
- Uses Svelte 5 Snippets for children content
- Updated global CSS with dark mode support for all variants
- Added styling for inner `pre` and `code` elements
- Refactored Uses page to use TipBoard component instead of inline styles
- All checks pass: `pnpm run check`, `pnpm run lint`, `pnpm run build`

### Files Created
- `src/lib/components/TipBoard.svelte` - Styled code container component

### Files Modified
- `src/routes/uses/+page.svelte` - Replaced inline tipboard div with TipBoard component
- `src/styles/components/_tipboard.css` - Added dark mode styles for error/default variants, inner pre/code styles

### Notes for Next Developer
- To use TipBoard in .svx files: `<script>import TipBoard from '$lib/components/TipBoard.svelte';</script>` then `<TipBoard variant="info" title="Title">Content</TipBoard>`
- The `variant` defaults to `default` if not specified (gray styling)
- Available variants: `default` (gray), `info` (green/purple), `error` (rose)
- The `title` is optional and renders as a bold heading above content
- Component relies on global CSS from `_tipboard.css` for styling

## 2026-01-20: Edit on GitHub Links

### Completed
- Created `EditOnGitHub` component with edit icon and "Improve this page" text
- Added component to post detail page (`/posts/[slug]/`)
- Added component to thing detail page (`/things/[slug]/`)
- Links point to correct GitHub repository path (`src/content/{type}/{slug}.svx`)
- Links open in new tab with `rel="noopener"`
- Also marked SEO metadata task as complete (all pages already have full SEO including title, meta description, OpenGraph, Twitter cards, and JSON-LD)
- All checks pass: `pnpm run check`, `pnpm run lint`

### Files Created
- `src/lib/components/EditOnGitHub.svelte` - Edit on GitHub link component

### Files Modified
- `src/routes/posts/[slug]/+page.svelte` - Added EditOnGitHub component
- `src/routes/things/[slug]/+page.svelte` - Added EditOnGitHub component
- `plans/prd.yaml` - Marked "Edit on GitHub links" and "SEO metadata" tasks as complete

### Notes for Next Developer
- Edit links use repository URL `https://github.com/jasonraimondi/jasonraimondi.com`
- The component receives a `filePath` prop like `posts/{slug}.svx` or `things/{slug}.svx`
- Links are styled using existing `.edit-on-github` CSS class from `_single.css`
- The branch is hardcoded as `main` in the URL

## 2026-01-20: RSS Feed

### Completed
- Created `/rss.xml` server route that generates valid RSS 2.0 XML
- RSS feed loads all posts from `src/content/posts/*.svx` via `import.meta.glob`
- Posts sorted by date descending (newest first)
- Each item includes title, link, guid, description, and pubDate
- Proper XML escaping for special characters
- Uses RFC 822 date format for pubDate
- Includes `atom:link` self-reference for feed validation
- Feed is prerendered at build time via `prerender = true`
- Cache headers set for CDN caching (1 hour s-maxage)
- All checks pass: `pnpm run lint`, `pnpm run build`

### Files Created
- `src/routes/rss.xml/+server.ts` - RSS feed server route

### Notes for Next Developer
- RSS feed is prerendered to static XML at build time
- Site metadata (URL, title, description) is defined at the top of the file
- `escapeXml()` helper handles XML entity encoding
- `formatRFC822Date()` converts ISO dates to RSS-compatible format
- When full content migration is complete, all 39 posts will be included in the feed
- To add categories/tags to feed items, extend the item template with `<category>` elements

## 2026-01-20: Sitemap XML Generation

### Completed
- Created `/sitemap.xml` server route that generates valid sitemap XML
- Sitemap includes all static pages (homepage, posts list, things list, uses, resume)
- Sitemap includes all posts and things with proper lastmod dates
- Posts use `lastmod` field if available, falling back to `date`
- List pages (posts, things) use the most recent content date for their lastmod
- Includes changefreq and priority attributes for all URLs
- Proper W3C date format (YYYY-MM-DD) for lastmod values
- Feed is prerendered at build time via `prerender = true`
- Cache headers set for CDN caching (1 hour s-maxage)
- All checks pass: `pnpm run lint`, `pnpm run check`, `pnpm run build`

### Files Created
- `src/routes/sitemap.xml/+server.ts` - Sitemap server route

### Notes for Next Developer
- Sitemap follows sitemaps.org protocol
- Static pages have manually assigned priorities (1.0 for homepage, down to 0.6 for uses)
- Posts have priority 0.8, things have priority 0.7
- changefreq varies: weekly for homepage/posts list, monthly for things/uses/resume, yearly for individual content pages
- `formatW3CDate()` helper converts ISO dates to YYYY-MM-DD format
- When full content migration is complete, all 39 posts and 9 things will be included

## 2026-01-20: Video Component

### Completed
- Created `Video` Svelte component for HTML5 video player
- Component accepts `mp4`, `webm`, `poster`, and `portrait` props
- Uses native HTML5 `<video>` element with controls
- Supports multiple source formats (MP4 and WebM)
- Portrait mode for vertical videos (max-width 400px, centered)
- Scoped CSS with responsive sizing and border-radius
- All checks pass: `pnpm run lint`, `pnpm run check`

### Files Created
- `src/lib/components/Video.svelte` - HTML5 video player component

### Notes for Next Developer
- To use Video in .svx files: `<script>import Video from '$lib/components/Video.svelte';</script>` then `<Video mp4="./video.mp4" webm="./video.webm" poster="./poster.png" portrait />`
- The `portrait` prop is a boolean (no value needed when true)
- At least one of `mp4` or `webm` should be provided
- The `poster` prop is optional for thumbnail image before playback
- Used in the Flipp project (`content/things/flipp/index.md`) for app demo videos

## 2026-01-20: Gist Component

### Completed
- Created `Gist` Svelte component for lazy-loading GitHub Gist embeds
- Uses IntersectionObserver to trigger loading when gist enters viewport
- Shows placeholder with GitHub logo until loaded
- Uses iframe to safely embed the gist script (GitHub's gist.js uses document.write)
- Iframe auto-resizes using ResizeObserver
- Dark mode support for placeholder styling
- Also verified Breadcrumbs component was already working correctly (marked as passing in PRD)
- All checks pass: `pnpm run lint`, `pnpm run check`

### Files Created
- `src/lib/components/Gist.svelte` - Lazy-loading GitHub Gist embed component

### Notes for Next Developer
- To use Gist in .svx files: `<script>import Gist from '$lib/components/Gist.svelte';</script>` then `<Gist user="username" id="gist_id" file="optional_filename" />`
- The `file` prop is optional, used to show a specific file from a multi-file gist
- Component uses iframe isolation to handle GitHub's document.write approach
- Placeholder appears until scroll triggers IntersectionObserver (100px rootMargin)
- ResizeObserver adjusts iframe height as gist content loads

## 2026-01-20: ImagePop Component

### Completed
- Created `ImagePop` Svelte component with custom lightbox modal
- Component accepts `src`, `alt`, `caption`, `portrait`, and `nodesc` props
- Click on image opens modal with full-size image and caption
- Modal closes on: click outside, Escape key, or close button click
- Uses Svelte `fade` and `scale` transitions for smooth open/close animations
- Uses Svelte 5 runes (`$state`, `$derived`)
- Updated Uses page to use ImagePop component instead of simple link
- Removed inline styles from Uses page that are no longer needed
- All checks pass: `pnpm run lint`, `pnpm run check`, `pnpm run build`

### Files Created
- `src/lib/components/ImagePop.svelte` - Clickable image with lightbox modal

### Files Modified
- `src/routes/uses/+page.svelte` - Replaced inline image figure with ImagePop component

### Notes for Next Developer
- To use ImagePop in .svx files: `<script>import ImagePop from '$lib/components/ImagePop.svelte';</script>` then `<ImagePop src="/path/to/image.jpg" alt="Description" />`
- The `caption` prop is optional; if not provided, `alt` is used for the caption
- The `portrait` prop adds a CSS class for portrait-oriented images (narrower max-width on larger screens)
- The `nodesc` prop hides the caption below the thumbnail image
- Modal uses z-index 1000 and semi-transparent black backdrop (0.9 opacity)
- Close button is positioned above the image, escape key listener is on svelte:window
