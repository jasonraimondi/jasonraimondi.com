# Recap

Batch 5 deleted all duplicate files. Now we'll fix the `@extend .width-constrain` issue in `assets/css/content/_layout.css` which uses Sass syntax that PostCSS doesn't support.

# Batch 6: Fix @extend Issue

## Task 1: Fix @extend in _layout.css

### Files
- Modify: `assets/css/content/_layout.css:2`

### Step 1: Read current _layout.css

Run:
```bash
head -10 assets/css/content/_layout.css
```

Expected: Should see `@extend .width-constrain;` on line 2

### Step 2: View the problematic code

Run:
```bash
sed -n '1,5p' assets/css/content/_layout.css
```

Expected:
```css
.main-content {
  @extend .width-constrain;
  height: 100%;
  display: block;
}
```

### Step 3: Remove @extend line

File: `assets/css/content/_layout.css`

Replace:
```css
.main-content {
  @extend .width-constrain;
  height: 100%;
  display: block;
}
```

With:
```css
.main-content {
  height: 100%;
  display: block;
}
```

### Step 4: Verify the change

Run:
```bash
head -10 assets/css/content/_layout.css
```

Expected: Should NOT contain `@extend` line

### Step 5: Check for any other @extend usages

Run:
```bash
grep -r "@extend" assets/css/ assets/css-resume/
```

Expected: No results (no other @extend usages)

### Step 6: Commit the fix

Run:
```bash
git add assets/css/content/_layout.css
git commit -m "fix: remove unsupported @extend from layout"
```

Expected: "1 file changed, 1 deletion(-)"

---

## Task 2: Verify Build After Fix

### Step 1: Clean and rebuild

Run:
```bash
hugo --gc --cleanDestinationDir
```

Expected: "Total in X ms" with no warnings about @extend

### Step 2: Check for PostCSS warnings

Run:
```bash
hugo --gc 2>&1 | grep -i "warn\|error\|extend"
```

Expected: No warnings or errors (especially no @extend warnings)

### Step 3: Verify style.css generated correctly

Run:
```bash
ls -lh public/style.css
```

Expected: File exists with size ~44KB

### Step 4: Check if .main-content styles are in output

Run:
```bash
grep -A 3 "\.main-content" public/style.css
```

Expected: Should show:
```css
.main-content {
  height: 100%;
  display: block;
}
```

---

## Task 3: Investigate HTML Template Usage

### Step 1: Find templates using .main-content

Run:
```bash
grep -r "main-content" layouts/ content/ 2>/dev/null | head -10
```

Expected: Shows where .main-content class is used in templates

### Step 2: Check if .container is already applied

Run:
```bash
grep -r "main-content" layouts/ | grep -i "container"
```

Expected: May show templates where both classes are used together

### Step 3: Document findings

Create temporary note:
```bash
cat > .main-content-analysis.md << 'EOF'
# .main-content Analysis

## Current Usage
[Paste output from step 1 here]

## Container Class Usage
[Paste output from step 2 here]

## Decision
Based on the analysis:
- [ ] .main-content already has .container in HTML - no action needed
- [ ] Need to add .container class to templates using .main-content
- [ ] .main-content doesn't need width constraint

## Next Steps
[If template updates needed, document which files and how]
EOF
```

Expected: Analysis document created

### Step 4: Visual check for width constraints

Run:
```bash
hugo serve -D &
sleep 3
```

Open browser to: `http://localhost:1313/`

Check:
- [ ] Content has appropriate width constraints
- [ ] Content doesn't stretch full viewport width
- [ ] Layout looks correct on wide screens

Run:
```bash
pkill hugo
```

Expected: Layout looks correct (width constraints still working)

### Step 5: Make decision on template updates

**If width constraints are missing:**
- Document which templates need `.container` class added
- Create a follow-up task in `.main-content-analysis.md`

**If width constraints are working:**
- No template changes needed
- Document that existing HTML already handles constraints

### Step 6: Commit analysis document

Run:
```bash
git add .main-content-analysis.md
git commit -m "docs: analyze main-content class usage"
```

Expected: "1 file changed"

---

## Task 4: Test Edge Cases

### Step 1: Test main content on different pages

Start server:
```bash
hugo serve -D &
sleep 3
```

Test pages:
- Homepage: `http://localhost:1313/`
- Blog list: `http://localhost:1313/posts/`
- Single post: `http://localhost:1313/posts/[recent-post]/`
- Resume: `http://localhost:1313/resume/`

Checklist for each page:
- [ ] Content width appropriate
- [ ] No horizontal overflow
- [ ] Centered or left-aligned as expected
- [ ] Responsive behavior correct

Expected: All pages render correctly

### Step 2: Test responsive breakpoints

Resize browser to:
- 375px (mobile)
- 768px (tablet)
- 1024px (desktop)
- 1920px (large desktop)

Checklist:
- [ ] Content doesn't stretch full width on large screens
- [ ] Content readable on mobile
- [ ] No layout breaks

Expected: All breakpoints work correctly

### Step 3: Stop server

Run:
```bash
pkill hugo
```

---

## Batch 6 Complete

You now have:
- ✅ Removed `@extend .width-constrain` from layout
- ✅ Verified build works without warnings
- ✅ Analyzed .main-content usage in templates
- ✅ Tested layout on multiple pages and breakpoints
- ✅ Documented findings and any follow-up needed
- ✅ All changes committed to git

**Key Outcome**: The non-working Sass `@extend` syntax has been removed. If width constraints were needed, they should be handled through HTML class application (`.container`) or existing CSS patterns.

Next: [batch-7.md](./batch-7.md) - Final validation and documentation
