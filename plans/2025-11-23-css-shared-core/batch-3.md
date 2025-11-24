# Recap

Batch 2 created the `_shared/` directory and copied 11 files. Now we'll update the two entry points (`style.css` and `resume.css`) to import from the shared directory instead of their individual locations.

# Batch 3: Update Entry Points

## Task 1: Update assets/style.css

### Files
- Modify: `assets/style.css`

### Step 1: Read current style.css

Run:
```bash
cat assets/style.css
```

Expected: Should see 36 @import statements

### Step 2: Replace style.css with new import structure

File: `assets/style.css`

Replace entire file with:
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

.asciicast  {
  width: 100%;

  & iframe {
    width: 100%;
  }
}
```

### Step 3: Verify style.css changes

Run:
```bash
git diff assets/style.css
```

Expected: Should show imports changed from `css/` to `css/_shared/` for foundation and base files

### Step 4: Verify style.css imports exist

Run:
```bash
grep -c "@import 'css/_shared" assets/style.css
```

Expected: `11` (11 shared imports)

### Step 5: Commit style.css changes

Run:
```bash
git add assets/style.css
git commit -m "refactor: update style.css to use shared imports"
```

Expected: "1 file changed"

---

## Task 2: Update assets/resume.css

### Files
- Modify: `assets/resume.css`

### Step 1: Read current resume.css

Run:
```bash
cat assets/resume.css
```

Expected: Should see ~20 @import statements plus inline styles

### Step 2: Replace resume.css with new import structure

File: `assets/resume.css`

Replace entire file with:
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

### Step 3: Verify resume.css changes

Run:
```bash
git diff assets/resume.css
```

Expected: Should show imports changed from `css-resume/` to `css/_shared/` for shared files

### Step 4: Verify resume.css imports exist

Run:
```bash
grep -c "@import 'css/_shared" assets/resume.css
```

Expected: `11` (11 shared imports)

### Step 5: Commit resume.css changes

Run:
```bash
git add assets/resume.css
git commit -m "refactor: update resume.css to use shared imports"
```

Expected: "1 file changed"

---

## Task 3: Verify Entry Points

### Step 1: Check style.css structure

Run:
```bash
head -20 assets/style.css
```

Expected: Should show vendor, shared foundation, shared base comments

### Step 2: Check resume.css structure

Run:
```bash
head -20 assets/resume.css
```

Expected: Should show vendor, shared foundation, shared base comments

### Step 3: Count total imports in style.css

Run:
```bash
grep -c "@import" assets/style.css
```

Expected: Should show the count (likely 35-36 imports)

### Step 4: Count total imports in resume.css

Run:
```bash
grep -c "@import" assets/resume.css
```

Expected: Should show the count (likely 17-18 imports)

---

## Batch 3 Complete

You now have:
- ✅ `assets/style.css` updated to import from `_shared/`
- ✅ `assets/resume.css` updated to import from `_shared/`
- ✅ Both entry points committed to git
- ✅ Clear import hierarchy established

Next: [batch-4.md](./batch-4.md) - Validate builds and visual regression
