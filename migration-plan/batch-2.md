# Recap

Batch 1 complete: SvelteKit initialized with Cloudflare adapter.

# Batch 2: Configure mdsvex with Shiki

## Task 1: Install mdsvex and Shiki

### Files
- Modify: `package.json`
- Create: `mdsvex.config.js`

### Step 1: Install packages

```bash
npm install -D mdsvex shiki
```

Expected output:
```
added 2 packages
```

### Step 2: Verify installation

```bash
npm list mdsvex shiki
```

Expected: See mdsvex@0.12.x and shiki@1.x.x

### Step 3: Commit dependency addition

```bash
git add package.json package-lock.json
git commit -m "feat: install mdsvex and shiki

- Add mdsvex for markdown preprocessing
- Add shiki for syntax highlighting"
```

---

## Task 2: Create mdsvex configuration

### Files
- Create: `mdsvex.config.js`

### Step 1: Create mdsvex config with Shiki

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/mdsvex.config.js`:

```javascript
import { defineMDSveXConfig as defineConfig } from 'mdsvex';
import { getHighlighter } from 'shiki';

/** @type {import('mdsvex').MdsvexOptions} */
const config = defineConfig({
	extensions: ['.md', '.svx'],

	smartypants: {
		dashes: 'oldschool'
	},

	highlight: {
		highlighter: async (code, lang = 'text') => {
			const highlighter = await getHighlighter({
				themes: ['github-dark', 'github-light'],
				langs: [
					'javascript',
					'typescript',
					'html',
					'css',
					'json',
					'bash',
					'shell',
					'python',
					'go',
					'rust',
					'sql',
					'yaml',
					'markdown',
					'svelte'
				]
			});

			const html = highlighter.codeToHtml(code, {
				lang,
				themes: {
					light: 'github-light',
					dark: 'github-dark'
				},
				defaultColor: false
			});

			return `{@html \`${html}\` }`;
		}
	},

	layout: {
		// Will create these layout components in later batches
		blog: './src/lib/layouts/BlogPost.svelte',
		_: './src/lib/layouts/Default.svelte'
	},

	remarkPlugins: [],
	rehypePlugins: []
});

export default config;
```

### Step 2: Verify config syntax

```bash
node -e "import('./mdsvex.config.js').then(() => console.log('✓ Config valid'))"
```

Expected output:
```
✓ Config valid
```

### Step 3: Commit mdsvex config

```bash
git add mdsvex.config.js
git commit -m "feat: configure mdsvex with Shiki highlighting

- Add mdsvex.config.js with Shiki highlighter
- Support .md and .svx extensions
- Configure dual themes (light/dark)
- Add common language support (JS, TS, Python, Go, etc.)
- Set up layout paths (will create in later batches)"
```

---

## Task 3: Integrate mdsvex with SvelteKit

### Files
- Modify: `svelte.config.js`

### Step 1: Update svelte.config.js

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';
import { mdsvex } from 'mdsvex';
import mdsvexConfig from './mdsvex.config.js';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Svelte file extensions to process
	extensions: ['.svelte', ...mdsvexConfig.extensions],

	// Preprocessors run in order
	preprocess: [
		vitePreprocess(),
		mdsvex(mdsvexConfig)
	],

	kit: {
		adapter: adapter({
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		})
	}
};

export default config;
```

### Step 2: Test mdsvex integration

Create a test markdown page:

```bash
cat > src/routes/test.md << 'EOF'
---
title: Test Page
---

# Hello from Markdown

This is a **test** of mdsvex.

## Code Block Test

```javascript
function hello() {
  console.log('Hello from Shiki!');
}
```
EOF
```

### Step 3: Start dev server

```bash
npm run dev
```

Expected: Server starts without errors

### Step 4: Test in browser

Open http://localhost:5173/test

Expected: See rendered markdown with syntax-highlighted code block

### Step 5: Verify syntax highlighting

Inspect the code block in browser DevTools.

Expected: See `<pre>` with `<code>` containing `<span>` elements with inline styles for syntax colors

### Step 6: Stop dev server

Press Ctrl+C

### Step 7: Remove test file

```bash
rm src/routes/test.md
```

### Step 8: Commit mdsvex integration

```bash
git add svelte.config.js
git commit -m "feat: integrate mdsvex with SvelteKit

- Add mdsvex to preprocessors in svelte.config.js
- Support .md and .svx extensions in SvelteKit
- Verify markdown rendering with Shiki highlighting works"
```

---

## Batch 2 Complete!

**Verification checklist:**
- [ ] mdsvex and shiki installed
- [ ] mdsvex.config.js created with Shiki highlighter
- [ ] svelte.config.js updated with mdsvex preprocessor
- [ ] Test markdown page renders correctly
- [ ] Syntax highlighting works with dual themes
- [ ] All changes committed to git

**Next**: Batch 3 - Set up PostCSS pipeline
