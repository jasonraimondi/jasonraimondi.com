<script lang="ts">
	import '../../styles/resume.css';

	let { children } = $props();

	$effect(() => {
		document.documentElement.classList.add('layout-resume');
		return () => document.documentElement.classList.remove('layout-resume');
	});
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link
		href="https://fonts.googleapis.com/css2?family=Inter:wght@300;500;700;900&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

{@render children()}
