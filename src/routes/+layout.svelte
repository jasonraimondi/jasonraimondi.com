<script lang="ts">
	import { onMount } from 'svelte';
	import '../styles/style.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { themeStore } from '$lib/stores/theme';

	let { children } = $props();

	onMount(() => {
		themeStore.initialize();
	});
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

<main class="container padded center">
	<Header />
	{@render children()}
	<Footer />
</main>
