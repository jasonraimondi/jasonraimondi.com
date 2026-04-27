<script lang="ts">
	import { page } from '$app/stores';
	import { base } from '$app/paths';
	import ThemeToggle from './ThemeToggle.svelte';

	const isHome = $derived($page.url.pathname === '/');
</script>

<nav class="top-bar">
	<a class="avatar" href="{base}/">
		<picture>
			<source
				srcset="/misc/me/zombie-avatar.webp, /misc/me/zombie-avatar@2x.webp 2x"
				type="image/webp"
			/>
			<img src="/misc/me/zombie-avatar.webp" alt="Jason Raimondi" />
		</picture>
	</a>

	<ul class="top-bar--nav">
		{#if !isHome}
			<li>
				<h2 class="top-bar--title">
					<a href="{base}/" class="unstyled">Jason Raimondi</a>
				</h2>
			</li>
		{/if}
		<li>
			<ul class="topbar--nav--itemlist">
				<li class="mr-2"><a href="{base}/posts">Posts</a></li>
				<li class="mr-2"><a href="{base}/things">Apps</a></li>
				<li class="mr-2"><a href="{base}/uses">Uses</a></li>
				<li>
					<a href="{base}/resume" class="mr-1">Resume</a>
					<a href="{base}/resume.pdf" class="label" target="_blank"><span>pdf</span></a>
					<a href="{base}/resume.json" class="label" target="_blank"><span>json</span></a>
				</li>
				<li>
					<ThemeToggle />
				</li>
			</ul>
		</li>
	</ul>
</nav>
