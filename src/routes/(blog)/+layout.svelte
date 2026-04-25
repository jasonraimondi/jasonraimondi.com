<script lang="ts">
	import { onMount } from 'svelte';
	import '../../styles/style.css';
	import Header from '$lib/components/Header.svelte';
	import Footer from '$lib/components/Footer.svelte';
	import { themeStore } from '$lib/stores/theme.svelte';

	let { children } = $props();

	onMount(() => {
		themeStore.initialize();
	});
</script>

<main class="container padded center">
	<Header />
	{@render children()}
	<Footer />
</main>
