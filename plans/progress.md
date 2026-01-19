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
