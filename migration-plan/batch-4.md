# Recap

Batch 3 complete: PostCSS pipeline configured and tested.

# Batch 4: Migrate CSS Files from Hugo

## Task 1: Copy CSS directory structure

### Files
- Copy: `assets/css/` → `src/lib/styles/`

### Step 1: Copy all CSS files

```bash
cp -r assets/css/* src/lib/styles/
```

Expected: All CSS files and directories copied

### Step 2: Verify directory structure

```bash
ls -R src/lib/styles/
```

Expected output:
```
src/lib/styles/:
_base.css
_colors.css
_typography.css
base/
components/
content/
layouts/
lib/
partials/
style.css

src/lib/styles/base/:
anchor.css
code.css
container.css
headings.css
image.css
label.css

src/lib/styles/components/:
gallery.css
popup.css
tip-board.css
video-container.css

[... etc for all directories]
```

### Step 3: Commit CSS file migration

```bash
git add src/lib/styles/
git commit -m "feat: migrate CSS files from Hugo to SvelteKit

- Copy all CSS files from assets/css/ to src/lib/styles/
- Preserve exact directory structure
- No modifications to CSS content (style preservation)
- Includes: base, components, content, layouts, partials, lib"
```

---

## Task 2: Update CSS import paths

### Files
- Modify: `src/lib/styles/style.css`

### Step 1: Check main style.css

```bash
cat src/lib/styles/style.css | head -30
```

Expected: See @import statements with relative paths

### Step 2: Verify imports work with PostCSS

Most imports should work as-is because we configured postcss-import with path: ['src/lib/styles'].

If any imports use Hugo-specific paths, they may need adjustment.

### Step 3: Test CSS compilation

```bash
npm run dev
```

Expected: Dev server starts without CSS errors

### Step 4: Check browser for CSS

Open http://localhost:5173/

### Step 5: Open browser DevTools → Elements

Expected: See styles applied (even if minimal since no content yet)

### Step 6: Check for CSS errors

Open browser DevTools → Console

Expected: No CSS import errors or warnings

### Step 7: Stop dev server

Press Ctrl+C

### Step 8: If there are import errors, fix paths

**If you see errors like:** `Could not resolve @import for "some-file.css"`

**Then:** Update the import path in the relevant CSS file to be relative to src/lib/styles/

Example fix:
```css
/* Before (Hugo) */
@import "lib/normalize.css";

/* After (SvelteKit) - should work as-is with postcss-import config */
@import "lib/normalize.css";
```

### Step 9: Commit any path fixes

```bash
# Only if paths were modified
git add src/lib/styles/
git commit -m "fix: update CSS import paths for SvelteKit

- Adjust @import paths to work with PostCSS in SvelteKit
- All imports now resolve correctly"
```

---

## Task 3: Migrate normalize.css dependency

### Files
- Verify: `src/lib/styles/lib/normalize.css`

### Step 1: Check if normalize.css exists

```bash
ls -la src/lib/styles/lib/normalize.css
```

Expected: File exists (copied from Hugo)

**If not**, we need to copy it from node_modules:

```bash
cp node_modules/normalize.css/normalize.css src/lib/styles/lib/
```

### Step 2: Verify normalize.css is imported

```bash
grep -r "normalize.css" src/lib/styles/
```

Expected: See import statement in one of the CSS files

### Step 3: Commit if normalize.css was added

```bash
# Only if normalize.css wasn't already in Hugo assets/css/lib/
git add src/lib/styles/lib/normalize.css
git commit -m "feat: add normalize.css to lib

- Copy normalize.css from node_modules
- Ensures consistent cross-browser styling"
```

---

## Task 4: Migrate Pygments CSS (syntax highlighting)

### Files
- Modify: `src/lib/styles/lib/` (Pygments → Shiki transition)

### Step 1: Check for Pygments CSS

```bash
ls -la src/lib/styles/lib/ | grep -i pygments
```

Expected: See Pygments CSS file if it exists

### Step 2: Keep Pygments CSS for reference

We'll adapt the Pygments colors to work with Shiki in a later batch.
For now, just verify it's copied.

### Step 3: Note for later

Create a note file:

```bash
cat > migration-plan/shiki-styling-notes.md << 'EOF'
# Shiki Styling Notes

## Current state
- Hugo uses Pygments for syntax highlighting
- Pygments CSS is in `src/lib/styles/lib/pygments.css` (if exists)

## TODO in Batch 11
- Create custom CSS for Shiki-generated code blocks
- Match Pygments color scheme
- Test with actual blog posts containing code blocks

## Shiki output format
Shiki outputs: `<pre class="shiki"><code>...</code></pre>`
With inline styles on `<span>` elements.

We may need to:
1. Override Shiki's inline styles with CSS
2. Or configure Shiki themes to match Pygments colors
EOF
```

### Step 4: Commit styling notes

```bash
git add migration-plan/shiki-styling-notes.md
git commit -m "docs: add notes for Shiki styling migration

- Document Pygments → Shiki transition plan
- Note for Batch 11 implementation"
```

---

## Task 5: Test build with all CSS

### Files
- None (verification only)

### Step 1: Build project

```bash
npm run build
```

Expected output:
```
vite v6.x.x building for production...
✓ XXX modules transformed.
...
✓ built in XXXms
```

### Step 2: Check for CSS errors

Review build output for any CSS-related errors or warnings.

Expected: No CSS errors

### Step 3: Check build output size

```bash
du -sh .svelte-kit/output/client/_app/immutable/assets/
```

Expected: See CSS files generated (size will vary)

### Step 4: Preview build

```bash
npm run preview
```

Expected: Preview server starts

### Step 5: Open preview in browser

Open http://localhost:4173/

Expected: Page loads without CSS errors (even if unstyled since no content)

### Step 6: Check browser DevTools

Expected: CSS loaded, no 404s

### Step 7: Stop preview

Press Ctrl+C

### Step 8: Clean build

```bash
rm -rf .svelte-kit/
```

---

## Batch 4 Complete!

**Verification checklist:**
- [ ] All CSS files copied from assets/css/ to src/lib/styles/
- [ ] Directory structure preserved exactly
- [ ] normalize.css present and imported
- [ ] All @import paths resolve correctly
- [ ] Dev server runs without CSS errors
- [ ] Build completes successfully
- [ ] No CSS modifications (style preservation)
- [ ] All changes committed to git

**Files migrated:**
- `_base.css` - Global variables and mixins
- `_colors.css` - OKLCH color system
- `_typography.css` - Font definitions
- `base/` - HTML element styles (headings, code, links, etc.)
- `components/` - Component styles (galleries, videos, tipboards)
- `content/` - Content-specific styles
- `layouts/` - Page layout styles (index, list, single)
- `partials/` - Partial component styles
- `lib/` - normalize.css, Pygments (if present)
- `style.css` - Main entry point with all imports

**Next**: Batch 5 - Create content loader for `/content/posts/` markdown files
