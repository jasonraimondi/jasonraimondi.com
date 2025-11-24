# CSS Shared Core Refactoring

## Overview

Eliminate duplication between `css/` and `css-resume/` directories by extracting shared styles into a common `css/_shared/` directory. This refactoring maintains separate build outputs (style.css and resume.css) while establishing a single source of truth for common base styles.

## Goals

**Primary Goal**: Eliminate CSS duplication between main site and resume styles

**Success Criteria**:
- Easy to maintain - one place to update shared styles
- Clear organization - obvious where things belong
- No visual regressions - site looks identical after refactor
- Better developer experience - easier to work with

## Constraints

- Keep separate build outputs: `style.css` and `resume.css`
- Resume requires different font family and PDF-specific styles
- No user-facing visual changes
- Must work with existing PostCSS pipeline

## Design

### Architectural Approach: Shared Core Directory

Create a `css/_shared/` directory containing all common styles used by both main site and resume. Both entry points import from the shared core, then layer on their domain-specific styles.

**Key Principle**: If a file is identical or nearly identical between `css/` and `css-resume/`, it moves to `css/_shared/`. Domain-specific overrides stay in their respective directories.

### Directory Structure

```
assets/
├── css/
│   ├── _shared/              # NEW: Common styles for both builds
│   │   ├── _base.css         # Root variables (containers, etc)
│   │   ├── _colors.css       # OKLCH color system
│   │   ├── _typography.css   # Font families, scales, weights
│   │   ├── _mixins.css       # PostCSS mixins
│   │   └── base/             # HTML element styles
│   │       ├── _html.css
│   │       ├── _headings.css
│   │       ├── _typography.css
│   │       ├── _anchor.css
│   │       ├── _img.css
│   │       ├── _container.css
│   │       └── _label.css
│   ├── base/                 # Site-specific base styles
│   │   ├── _font-face.css   # Averia fonts (site only)
│   │   ├── _noscript.css    # Site-specific messaging
│   │   └── _code.css        # Blog code blocks
│   ├── components/           # Site-specific components
│   ├── layouts/              # Site-specific layouts
│   ├── partials/             # Site-specific partials
│   └── lib/                  # Third-party (normalize, pygment)
├── css-resume/
│   ├── base/                 # Resume-specific base overrides
│   │   ├── _html.css        # Resume font-family override
│   │   └── _noscript.css    # Resume-specific messaging
│   └── resume/               # Resume-specific components
│       ├── _layout.css
│       ├── _me.css
│       ├── _skills.css
│       └── _contact.css
├── style.css                 # Main site entry point
└── resume.css                # Resume entry point
```

### Entry Point Refactoring

**`assets/style.css`** (Main site):
```css
/* Vendor */
@import 'normalize.css';

/* Shared foundation */
@import 'css/_shared/_base.css';
@import 'css/_shared/_colors.css';
@import 'css/_shared/_typography.css';
@import 'css/_shared/_mixins.css';

/* Shared base elements */
@import 'css/_shared/base/_html.css';
@import 'css/_shared/base/_headings.css';
@import 'css/_shared/base/_typography.css';
@import 'css/_shared/base/_anchor.css';
@import 'css/_shared/base/_img.css';
@import 'css/_shared/base/_container.css';
@import 'css/_shared/base/_label.css';

/* Site-specific */
@import 'css/base/_font-face.css';
@import 'css/base/_noscript.css';
@import 'css/base/_code.css';

/* Site layouts, partials, components */
@import 'css/layouts/_index.css';
@import 'css/layouts/_list.css';
@import 'css/layouts/_single.css';

@import 'css/partials/_top-bar.css';
@import 'css/partials/_breadcrumbs.css';
@import 'css/partials/_pagination.css';
@import 'css/partials/_related-posts.css';
@import 'css/partials/_recent-projects.css';
@import 'css/partials/_footer.css';
@import 'css/partials/_tip.css';

@import 'css/components/_image-gallery.css';
@import 'css/components/_image-pop.css';
@import 'css/components/_video-container.css';
@import 'css/components/_tipboard.css';

@import 'css/lib/pygment.css';

.asciicast {
  width: 100%;
  & iframe { width: 100%; }
}
```

**`assets/resume.css`** (Resume):
```css
/* Vendor */
@import 'normalize.css';

/* Shared foundation */
@import 'css/_shared/_base.css';
@import 'css/_shared/_colors.css';
@import 'css/_shared/_typography.css';
@import 'css/_shared/_mixins.css';

/* Shared base elements */
@import 'css/_shared/base/_html.css';
@import 'css/_shared/base/_headings.css';
@import 'css/_shared/base/_typography.css';
@import 'css/_shared/base/_anchor.css';
@import 'css/_shared/base/_img.css';
@import 'css/_shared/base/_container.css';
@import 'css/_shared/base/_label.css';

/* Resume-specific overrides */
@import 'css-resume/base/_html.css';
@import 'css-resume/base/_noscript.css';

/* Resume components */
@import 'css-resume/resume/_layout.css';
@import 'css-resume/resume/_me.css';
@import 'css-resume/resume/_skills.css';
@import 'css-resume/resume/_contact.css';

/* Resume-specific variables and utilities */
:root {
  --resume-line-height: 1.4;
}

html {
  font-family: 'Inter', system-ui, BlinkMacSystemFont, -apple-system, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
  font-size: 100%;
  line-height: var(--resume-line-height);

  @media (--large) {
    font-size: 20px;
  }
}

@media (--medium) {
  :root {
    --resume-line-height: 1.6;
  }
}

@media print {
  :root {
    --resume-line-height: 1.3;
  }
  html {
    font-size: 90%;
  }
  .print-only { display: block; }
  .print-hide { display: none; }
}

#resume {
  font-weight: 500;
}

.print-only {
  display: none;
}
```

**Import Hierarchy**:
1. Vendor dependencies (normalize.css)
2. Shared foundation (variables, mixins, colors, typography)
3. Shared base elements (HTML element styling)
4. Domain-specific overrides (resume overrides shared _html.css)
5. Domain-specific components (layouts, partials, components)
6. Inline utilities (minimal, scoped to entry point)

### File Migration Strategy

**Files to move** `assets/css/` → `assets/css/_shared/`:
- `_base.css`
- `_colors.css`
- `_typography.css`
- `_mixins.css`
- `base/_html.css`
- `base/_headings.css`
- `base/_typography.css`
- `base/_anchor.css`
- `base/_img.css`
- `base/_container.css`
- `base/_label.css`

**Files to keep in** `assets/css/base/` (site-specific):
- `_font-face.css` (Averia fonts - not used in resume)
- `_noscript.css` (site-specific messaging)
- `_code.css` (blog code blocks - not in resume)

**Files to delete** (duplicates in `css-resume/`):
- `css-resume/_base.css`
- `css-resume/_typography.css`
- `css-resume/_mixin.css`
- `css-resume/base/_headings.css`
- `css-resume/base/_typography.css`
- `css-resume/base/_anchor.css`
- `css-resume/base/_img.css`
- `css-resume/base/_container.css`
- `css-resume/base/_label.css`
- `css-resume/base/_code.css`

**Files to keep in** `css-resume/` (resume-specific):
- `base/_html.css` (Inter font override)
- `base/_noscript.css` (resume-specific message)
- `resume/_layout.css`
- `resume/_me.css`
- `resume/_skills.css`
- `resume/_contact.css`

**Net Result**: Eliminates ~15 duplicate files

### Fix @extend Issue

**Problem**: `assets/css/content/_layout.css:2` uses `@extend .width-constrain` which is Sass syntax, not supported by PostCSS.

**Solution**: Remove the @extend directive. The `.width-constrain` class doesn't exist anyway, and the intended behavior should be achieved by applying the `.container` class directly in HTML templates.

**Code Change**:
```css
/* Before */
.main-content {
  @extend .width-constrain;
  height: 100%;
  display: block;
}

/* After */
.main-content {
  height: 100%;
  display: block;
}
```

**Template Update**: Add `.container` class to HTML elements that use `.main-content` where width constraints are needed.

## Implementation Process

### Phase 1: Preparation
- Create feature branch: `refactor/css-shared-core`
- Build current site and capture screenshots for visual regression testing
- Save current compiled CSS files as baseline

### Phase 2: Migration
- Create `assets/css/_shared/` directory structure
- Move files to `_shared/` (keep originals temporarily as backup)
- Update imports in `style.css` and `resume.css`

### Phase 3: Validation
- Build both CSS files: `hugo --gc`
- Compare compiled output sizes (should be within 5%)
- Visual regression test: Compare screenshots of key pages
- Test resume PDF generation

### Phase 4: Cleanup
- Delete duplicate files from `css/` and `css-resume/`
- Fix `@extend .width-constrain` in layout file
- Update HTML templates for .container class (if needed)
- Final build and verification

### Phase 5: Documentation
- Add comment headers to entry points explaining structure
- Update any CSS documentation about file organization

## Validation Checklist

- [ ] Main site builds without errors
- [ ] Resume builds without errors
- [ ] File sizes within 5% of original
- [ ] Homepage renders identically
- [ ] Blog post page renders identically
- [ ] Resume page renders identically
- [ ] Resume PDF generates correctly
- [ ] Dark mode works on both sites
- [ ] Responsive breakpoints work correctly
- [ ] Print styles work for resume

## Rollback Plan

Feature branch approach with preserved originals during migration allows easy revert if issues arise. All changes are structural (file moves and import updates) with no logic changes, minimizing risk.

## Future Considerations

This refactoring establishes a foundation for:
- Easier addition of new shared base styles
- Clear patterns for site-specific vs resume-specific styles
- Potential extraction of more shared components in the future
- Better onboarding for new developers (self-documenting structure)

## CSS Modernization (Post-Refactoring)

After completing the shared core refactoring, modernize the CSS architecture to adopt current standards and remove outdated tooling. This work builds on the shared core foundation.

### Browser Support Update

**Current**: Supports older browsers including IE 11
**Target**: Modern browsers only (last 2 versions, >1%, not dead, not IE 11)

This enables use of native CSS features without polyfills:
- CSS Cascade Layers (@layer)
- light-dark() color function
- Native CSS nesting (via postcss-preset-env stage 1)
- Container queries (if needed in future)

### Adopt CSS Cascade Layers (@layer)

**Purpose**: Explicit cascade control without specificity hacks

**Implementation**:
1. Restructure entry points (style.css, resume.css) with layer declarations
2. Create clear layer hierarchy: reset → base → components → utilities
3. Eliminates need for !important and specificity management

**Benefits**:
- Predictable cascade behavior
- Easier overrides in correct layer
- Self-documenting style priority

### Adopt light-dark() Function

**Purpose**: Replace dark mode media queries with native CSS function

**Current Approach** (~30-40 occurrences):
```css
:root {
  --color: oklch(90% 0.05 210);
}

@media (prefers-color-scheme: dark) {
  :root {
    --color: oklch(20% 0.05 210);
  }
}
```

**Modern Approach**:
```css
:root {
  --color: light-dark(
    oklch(90% 0.05 210),  /* light mode */
    oklch(20% 0.05 210)   /* dark mode */
  );
}
```

**Benefits**:
- 50% less code for color definitions
- More maintainable (both values co-located)
- Works with automatic browser color schemes
- Requires Safari 17.5+, Chrome 123+, Firefox 120+ (acceptable for modern-only target)

### Remove PostCSS Mixins

**Purpose**: Eliminate build-time tooling in favor of native CSS

**Current Mixins** (in `_mixin.css`):
- `@define-mixin scrollable` - Scrollbar styling
- `@define-mixin no-scrollbar` - Hide scrollbar
- `@define-mixin date-item` - Date badge styling
- Uses deprecated `-webkit-overflow-scrolling: touch` (iOS 5-12 only)

**Replacement Strategy**:
1. Create `css/_shared/_utilities.css` with utility classes
2. Replace mixin usage throughout codebase with utility classes
3. Remove postcss-mixins dependency
4. Delete `_mixin.css` file

**Benefits**:
- Simpler build pipeline (one less plugin)
- More standard CSS patterns (classes > build-time mixins)
- Better browser DevTools support (see actual CSS, not generated)
- Removes deprecated vendor prefixes

### PostCSS Configuration Updates

**Changes**:
- `stage: 2` → `stage: 1` (enables more modern features)
- Enable `custom-media-queries: true` (preserve responsive breakpoints)
- Remove `postcss-mixins` plugin
- Keep `postcss-preset-env` for nesting and future features

**Browser Support Targets**:
```json
"browserslist": [
  "last 2 versions",
  "> 1%",
  "not dead",
  "not IE 11"
]
```

### Implementation Sequence

**Important**: CSS modernization happens **after** shared core refactoring (batch 8)

**Rationale**:
1. Shared core creates the `_shared/` structure
2. Modernization updates files in their final locations
3. Avoids doing work twice (moving, then modernizing)
4. Clean separation of concerns (structure vs features)

## Trade-offs

**Pros**:
- Single source of truth for shared styles
- Clear separation of concerns
- Easier maintenance
- Better developer experience

**Cons**:
- Slightly deeper import paths in entry points
- One-time migration effort
- Need to understand shared vs domain-specific distinction

The benefits significantly outweigh the minimal added complexity.