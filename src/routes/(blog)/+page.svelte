<script lang="ts">
	import AboutMe from '$lib/components/AboutMe.svelte';
	import RecentProjects from '$lib/components/RecentProjects.svelte';
	import projectsData from '$lib/data/projects.json';

	const siteUrl = 'https://jasonraimondi.com';
	const title = 'Jason Raimondi | Software Engineer';
	const description =
		'My name is Jason Raimondi and I am a Full Stack Software Engineer based out of Los Angeles. My focus has been in web systems, building and deploying server and client web applications.';
	const profileImage = `${siteUrl}/misc/me/zombie-ruby-trimmed@2x.png`;

	const jsonLdScript =
		'<script type="application/ld+json">' +
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'Person',
			name: 'Jason Raimondi',
			url: siteUrl,
			jobTitle: 'Software Engineer',
			sameAs: [
				'https://github.com/jasonraimondi',
				'https://www.linkedin.com/in/jasonraimondi/'
			],
			image: profileImage
		}) +
		'</' +
		'script>';
</script>

<svelte:head>
	<title>{title}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={siteUrl} />

	<!-- OpenGraph -->
	<meta property="og:title" content={title} />
	<meta property="og:description" content={description} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={siteUrl} />
	<meta property="og:image" content={profileImage} />
	<meta property="og:site_name" content="Jason Raimondi" />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary" />
	<meta name="twitter:title" content={title} />
	<meta name="twitter:description" content={description} />
	<meta name="twitter:image" content={profileImage} />

	<!-- JSON-LD -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD data is trusted -->
	{@html jsonLdScript}
</svelte:head>

<AboutMe />
<RecentProjects projects={projectsData.projects} limit={16} />
