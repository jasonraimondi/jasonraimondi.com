# Recap

This is the first batch. We're preparing for the CSS refactoring by creating a feature branch, capturing baseline builds, and taking screenshots for visual regression testing.

# Batch 1: Preparation and Baseline Capture

## Task 1: Create Feature Branch

### Step 1: Check current git status

Run:
```bash
git status
```

Expected: Working tree should be clean (or only contain .claude/settings.json changes)

### Step 2: Check current branch

Run:
```bash
git branch
```

Expected: Should show `* main` (or current branch)

### Step 3: Create and checkout feature branch

Run:
```bash
git checkout -b refactor/css-shared-core
```

Expected: "Switched to a new branch 'refactor/css-shared-core'"

### Step 4: Verify branch creation

Run:
```bash
git branch
```

Expected: Should show `* refactor/css-shared-core`

### Step 5: Commit

Not needed - branch creation only, no file changes yet

---

## Task 2: Build Current Site and Capture Baseline

### Step 1: Clean previous builds

Run:
```bash
hugo --gc --cleanDestinationDir
```

Expected: "Total in X ms" with no errors

### Step 2: Copy baseline CSS files

Run:
```bash
mkdir -p .baseline-css
cp public/style.css .baseline-css/style.baseline.css
cp public/style.min.*.css .baseline-css/style.min.baseline.css
cp public/resume.css .baseline-css/resume.baseline.css
cp public/resume.min.*.css .baseline-css/resume.min.baseline.css
```

Expected: Files copied to `.baseline-css/` directory

### Step 3: Verify baseline files exist

Run:
```bash
ls -lh .baseline-css/
```

Expected: Should show 4 CSS files with sizes:
- `style.baseline.css` (~44KB)
- `style.min.baseline.css` (~44KB)
- `resume.baseline.css` (~28KB)
- `resume.min.baseline.css` (~28KB)

### Step 4: Record baseline file sizes

Run:
```bash
wc -l .baseline-css/*.css
```

Expected: Line counts displayed for all files (save this output for later comparison)

### Step 5: Add baseline to gitignore

Files to modify:
- `.gitignore`

Add this line:
```
.baseline-css/
```

Run:
```bash
echo ".baseline-css/" >> .gitignore
```

Expected: `.baseline-css/` directory will be ignored by git

### Step 6: Commit gitignore change

Run:
```bash
git add .gitignore
git commit -m "chore: ignore baseline CSS files"
```

Expected: "1 file changed"

---

## Batch 1 Complete

You now have:
- ✅ Feature branch `refactor/css-shared-core`
- ✅ Baseline CSS files in `.baseline-css/`
- ✅ Gitignore entry for baseline artifacts

**Note**: Visual QA testing will be done manually by the developer after implementation.

Next: [batch-2.md](./batch-2.md) - Create shared structure and copy files
