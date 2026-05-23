<script lang="ts">
	import type { Project } from '$lib/data/types';
	import { base } from '$app/paths';

	interface Props {
		projects: Project[];
		limit?: number;
	}

	let { projects, limit = 16 }: Props = $props();

	const displayProjects = $derived(projects.slice(0, limit));

	function isExternal(url: string): boolean {
		return url.startsWith('http://') || url.startsWith('https://');
	}

	function getHref(url: string): string {
		if (isExternal(url)) {
			return url;
		}
		return `${base}${url}`;
	}
</script>

<div class="recent-projects">
	<h3 class="recent-projects--title">Fun Projects:</h3>
	<ul class="recent-projects--list">
		{#each displayProjects as project (project.name)}
			<li class="recent-projects--list--item">
				&rarr;
				{#if isExternal(project.url)}
					<a href={project.url} target="_blank" rel="noopener">{project.emoji} {project.name}</a>
				{:else}
					<a href={getHref(project.url)}>{project.emoji} {project.name}</a>
				{/if}
				{#if project.description}- {project.description}{/if}
			</li>
		{/each}
	</ul>
</div>

<style>
	.recent-projects {
		margin: 1em 0 2em;
	}

	.recent-projects--title {
		margin: 0 0 1em;
	}

	.recent-projects--list {
		display: flex;
		flex-direction: column;
		gap: 0.75em;
	}

	.recent-projects--list--item {
		& a {
			font-size: 1.1em;
			font-weight: var(--font-bold);
		}
	}
</style>
