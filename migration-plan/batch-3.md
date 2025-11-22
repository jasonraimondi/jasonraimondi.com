# Recap

Batch 2 complete: mdsvex configured with Shiki syntax highlighting.

# Batch 3: Set up PostCSS Pipeline

## Task 1: Install PostCSS plugins

### Files
- Modify: `package.json`

### Step 1: Install PostCSS plugins (matching Hugo setup)

```bash
npm install -D postcss-import postcss-mixins postcss-custom-media postcss-preset-env
```

Expected output:
```
added 4 packages
```

### Step 2: Verify installations

```bash
npm list postcss-import postcss-mixins postcss-custom-media postcss-preset-env
```

Expected: See all packages installed

### Step 3: Commit PostCSS dependencies

```bash
git add package.json package-lock.json
git commit -m "feat: install PostCSS plugins

- Add postcss-import for @import resolution
- Add postcss-mixins for mixin support
- Add postcss-custom-media for breakpoints
- Add postcss-preset-env for modern CSS features
- Matches Hugo PostCSS pipeline exactly"
```

---

## Task 2: Create PostCSS configuration

### Files
- Create: `postcss.config.js`

### Step 1: Read existing Hugo PostCSS config

```bash
cat postcss.config.js
```

Expected: See current Hugo PostCSS configuration

### Step 2: Create SvelteKit PostCSS config

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/postcss.config.cjs`:

**Note**: Using `.cjs` extension for CommonJS compatibility with SvelteKit/Vite.

```javascript
module.exports = {
	plugins: {
		'postcss-import': {
			// Resolve imports from src/lib/styles (will create in next batch)
			path: ['src/lib/styles']
		},

		'postcss-mixins': {},

		'postcss-custom-media': {
			importFrom: [
				{
					customMedia: {
						// Dark mode media query
						'--dark': '(prefers-color-scheme: dark)',
						'--light': '(prefers-color-scheme: light)',

						// Responsive breakpoints (from Hugo config)
						'--xsmall': '(min-width: 420px)',
						'--small': '(min-width: 640px)',
						'--medium': '(min-width: 768px)',
						'--large': '(min-width: 1024px)',
						'--xlarge': '(min-width: 1280px)',
						'--xxlarge': '(min-width: 1536px)'
					}
				}
			]
		},

		'postcss-preset-env': {
			stage: 2,
			features: {
				'nesting-rules': true
			}
		},

		'autoprefixer': {}

		// cssnano commented out (matching Hugo config)
		// 'cssnano': {}
	}
};
```

### Step 3: Verify PostCSS config syntax

```bash
node -e "const config = require('./postcss.config.cjs'); console.log('✓ PostCSS config valid')"
```

Expected output:
```
✓ PostCSS config valid
```

### Step 4: Commit PostCSS configuration

```bash
git add postcss.config.cjs
git commit -m "feat: configure PostCSS pipeline

- Add postcss.config.cjs with exact Hugo configuration
- Configure postcss-import for src/lib/styles path
- Configure custom media queries (6 breakpoints + dark/light)
- Enable CSS nesting via postcss-preset-env
- Add autoprefixer
- Match Hugo PostCSS setup exactly"
```

---

## Task 3: Create styles directory structure

### Files
- Create: `src/lib/styles/` directory

### Step 1: Create styles directory

```bash
mkdir -p src/lib/styles
```

Expected: Directory created

### Step 2: Create placeholder CSS file

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/styles/style.css`:

```css
/* Main stylesheet entry point */
/* Will be populated in Batch 4 with Hugo CSS */

* {
	box-sizing: border-box;
}
```

### Step 3: Verify PostCSS processes the file

Create a test route that imports the CSS:

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/src/routes/+layout.svelte`:

```svelte
<script>
	import '$lib/styles/style.css';
</script>

<slot />
```

### Step 4: Test PostCSS pipeline

```bash
npm run dev
```

Expected: Dev server starts without PostCSS errors

### Step 5: Check browser console

Open http://localhost:5173/

Expected: No CSS errors in console

### Step 6: Stop dev server

Press Ctrl+C

### Step 7: Commit styles structure

```bash
git add src/lib/styles/style.css src/routes/+layout.svelte
git commit -m "feat: create styles directory and root layout

- Create src/lib/styles/style.css (placeholder)
- Create src/routes/+layout.svelte with global CSS import
- Verify PostCSS pipeline processes styles
- Ready for CSS migration in next batch"
```

---

## Task 4: Test PostCSS features

### Files
- Modify: `src/lib/styles/style.css`

### Step 1: Test CSS nesting

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/styles/style.css`:

```css
/* PostCSS pipeline test */

* {
	box-sizing: border-box;
}

/* Test CSS nesting */
.test-nesting {
	color: red;

	& p {
		color: blue;
	}
}

/* Test custom media */
@media (--dark) {
	body {
		background-color: #1a1a1a;
	}
}

@media (--small) {
	.responsive {
		width: 50%;
	}
}
```

### Step 2: Run build to verify PostCSS transforms

```bash
npm run build
```

Expected: Build completes without errors

### Step 3: Check build output

```bash
cat .svelte-kit/output/client/_app/immutable/assets/*.css | head -20
```

Expected: See transformed CSS (nested selectors expanded, custom media replaced with actual media queries)

### Step 4: Clean build

```bash
rm -rf .svelte-kit/
```

### Step 5: Reset style.css to placeholder

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/styles/style.css`:

```css
/* Main stylesheet entry point */
/* Will be populated in Batch 4 with Hugo CSS */

* {
	box-sizing: border-box;
}
```

### Step 6: Commit PostCSS verification

```bash
git add src/lib/styles/style.css
git commit -m "test: verify PostCSS pipeline

- Test CSS nesting transformation
- Test custom media query replacement
- Verify build output contains transformed CSS
- Reset to placeholder for Batch 4 migration"
```

---

## Batch 3 Complete!

**Verification checklist:**
- [ ] PostCSS plugins installed
- [ ] postcss.config.cjs created with Hugo configuration
- [ ] Custom media queries configured (6 breakpoints + dark/light)
- [ ] CSS nesting enabled
- [ ] src/lib/styles/ directory created
- [ ] Root layout imports global CSS
- [ ] PostCSS pipeline tested and working
- [ ] All changes committed to git

**Next**: Batch 4 - Migrate CSS files from Hugo to SvelteKit
