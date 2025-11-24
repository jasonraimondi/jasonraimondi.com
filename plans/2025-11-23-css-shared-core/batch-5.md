# Recap

Batch 4 validated that the builds work and visual regression testing passed. Now we can safely delete the duplicate files from `css/` and `css-resume/` since they've been moved to `_shared/`.

# Batch 5: Delete Duplicate Files

## Task 1: Delete Duplicate Foundation Files from css/

### Step 1: Delete _base.css

Run:
```bash
git rm assets/css/_base.css
```

Expected: "rm 'assets/css/_base.css'"

### Step 2: Delete _colors.css

Run:
```bash
git rm assets/css/_colors.css
```

Expected: "rm 'assets/css/_colors.css'"

### Step 3: Delete _typography.css

Run:
```bash
git rm assets/css/_typography.css
```

Expected: "rm 'assets/css/_typography.css'"

### Step 4: Delete _mixin.css (note: singular, not plural)

Run:
```bash
git rm assets/css/_mixin.css
```

Expected: "rm 'assets/css/_mixin.css'"

### Step 5: Verify foundation files deleted

Run:
```bash
ls assets/css/_*.css 2>&1
```

Expected: Should only show `_font-face.css` (or "No such file" for the deleted ones)

### Step 6: Commit foundation file deletions

Run:
```bash
git commit -m "refactor: remove duplicate foundation files from css/"
```

Expected: "4 files changed, X deletions(-)"

---

## Task 2: Delete Duplicate Base Element Files from css/base/

### Step 1: Delete _html.css

Run:
```bash
git rm assets/css/base/_html.css
```

Expected: "rm 'assets/css/base/_html.css'"

### Step 2: Delete _headings.css

Run:
```bash
git rm assets/css/base/_headings.css
```

Expected: "rm 'assets/css/base/_headings.css'"

### Step 3: Delete _typography.css

Run:
```bash
git rm assets/css/base/_typography.css
```

Expected: "rm 'assets/css/base/_typography.css'"

### Step 4: Delete _anchor.css

Run:
```bash
git rm assets/css/base/_anchor.css
```

Expected: "rm 'assets/css/base/_anchor.css'"

### Step 5: Delete _img.css

Run:
```bash
git rm assets/css/base/_img.css
```

Expected: "rm 'assets/css/base/_img.css'"

### Step 6: Delete _container.css

Run:
```bash
git rm assets/css/base/_container.css
```

Expected: "rm 'assets/css/base/_container.css'"

### Step 7: Delete _label.css

Run:
```bash
git rm assets/css/base/_label.css
```

Expected: "rm 'assets/css/base/_label.css'"

### Step 8: Verify base files remaining

Run:
```bash
ls assets/css/base/
```

Expected: Should only show:
- `_code.css`
- `_font-face.css`
- `_noscript.css`

### Step 9: Commit base file deletions

Run:
```bash
git commit -m "refactor: remove duplicate base files from css/base/"
```

Expected: "7 files changed, X deletions(-)"

---

## Task 3: Delete Duplicate Files from css-resume/

### Step 1: Delete _base.css

Run:
```bash
git rm assets/css-resume/_base.css
```

Expected: "rm 'assets/css-resume/_base.css'"

### Step 2: Delete _typography.css

Run:
```bash
git rm assets/css-resume/_typography.css
```

Expected: "rm 'assets/css-resume/_typography.css'"

### Step 3: Delete _mixin.css

Run:
```bash
git rm assets/css-resume/_mixin.css
```

Expected: "rm 'assets/css-resume/_mixin.css'"

### Step 4: Verify root resume files remaining

Run:
```bash
ls assets/css-resume/*.css 2>&1
```

Expected: Should show "No such file or directory" (no root CSS files should remain)

### Step 5: Commit resume root file deletions

Run:
```bash
git commit -m "refactor: remove duplicate foundation files from css-resume/"
```

Expected: "3 files changed, X deletions(-)"

---

## Task 4: Delete Duplicate Base Files from css-resume/base/

### Step 1: Delete _headings.css

Run:
```bash
git rm assets/css-resume/base/_headings.css
```

Expected: "rm 'assets/css-resume/base/_headings.css'"

### Step 2: Delete _typography.css

Run:
```bash
git rm assets/css-resume/base/_typography.css
```

Expected: "rm 'assets/css-resume/base/_typography.css'"

### Step 3: Delete _anchor.css

Run:
```bash
git rm assets/css-resume/base/_anchor.css
```

Expected: "rm 'assets/css-resume/base/_anchor.css'"

### Step 4: Delete _img.css

Run:
```bash
git rm assets/css-resume/base/_img.css
```

Expected: "rm 'assets/css-resume/base/_img.css'"

### Step 5: Delete _container.css

Run:
```bash
git rm assets/css-resume/base/_container.css
```

Expected: "rm 'assets/css-resume/base/_container.css'"

### Step 6: Delete _label.css

Run:
```bash
git rm assets/css-resume/base/_label.css
```

Expected: "rm 'assets/css-resume/base/_label.css'"

### Step 7: Delete _code.css (not used in resume)

Run:
```bash
git rm assets/css-resume/base/_code.css
```

Expected: "rm 'assets/css-resume/base/_code.css'"

### Step 8: Verify resume base files remaining

Run:
```bash
ls assets/css-resume/base/
```

Expected: Should only show:
- `_html.css` (resume-specific font override)
- `_noscript.css` (resume-specific message)

### Step 9: Commit resume base file deletions

Run:
```bash
git commit -m "refactor: remove duplicate base files from css-resume/base/"
```

Expected: "7 files changed, X deletions(-)"

---

## Task 5: Verify Cleanup Complete

### Step 1: Count files in _shared

Run:
```bash
find assets/css/_shared -name "*.css" | wc -l
```

Expected: `11` (11 shared CSS files)

### Step 2: Count files in css/base

Run:
```bash
ls assets/css/base/*.css | wc -l
```

Expected: `3` (only site-specific files remain)

### Step 3: Count files in css-resume/base

Run:
```bash
ls assets/css-resume/base/*.css | wc -l
```

Expected: `2` (only resume-specific files remain)

### Step 4: Verify directory structure

Run:
```bash
tree assets/css assets/css-resume -I 'components|content|layouts|partials|lib|resume' -L 2
```

Expected:
```
assets/css
├── _shared
│   ├── _base.css
│   ├── _colors.css
│   ├── _mixins.css
│   ├── _typography.css
│   └── base
└── base
    ├── _code.css
    ├── _font-face.css
    └── _noscript.css

assets/css-resume
└── base
    ├── _html.css
    └── _noscript.css
```

### Step 5: Run build to verify everything still works

Run:
```bash
hugo --gc --cleanDestinationDir
```

Expected: "Total in X ms" with no errors, both CSS files generated

### Step 6: Verify CSS output files exist

Run:
```bash
ls -lh public/style.css public/resume.css
```

Expected: Both files exist with expected sizes (~44KB and ~28KB)

---

## Task 6: Final Validation Build

### Step 1: Compare new build with baseline

Run:
```bash
diff -u <(wc -l .baseline-css/style.baseline.css) <(wc -l public/style.css)
```

Expected: Line counts should be very similar (±5 lines)

### Step 2: Compare resume with baseline

Run:
```bash
diff -u <(wc -l .baseline-css/resume.baseline.css) <(wc -l public/resume.css)
```

Expected: Line counts should be very similar (±5 lines)

### Step 3: Quick visual check

Run:
```bash
hugo serve -D &
sleep 3
```

Open browser to: `http://localhost:1313/` and `http://localhost:1313/resume/`

Quick checklist:
- [ ] Homepage loads without style errors
- [ ] Resume loads without style errors

Run:
```bash
pkill hugo
```

Expected: Everything still looks correct

---

## Batch 5 Complete

You now have:
- ✅ Deleted 4 duplicate foundation files from `css/`
- ✅ Deleted 7 duplicate base files from `css/base/`
- ✅ Deleted 3 duplicate foundation files from `css-resume/`
- ✅ Deleted 7 duplicate base files from `css-resume/base/`
- ✅ **Total: 21 files deleted** (~15 unique duplicates eliminated)
- ✅ Only site-specific and resume-specific files remain in their directories
- ✅ All changes committed to git
- ✅ Builds still work correctly

Next: [batch-6.md](./batch-6.md) - Fix @extend issue in layout
