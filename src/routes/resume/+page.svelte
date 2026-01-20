<script lang="ts">
	import { base } from '$app/paths';
	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const resume = $derived(data.resume);
	const basics = $derived(resume.basics);

	function formatDate(dateStr: string): string {
		if (dateStr === 'present') return 'present';
		const date = new Date(dateStr);
		return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
	}

	function shouldHide(value: string | undefined): boolean {
		return !value || value.startsWith('__');
	}

	// Filter visible profiles (not starting with __)
	const visibleProfiles = $derived(basics.profiles.filter((p) => !p.network.startsWith('__')));

	// Group consecutive work entries by company for display
	function getWorkEntries() {
		const works = resume.work.filter((w) => !shouldHide(w.company));
		const entries: Array<{
			work: (typeof works)[0];
			prev: (typeof works)[0] | null;
			next: (typeof works)[0] | null;
			key: string;
		}> = [];

		for (let i = 0; i < works.length; i++) {
			entries.push({
				work: works[i],
				prev: i > 0 ? works[i - 1] : null,
				next: i < works.length - 1 ? works[i + 1] : null,
				key: `${works[i].company}-${works[i].startDate}`
			});
		}

		return entries;
	}

	const workEntries = $derived(getWorkEntries());
</script>

<svelte:head>
	<title>{basics.name}'s Resume</title>
	<meta name="description" content={basics.summary} />
	<meta property="og:title" content="{basics.name}'s Resume" />
	<meta property="og:description" content={basics.summary} />
	<meta property="og:type" content="profile" />
	<meta property="og:url" content="{basics.website}/resume/" />
</svelte:head>

<div id="resume" class="container center">
	<!-- Me Section -->
	<div id="me" class="resume-grid section">
		<div class="left-column">
			<h1 class="hidden">{basics.name}</h1>
			<p class="first name">
				<a href={basics.website} class="unstyled">Jason</a>
			</p>
		</div>

		<div class="main-column about-me">
			<p class="last name">
				<a href={basics.website} class="unstyled">Raimondi</a>
			</p>
			<h2 class="job-title">Senior Software Engineer</h2>
			<a href="{base}/resume.pdf" class="downloader" title="Download PDF Resume">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 30 30">
					<path
						d="M 15 1 C 14.448 1 14 1.448 14 2 L 14 6 L 16 6 L 16 2 C 16 1.448 15.552 1 15 1 z M 16 6 L 16 18.585938 L 18.292969 16.292969 C 18.683969 15.901969 19.316031 15.901969 19.707031 16.292969 C 20.098031 16.683969 20.098031 17.316031 19.707031 17.707031 L 15.707031 21.707031 C 15.512031 21.902031 15.256 22 15 22 C 14.744 22 14.487969 21.902031 14.292969 21.707031 L 10.292969 17.707031 C 9.9019687 17.316031 9.9019688 16.683969 10.292969 16.292969 C 10.683969 15.901969 11.316031 15.901969 11.707031 16.292969 L 14 18.585938 L 14 6 L 6 6 C 4.895 6 4 6.895 4 8 L 4 25 C 4 26.105 4.895 27 6 27 L 24 27 C 25.105 27 26 26.105 26 25 L 26 8 C 26 6.895 25.105 6 24 6 L 16 6 z"
					></path>
				</svg>
				<p>PDF</p>
			</a>
		</div>
	</div>

	<!-- Contact Section -->
	<div class="contact resume-grid section">
		<h3 class="left-column section-title contact">Contact</h3>
		<div class="main-column contact-section">
			<ul class="contact-details">
				<li class="email">
					<a href="mailto:jason@raimondi.us" class="unstyled">jason@raimondi.us</a>
				</li>
				<li class="web">
					<a href={basics.website} class="unstyled">{basics.website}</a>
				</li>
			</ul>
			<ul class="contact-external-links">
				{#each visibleProfiles as profile (profile.network)}
					<li>
						<a href={profile.url} target="_blank" rel="noopener">{profile.network}</a>
					</li>
				{/each}
			</ul>
		</div>
	</div>

	<!-- Summary Section -->
	{#if !shouldHide(basics.summary)}
		<section id="summary" class="section">
			<header class="resume-grid">
				<h3 class="left-column section-title">Summary</h3>
				<p class="main-column">{basics.summary}</p>
			</header>
		</section>
	{/if}

	<!-- Experience Section -->
	<section id="experiences" class="section">
		<header class="resume-grid">
			<h3 class="left-column section-title">Experience</h3>
		</header>

		{#each workEntries as { work, prev, next, key } (key)}
			<article
				class="resume-grid item"
				class:short-col={prev && work.company === prev.company}
			>
				<div class="left-column">
					{#if !prev || work.company !== prev.company}
						<p class="item-title">
							{#if work.website}
								<a href={work.website} target="_blank" rel="noopener">{work.company}</a>
							{:else}
								<span>{work.company}</span>
							{/if}
						</p>
						<p class="item-subtitle">{work.position}</p>
						<p class="item-date">
							{formatDate(work.startDate)} - {formatDate(work.endDate)}
						</p>

						{#if next && work.company === next.company}
							<p class="item-subtitle additional">{next.position}</p>
							<p class="item-date">
								{formatDate(next.startDate)} - {formatDate(next.endDate)}
							</p>
						{/if}
					{/if}
				</div>
				<ul class="main-column item-list">
					{#each work.highlights as highlight, idx (`${key}-highlight-${idx}`)}
						{#if !shouldHide(highlight)}
							<!-- eslint-disable-next-line svelte/no-at-html-tags -- Resume highlights contain markdown links from JSON -->
							<li>{@html highlight}</li>
						{/if}
					{/each}
				</ul>
			</article>
		{/each}
	</section>

	<!-- Education Section -->
	<section id="educations" class="section">
		<article class="resume-grid">
			<h3 class="left-column section-title"><strong>Education</strong></h3>
		</article>
		{#each resume.education as edu (edu.institution)}
			<article class="resume-grid">
				<div class="left-column">
					<p class="item-title">{edu.institution}</p>
					<p class="item-date">{formatDate(edu.endDate)}</p>
				</div>
				<div class="main-column">
					<p class="item-subtitle">{edu.area}</p>
					<p class="item-subtitle">{edu.studyType}</p>
				</div>
			</article>
		{/each}
	</section>

	<!-- Projects Section -->
	<section id="projects" class="projects print-hide section">
		<header class="resume-grid">
			<h3 class="left-column section-title">Projects</h3>
		</header>
		{#each resume.publications as pub (pub.name)}
			<article class="resume-grid item">
				<div class="left-column">
					{#if pub.website}
						<a class="item-title" href={pub.website} target="_blank" rel="noopener"
							>{pub.name}</a
						>
					{:else}
						<span class="item-title">{pub.name}</span>
					{/if}
					<p class="item-date">{formatDate(pub.releaseDate)}</p>
				</div>
				<ul class="main-column item-list">
					<li>
						{pub.summary}
						<br />
						<a class="small" href={pub.website}>{pub.website}</a>
					</li>
				</ul>
			</article>
		{/each}
	</section>

	<!-- Skills Section -->
	<ul id="skills" class="skills section">
		<li class="resume-grid">
			<h3 class="left-column section-title">Skills</h3>
		</li>
		{#each resume.skills as skill (skill.name)}
			<li class="resume-grid item">
				<h4 class="left-column item-title">{skill.name}</h4>
				<ul class="main-column skill-section-list">
					{#each skill.keywords as keyword (keyword)}
						<li class="skill-item">
							<a
								class="label"
								href="https://www.google.com/search?q={encodeURIComponent(keyword)}"
								target="_blank"
								rel="noopener">{keyword}</a
							>
						</li>
					{/each}
				</ul>
			</li>
		{/each}
	</ul>
</div>

<style>
	.hidden {
		position: absolute;
		width: 1px;
		height: 1px;
		padding: 0;
		margin: -1px;
		overflow: hidden;
		clip: rect(0, 0, 0, 0);
		border: 0;
	}
</style>
