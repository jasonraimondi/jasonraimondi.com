# Hugo to SvelteKit Migration Research

## Project Overview

Personal website for Jason Raimondi at `jasonraimondi.com`. Currently built with Hugo, targeting migration to SvelteKit with Cloudflare Pages deployment.

## Current Hugo Structure

```
├── hugo.toml                    # Main config
├── content/
│   ├── posts/                   # 39 blog posts
│   ├── things/                  # 9 project pages
│   ├── uses/                    # Uses page
│   ├── resume.md                # Resume wrapper
│   └── _index.md                # Homepage
├── layouts/
│   ├── _default/
│   │   ├── baseof.html          # Root layout
│   │   ├── single.html          # Post template
│   │   ├── list.html            # Archive template
│   │   └── resume.html          # Resume template
│   ├── partials/                # Reusable components
│   ├── shortcodes/              # 14 custom shortcodes
│   └── taxonomy/                # Tag/category pages
├── assets/
│   ├── style.css                # Main entry
│   ├── resume.css               # Resume styles
│   └── css/                     # PostCSS partials
├── static/
│   ├── fonts/                   # Averia font files
│   ├── covers/                  # 36 post cover images
│   ├── misc/me/                 # Avatar images
│   ├── resume.pdf               # Generated PDF
│   └── resume.json              # JSON Resume data
└── data/
    ├── projects.yaml            # Featured projects
    ├── archives.yaml            # Archived links
    └── books.yaml               # Book references
```

## Content Inventory

### Blog Posts (39 total)

Location: `content/posts/`

Frontmatter schema:
```yaml
title: string           # Required
slug: string            # Required - URL slug
date: datetime          # Required - ISO format
description: string     # Required - SEO description
categories: string[]    # Optional - e.g., [hardware, software]
tags: string[]          # Optional - e.g., [git, vue, iot]
archived: boolean       # Optional - shows archived banner
images: string[]        # Optional - cover images
imageCredit: string     # Optional - image attribution
comments: boolean       # Optional - enable comments
aliases: string[]       # Optional - redirect old URLs
lastmod: datetime       # Optional - last modified
toc: boolean            # Optional - table of contents
layout: string          # Optional - custom layout
```

### Things/Projects (9 total)

Location: `content/things/`

Same frontmatter schema as posts. Notable projects:
- Can I Poop (iOS app)
- URL-to-PNG (screenshot service)
- Traverse (travel app)
- ts-oauth2-server

### Special Pages

| Page | Source | Notes |
|------|--------|-------|
| Homepage | `_index.md` | Uses shortcodes, inline styles |
| Resume | `resume.md` + `resume.json` | JSON Resume format, Playwright PDF |
| Uses | `uses/_index.md` | Static content |

## Shortcodes to Convert

14 shortcodes need Svelte component equivalents:

| Shortcode | File | Purpose | Params |
|-----------|------|---------|--------|
| `gist` | `gist.html` | GitHub Gist embed | user, id, file? |
| `tip` | `tip.html` | Info/warning boxes | type? |
| `tipboard` | `tipboard.html` | Code container | - |
| `quote` | `quote.html` | Blockquote with attribution | author?, source?, url? |
| `image/pop` | `image/pop.html` | Clickable image lightbox | src, caption?, alt? |
| `image/gallery/frame` | `image/gallery/frame.html` | Gallery container | - |
| `image/gallery/image` | `image/gallery/image.html` | Gallery item | src, caption?, alt? |
| `video/html5` | `video/html5.html` | HTML5 video player | src, poster? |
| `asciinema` | `asciinema.html` | Terminal recording | id |
| `resume-iframe` | `resume-iframe.html` | PDF viewer | - |
| `index/recent-projects` | `index/recent-projects.html` | Projects list | - |
| `index/archives` | `index/archives.html` | Archive links | - |
| `index/books` | `index/books.html` | Book list | - |
| `index/github-repositories` | `index/github-repositories.html` | GitHub repos | - |

## CSS Architecture

PostCSS-based with modern features. Already well-organized for migration.

### Entry Points
- `assets/style.css` - Main site styles
- `assets/resume.css` - Resume-specific styles

### Directory Structure
```
assets/css/
├── _shared/              # Shared between site and resume
│   ├── _base.css         # CSS variables
│   ├── _colors.css       # OKLCH color system
│   ├── _typography.css   # Font settings
│   └── _mixins.css       # PostCSS mixins
├── base/                 # HTML element styles
├── components/           # UI components
├── layouts/              # Page layouts
├── content/              # Content-specific
├── partials/             # Section styles
└── lib/                  # Third-party (normalize, pygment)
```

### PostCSS Plugins
```javascript
// postcss.config.js
plugins: [
  'postcss-import',
  'postcss-mixins',
  'postcss-custom-media-generator',
  'postcss-preset-env',
  'autoprefixer',
  // cssnano in production
]
```

### Breakpoints
- `--xsmall`: 420px
- `--small`: 640px
- `--medium`: 768px
- `--large`: 1024px
- `--xlarge`: 1280px
- `--xxlarge`: 1536px

### Color System
OKLCH color space with scales:
- Grayscale: `--color-gray-50` through `--color-gray-900`
- Brand: green, purple, rose, lightBlue (50-900 scales)

## JavaScript Features

Three TypeScript files in `assets/`:

1. **`post.ts`** - Adds anchor links to headings
2. **`about-me.ts`** - Rotates adjectives/activities on homepage (60s interval)
3. **`links.ts`** - Adds `rel=noopener` to external links

## Data Files

### projects.yaml
```yaml
- name: Project Name
  url: https://example.com
  description: Short description
```
16 projects listed.

### archives.yaml
```yaml
- name: Archive Name
  url: https://example.com
  description: Description
```
8 archived links.

### books.yaml
Book references for reading list.

### resume.json
Full JSON Resume format (15KB):
```json
{
  "basics": { "name", "label", "email", "url", "summary", "location", "profiles" },
  "work": [{ "name", "position", "url", "startDate", "endDate", "summary", "highlights" }],
  "education": [{ "institution", "area", "studyType", "startDate", "endDate" }],
  "projects": [{ "name", "description", "url", "keywords" }],
  "skills": [{ "name", "keywords" }]
}
```

## Hugo-Specific Features Used

| Feature | Usage | SvelteKit Equivalent |
|---------|-------|---------------------|
| `{{ .TableOfContents }}` | Optional TOC in posts | mdsvex plugin or manual |
| `{{ .Summary }}` | Post excerpts | Frontmatter description |
| `resources.GetMatch` | Image processing | @sveltejs/enhanced-img |
| `js.Build` | TS compilation | Vite built-in |
| `fingerprint` | Cache busting | Vite built-in |
| `$scratch` | Template variables | Svelte stores/props |
| Aliases | URL redirects | hooks.server.ts or static |
| Taxonomies | Tags/categories | Dynamic routes |

## URL Structure

| Path | Content Type |
|------|-------------|
| `/` | Homepage |
| `/posts/` | All posts list |
| `/posts/[slug]/` | Post detail |
| `/things/` | Projects list |
| `/things/[slug]/` | Project detail |
| `/uses/` | Uses page |
| `/resume/` | Resume page |
| `/resume.pdf` | Static PDF |
| `/resume.json` | Static JSON |
| `/tags/[tag]/` | Posts by tag |
| `/categories/[cat]/` | Posts by category |
| `/rss.xml` | RSS feed |
| `/sitemap.xml` | Sitemap |

## Third-Party Integrations

- **Analytics**: Plausible (defer script in footer)
- **Embeds**: GitHub Gists, Asciinema
- **PDF Generation**: Playwright for resume screenshots

## Migration Considerations

### High Priority
1. mdsvex for Markdown with Svelte components
2. Shiki for syntax highlighting (replacing Pygments)
3. Image optimization pipeline
4. RSS/Sitemap generation

### Decisions Needed
- Pagination: Keep (15/page) or remove?
- Related posts: Keep algorithm or simplify?
- Comments: Currently disabled, keep that way?

### File Mapping

```
Hugo                          → SvelteKit
─────────────────────────────────────────────
content/posts/*.md            → src/content/posts/*.svx
content/things/*.md           → src/content/things/*.svx
content/uses/_index.md        → src/content/pages/uses.svx
layouts/_default/baseof.html  → src/routes/+layout.svelte
layouts/_default/single.html  → src/routes/posts/[slug]/+page.svelte
layouts/shortcodes/*.html     → src/lib/components/*.svelte
assets/css/**                 → src/styles/**
static/**                     → static/**
data/*.yaml                   → src/lib/data/*.json
```

## Build & Deploy

### Current Hugo Commands
```bash
hugo serve -D          # Dev with drafts
hugo --gc              # Production build
```

### Target SvelteKit Commands
```bash
npm run dev            # Dev server
npm run build          # Production build (adapter-cloudflare)
npm run preview        # Preview build locally
```

### Resume PDF Generation
Uses Playwright to screenshot `/resume/` page. Script at `resume-snapshotter.ts`.

## Dependencies to Install

```json
{
  "devDependencies": {
    "@sveltejs/kit": "^2.x",
    "@sveltejs/adapter-cloudflare": "^4.x",
    "svelte": "^5.x",
    "mdsvex": "^0.12.x",
    "shiki": "^1.x",
    "@sveltejs/enhanced-img": "^0.x",
    "postcss": "^8.x",
    "postcss-import": "^16.x",
    "postcss-mixins": "^10.x",
    "postcss-custom-media-generator": "^1.x",
    "postcss-preset-env": "^9.x",
    "autoprefixer": "^10.x"
  }
}
```

## Reference Files

Key files to examine during implementation:

- `hugo.toml` - Full config with all options
- `layouts/_default/baseof.html` - Base template structure
- `layouts/_default/single.html` - Post template with all features
- `layouts/partials/head.html` - SEO meta tags
- `layouts/shortcodes/image/pop.html` - Complex shortcode example
- `assets/style.css` - CSS import structure
- `assets/css/_shared/_colors.css` - Color system
- `static/resume.json` - Resume data structure