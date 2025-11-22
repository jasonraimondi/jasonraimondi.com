# Recap

Batch 8 complete: Nav component with mobile menu using $state rune.

# Batch 9: Create Footer Component

## Task 1: Create Footer component

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/components/Footer.svelte`:

```svelte
<script lang="ts">
	let currentYear = $derived(new Date().getFullYear());

	const socialLinks = [
		{ href: 'https://github.com/jasonraimondi', label: 'GitHub' },
		{ href: 'https://twitter.com/jasonraimondi', label: 'Twitter' },
		{ href: 'https://linkedin.com/in/jasonraimondi', label: 'LinkedIn' }
	];
</script>

<footer class="site-footer">
	<div class="footer-container">
		<p class="copyright">
			© {currentYear} Jason Raimondi
		</p>

		<ul class="social-links">
			{#each socialLinks as link}
				<li>
					<a href={link.href} target="_blank" rel="noopener noreferrer">
						{link.label}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</footer>
```

## Task 2: Add Footer to Default layout

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/layouts/Default.svelte`:

```svelte
<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	import Footer from '$lib/components/Footer.svelte';
	
	let { children } = $props();
</script>

<div class="site-wrapper">
	<Nav />
	<main class="content">
		{@render children()}
	</main>
	<Footer />
</div>
```

## Task 3: Commit Footer component

```bash
git add src/lib/components/Footer.svelte src/lib/layouts/Default.svelte
git commit -m "feat: create Footer component

- Add Footer with copyright and social links
- Use Svelte 5 \$derived rune for current year
- Include Footer in Default layout"
```

## Batch 9 Complete!

**Next**: Batch 10 - Create blog post dynamic route and template
