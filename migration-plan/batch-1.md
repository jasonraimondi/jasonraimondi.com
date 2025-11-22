# Recap

This is the first batch. We're starting the Hugo → SvelteKit migration.

# Batch 1: Initialize SvelteKit Project

## Task 1: Create new SvelteKit project structure

### Files
- Create: `sveltekit-temp/` (temporary directory)
- Will copy files back to main project after init

### Step 1: Initialize SvelteKit in temporary directory

```bash
cd /Users/jason/Code/jason/jasonraimondi.com-sv
npm create svelte@latest sveltekit-temp
```

When prompted, select:
- **Which Svelte app template?** → Skeleton project
- **Add type checking with TypeScript?** → Yes, using TypeScript syntax
- **Select additional options** →
  - [x] Add ESLint for code linting
  - [x] Add Prettier for code formatting
  - [x] Add Playwright for browser testing
  - [ ] Add Vitest for unit testing (skip for now)

Expected output:
```
✔ Which Svelte app template? › Skeleton project
✔ Add type checking with TypeScript? › Yes, using TypeScript syntax
✔ Select additional options › ESLint, Prettier, Playwright

Your project is ready!
```

### Step 2: Copy SvelteKit files to project root

```bash
# Copy core files
cp -r sveltekit-temp/src ./
cp sveltekit-temp/package.json ./package-sveltekit.json
cp sveltekit-temp/svelte.config.js ./
cp sveltekit-temp/vite.config.ts ./
cp sveltekit-temp/tsconfig.json ./tsconfig-sveltekit.json
cp sveltekit-temp/.eslintignore ./
cp sveltekit-temp/.eslintrc.cjs ./
cp sveltekit-temp/.prettierignore ./
cp sveltekit-temp/.prettierrc ./
cp sveltekit-temp/playwright.config.ts ./

# Copy gitignore additions (don't overwrite existing)
cat sveltekit-temp/.gitignore >> .gitignore
```

Expected: Files copied successfully, no errors

### Step 3: Clean up temporary directory

```bash
rm -rf sveltekit-temp
```

Expected: Directory removed

### Step 4: Verify SvelteKit structure

```bash
ls -la src/
```

Expected output:
```
src/
├── app.d.ts
├── app.html
├── lib/
│   └── index.ts
└── routes/
    └── +page.svelte
```

### Step 5: Commit initial SvelteKit structure

```bash
git add src/ svelte.config.js vite.config.ts tsconfig-sveltekit.json package-sveltekit.json .eslintrc.cjs .prettierrc playwright.config.ts .gitignore
git commit -m "feat: initialize SvelteKit project structure

- Add skeleton SvelteKit app with TypeScript
- Add ESLint, Prettier, Playwright configs
- Keep Hugo files intact alongside SvelteKit"
```

Expected: Clean commit with SvelteKit foundation

---

## Task 2: Install dependencies

### Files
- Modify: `package.json` (merge with existing)

### Step 1: Review package-sveltekit.json

```bash
cat package-sveltekit.json
```

Expected: See SvelteKit dependencies

### Step 2: Merge package.json files

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/package.json`:

Keep existing Hugo scripts and dependencies, add SvelteKit ones:

```json
{
  "name": "jasonraimondi.com",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "hugo:dev": "hugo serve -D",
    "hugo:build": "hugo --gc --cleanDestinationDir",
    "dev": "vite dev",
    "build": "vite build",
    "preview": "vite preview",
    "check": "svelte-kit sync && svelte-check --tsconfig ./tsconfig-sveltekit.json",
    "check:watch": "svelte-kit sync && svelte-check --tsconfig ./tsconfig-sveltekit.json --watch",
    "lint": "prettier --check . && eslint .",
    "format": "prettier --write .",
    "test:e2e": "playwright test",
    "create-resume": "ts-node ./resume-snapshotter.ts",
    "gen:resume": "start-server-and-test dev http://localhost:5173 create-resume"
  },
  "devDependencies": {
    "@playwright/test": "^1.51.1",
    "@sveltejs/adapter-auto": "^3.0.0",
    "@sveltejs/kit": "^2.0.0",
    "@sveltejs/vite-plugin-svelte": "^4.0.0",
    "@types/eslint": "^9.6.0",
    "autoprefixer": "^10.4.21",
    "cssnano": "^7.0.6",
    "eslint": "^9.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-svelte": "^2.36.0",
    "globals": "^15.0.0",
    "hugo-bin": "^0.142.0",
    "normalize.css": "^8.0.1",
    "postcss": "^8.5.3",
    "postcss-cli": "^11.0.1",
    "prettier": "^3.1.1",
    "prettier-plugin-svelte": "^3.1.2",
    "svelte": "^5.0.0",
    "svelte-check": "^4.0.0",
    "ts-node": "^10.9.2",
    "typescript": "^5.8.2",
    "vite": "^6.0.0"
  },
  "type": "module"
}
```

### Step 3: Install dependencies

```bash
npm install
```

Expected output:
```
added XXX packages, and audited YYY packages in ZZs

found 0 vulnerabilities
```

### Step 4: Verify SvelteKit works

```bash
npm run dev
```

Expected output:
```
  VITE v6.x.x  ready in XXX ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

### Step 5: Test in browser

Open http://localhost:5173/

Expected: See "Welcome to SvelteKit" page

### Step 6: Stop dev server

Press `Ctrl+C` in terminal

Expected: Server stops

### Step 7: Commit dependency setup

```bash
git add package.json package-lock.json
git commit -m "feat: add SvelteKit dependencies and scripts

- Install @sveltejs/kit, svelte 5, vite
- Add dev, build, preview scripts
- Keep Hugo scripts as hugo:dev and hugo:build
- Merge existing Hugo dependencies with SvelteKit ones"
```

Expected: Clean commit

---

## Task 3: Configure basic adapter

### Files
- Modify: `svelte.config.js`

### Step 1: Install Cloudflare adapter

```bash
npm install -D @sveltejs/adapter-cloudflare
```

Expected: Package installed

### Step 2: Update svelte.config.js

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/svelte.config.js`:

```javascript
import adapter from '@sveltejs/adapter-cloudflare';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),

	kit: {
		adapter: adapter({
			// Cloudflare Pages configuration
			routes: {
				include: ['/*'],
				exclude: ['<all>']
			}
		})
	}
};

export default config;
```

### Step 3: Test build

```bash
npm run build
```

Expected output:
```
vite v6.x.x building for production...
✓ XXX modules transformed.

.svelte-kit/cloudflare/ ...
✓ built in XXXms
```

### Step 4: Test preview

```bash
npm run preview
```

Expected output:
```
  ➜  Local:   http://localhost:4173/
```

Test in browser, then stop with Ctrl+C.

### Step 5: Clean build output

```bash
rm -rf .svelte-kit/
```

### Step 6: Update .gitignore

Add to `/Users/jason/Code/jason/jasonraimondi.com-sv/.gitignore`:

```
# SvelteKit
.svelte-kit/
build/
```

### Step 7: Commit adapter configuration

```bash
git add svelte.config.js .gitignore package.json package-lock.json
git commit -m "feat: configure Cloudflare adapter

- Install @sveltejs/adapter-cloudflare
- Configure adapter in svelte.config.js
- Add .svelte-kit to .gitignore
- Verify build and preview work"
```

Expected: Clean commit

---

## Batch 1 Complete!

**Verification checklist:**
- [ ] SvelteKit project initialized with TypeScript
- [ ] Dependencies installed successfully
- [ ] Dev server runs on http://localhost:5173/
- [ ] Build completes without errors
- [ ] Cloudflare adapter configured
- [ ] All changes committed to git

**Next**: Batch 2 - Configure mdsvex with Shiki syntax highlighting
