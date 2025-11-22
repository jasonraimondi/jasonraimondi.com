# Recap

Batch 7 complete: Base layout component created.

# Batch 8: Create Nav Component with Mobile Menu

## Task 1: Create Nav component with $state rune

Create `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/components/Nav.svelte`:

```svelte
<script lang="ts">
	import { page } from '$app/stores';

	// Mobile menu state using Svelte 5 $state rune
	let mobileMenuOpen = $state(false);

	function toggleMobileMenu() {
		mobileMenuOpen = !mobileMenuOpen;
	}

	function closeMobileMenu() {
		mobileMenuOpen = false;
	}

	// Navigation items
	const navItems = [
		{ href: '/', label: 'Home' },
		{ href: '/posts', label: 'Posts' },
		{ href: '/things', label: 'Things' },
		{ href: '/resume', label: 'Resume' },
		{ href: '/uses', label: 'Uses' }
	];
</script>

<nav class="main-nav">
	<div class="nav-container">
		<a href="/" class="site-title">Jason Raimondi</a>

		<!-- Mobile menu toggle -->
		<button
			class="mobile-menu-toggle"
			onclick={toggleMobileMenu}
			aria-label="Toggle menu"
		>
			{mobileMenuOpen ? '✕' : '☰'}
		</button>

		<!-- Desktop nav -->
		<ul class="nav-links desktop-nav">
			{#each navItems as item}
				<li>
					<a
						href={item.href}
						class:active={$page.url.pathname === item.href}
					>
						{item.label}
					</a>
				</li>
			{/each}
		</ul>

		<!-- Mobile nav -->
		{#if mobileMenuOpen}
			<ul class="nav-links mobile-nav">
				{#each navItems as item}
					<li>
						<a
							href={item.href}
							onclick={closeMobileMenu}
							class:active={$page.url.pathname === item.href}
						>
							{item.label}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</nav>
```

## Task 2: Update Default layout to include Nav

Edit `/Users/jason/Code/jason/jasonraimondi.com-sv/src/lib/layouts/Default.svelte`:

```svelte
<script lang="ts">
	import Nav from '$lib/components/Nav.svelte';
	
	let { children } = $props();
</script>

<div class="site-wrapper">
	<Nav />
	<main class="content">
		{@render children()}
	</main>
</div>
```

## Task 3: Commit Nav component

```bash
git add src/lib/components/Nav.svelte src/lib/layouts/Default.svelte
git commit -m "feat: create Nav component with mobile menu

- Add Nav component using Svelte 5 \$state rune
- Implement mobile menu toggle functionality
- Add active link highlighting
- Include Nav in Default layout"
```

## Batch 8 Complete!

**Next**: Batch 9 - Create Footer component
