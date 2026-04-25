<script lang="ts">
	let { children } = $props();
</script>

<svelte:head>
	<!-- Global Meta -->
	<meta name="author" content="Jason Raimondi <jason@raimondi.us>" />
	<meta name="theme-color" content="#10b981" media="(prefers-color-scheme: light)" />
	<meta name="theme-color" content="#8b5cf6" media="(prefers-color-scheme: dark)" />

	<!-- Favicons -->
	<link rel="icon" href="/favicon.ico" />

	<!-- RSS Feed -->
	<link rel="alternate" type="application/rss+xml" title="Jason Raimondi" href="/rss.xml" />

	<!-- Fonts -->
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
</svelte:head>

{@render children()}
