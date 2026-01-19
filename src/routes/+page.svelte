<script lang="ts">
	import AboutMe from '$lib/components/AboutMe.svelte';
	import RecentProjects from '$lib/components/RecentProjects.svelte';
	import projectsData from '$lib/data/projects.json';
</script>

<svelte:head>
	<title>Jason Raimondi</title>
	<meta
		name="description"
		content="My name is Jason Raimondi and I am a Full Stack Software Engineer based out of Los Angeles. My focus has been in web systems, building and deploying server and client web applications."
	/>
</svelte:head>

<AboutMe />
<RecentProjects projects={projectsData.projects} limit={16} />
