# CSS Organization

This directory contains the stylesheets for jasonraimondi.com.

## Directory Structure

```
src/styles/
├── _shared/              # Shared styles used by both main site and resume
│   ├── _base.css         # Root CSS variables (containers, sidebar, etc)
│   ├── _colors.css       # OKLCH color system (grayscale, brand colors)
│   ├── _typography.css   # Font families, scales, and weights
│   ├── _mixins.css       # PostCSS mixins (scrollable, date-item, etc)
│   └── base/             # HTML element base styles
│       ├── _html.css     # Root html/body styles
│       ├── _headings.css # h1-h6 heading styles
│       ├── _typography.css # Paragraph, list, text styles
│       ├── _anchor.css   # Link styles
│       ├── _img.css      # Image styles
│       ├── _container.css # Container width constraints
│       └── _label.css    # Label/badge styles
├── base/                 # Site-specific base styles
│   ├── _font-face.css   # Averia font imports (site only)
│   ├── _noscript.css    # No-JS messaging
│   └── _code.css        # Code block styles (blog only)
├── components/           # Reusable UI components
├── content/              # Content-specific styles
├── layouts/              # Page layout styles
├── partials/             # Partial/section styles
├── resume/               # Resume-specific styles
└── lib/                  # Third-party stylesheets
```

## Entry Points

- **`src/styles/style.css`** - Main site stylesheet (imported by `src/routes/(blog)/+layout.svelte`)
- **`src/styles/resume.css`** - Resume stylesheet (imported by `src/routes/(resume)/+layout.svelte`)

Both entry points import from `_shared/` for common base styles, then add their domain-specific styles.

## Build Process

Stylesheets are processed by PostCSS (configured in `postcss.config.js`):
- `postcss-import` - Concatenates @import statements
- `postcss-mixins` - Enables reusable @mixin patterns
- `postcss-custom-media-generator` - Creates responsive breakpoints
- `postcss-preset-env` - Enables modern CSS (nesting, etc)
- `autoprefixer` - Adds vendor prefixes
- `cssnano` - Minifies in production

Build command: `pnpm build`

## Custom Media Queries

Breakpoints defined in `postcss.config.js`:
- `--xsmall`: 420px
- `--small`: 640px
- `--medium`: 768px
- `--large`: 1024px
- `--xlarge`: 1280px
- `--xxlarge`: 1536px
- `--light`: prefers-color-scheme: light
- `--dark`: prefers-color-scheme: dark

Usage: `@media (--large) { ... }`

## Adding New Styles

### Shared styles (used by both main site and resume)
Add to `css/_shared/` or `css/_shared/base/`

### Site-specific styles
Add to appropriate directory:
- Base HTML elements → `css/base/`
- Reusable components → `css/components/`
- Page layouts → `css/layouts/`
- Partials/sections → `css/partials/`

### Resume-specific styles
Add to `resume/` or `resume/base/`

## Color System

Uses OKLCH color space for perceptually uniform colors. See `_shared/_colors.css` for available colors:
- Grayscale: `--color-gray-50` through `--color-gray-900`
- Brand colors: green, purple, rose, lightBlue (50-900 scales)

## Important Notes

- **Do not use `@extend`** - PostCSS doesn't support Sass @extend syntax
- **Use mixins instead** - Define in `_shared/_mixins.css`
- **Shared files are single source of truth** - Don't duplicate shared styles
