# CSS Shared Core Refactoring Implementation Plan

## Goal

Eliminate CSS duplication between `css/` and `css-resume/` by creating a shared `css/_shared/` directory containing common base styles.

## Architecture

Extract shared CSS files (colors, typography, mixins, base elements) into `css/_shared/` directory. Both `style.css` and `resume.css` import from the shared core, then layer on domain-specific styles. This maintains separate build outputs while establishing a single source of truth for common styles.

## Tech Stack

- **Hugo**: Static site generator
- **PostCSS**: CSS processing pipeline
  - `postcss-import`: File concatenation
  - `postcss-mixins`: Reusable patterns
  - `postcss-custom-media-generator`: Responsive breakpoints
  - `postcss-preset-env`: CSS nesting support
  - `autoprefixer`: Browser compatibility

## Task Batches

### Phase 1: Shared Core Refactoring
1. [batch-1.md](./batch-1.md) - Preparation and baseline capture
2. [batch-2.md](./batch-2.md) - Create shared structure and copy files
3. [batch-3.md](./batch-3.md) - Update entry points (style.css and resume.css)
4. [batch-4.md](./batch-4.md) - Validate builds and visual regression
5. [batch-5.md](./batch-5.md) - Delete duplicate files
6. [batch-6.md](./batch-6.md) - Fix @extend issue in layout
7. [batch-7.md](./batch-7.md) - Final validation and documentation

### Phase 2: CSS Modernization
8. [batch-8.md](./batch-8.md) - Modernize CSS (browser support, @layer, light-dark(), remove mixins)
