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
