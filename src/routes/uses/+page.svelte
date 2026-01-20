<script lang="ts">
	import Breadcrumbs from '$lib/components/Breadcrumbs.svelte';
	import TipBoard from '$lib/components/TipBoard.svelte';

	const breadcrumbItems = [{ label: 'Uses' }];

	const siteUrl = 'https://jasonraimondi.com';
	const pageUrl = `${siteUrl}/uses/`;
	const pageTitle = 'Uses | Jason Raimondi';
	const pageDescription = 'This page lists software and hardware I use on a daily basis.';
	const imageUrl = `${siteUrl}/covers/battlestation.jpg`;

	const jsonLdScript =
		'<script type="application/ld+json">' +
		JSON.stringify({
			'@context': 'https://schema.org',
			'@type': 'WebPage',
			name: pageTitle,
			description: pageDescription,
			url: pageUrl,
			image: imageUrl,
			isPartOf: {
				'@type': 'WebSite',
				name: 'Jason Raimondi',
				url: siteUrl
			}
		}) +
		'</' +
		'script>';
</script>

<svelte:head>
	<title>{pageTitle}</title>
	<meta name="description" content={pageDescription} />
	<link rel="canonical" href={pageUrl} />

	<!-- OpenGraph -->
	<meta property="og:title" content={pageTitle} />
	<meta property="og:description" content={pageDescription} />
	<meta property="og:type" content="website" />
	<meta property="og:url" content={pageUrl} />
	<meta property="og:site_name" content="Jason Raimondi" />
	<meta property="og:image" content={imageUrl} />

	<!-- Twitter Card -->
	<meta name="twitter:card" content="summary_large_image" />
	<meta name="twitter:title" content={pageTitle} />
	<meta name="twitter:description" content={pageDescription} />
	<meta name="twitter:image" content={imageUrl} />

	<!-- JSON-LD -->
	<!-- eslint-disable-next-line svelte/no-at-html-tags -- JSON-LD data is trusted -->
	{@html jsonLdScript}
</svelte:head>

<Breadcrumbs items={breadcrumbItems} />

<article class="single" itemscope itemtype="http://schema.org/WebPage">
	<header class="single--header">
		<h1 class="single--title" itemprop="name">Uses</h1>
	</header>

	<section class="single--post">
		<article class="single--post-body" itemprop="mainContentOfPage">
			<figure class="image-pop">
				<a href="/covers/battlestation.jpg" target="_blank" rel="noopener">
					<img src="/covers/battlestation.jpg" alt="Battlestation" loading="lazy" />
				</a>
			</figure>

			<h2>Self Hosted</h2>
			<ul>
				<li><a href="https://www.home-assistant.io/" rel="noopener">Home Assistant</a></li>
				<li><a href="https://jellyfin.media" rel="noopener">Jellyfin</a></li>
				<li><a href="https://gitea.io/en-us/" rel="noopener">Gitea</a></li>
				<li><a href="https://kno.wled.ge/" rel="noopener">WLED</a></li>
			</ul>

			<h2>Hardware</h2>
			<ul>
				<li>32-Inch 4K Monitor</li>
				<li>
					<a href="https://www.zsa.io/moonlander/" rel="noopener"
						>Moonlander Split Ergonomic Keyboard</a
					>
				</li>
				<li>
					<a
						href="https://divinikey.com/products/durock-silent-linear-switches?variant=32070435209281"
						rel="noopener">Durock Silent Linear Switches</a
					>
				</li>
			</ul>

			<h2>Dotfiles</h2>
			<p>
				Checkout the Repository:
				<a href="https://github.com/jasonraimondi/dotfiles" rel="noopener"
					>https://github.com/jasonraimondi/dotfiles</a
				>
			</p>

			<TipBoard>
				<pre><code
						>aws          &gt; amazon is taking over the world
bin          &gt; custom bin scripts
brew         &gt; homebrew all the things
config       &gt; for the noble apps using .config
dictionary   &gt; extend the macos dictionary
git          &gt; global git config and aliases
iterm2       &gt; iterm2 scripts
mise         &gt; mise for maintaining language versions
ssh          &gt; ssh config
tmux         &gt; tmux config
ubersicht    &gt; ubersicht widgets
vim          &gt; vim configs
zprezto      &gt; framework for Zsh
zsh          &gt; shell configuration</code
					></pre>
			</TipBoard>

			<h2>Layout</h2>
			<p>The greatest keyboards of all time.</p>

			<div class="keyboard-embed">
				<iframe
					src="https://configure.zsa.io/embed/moonlander/layouts/DwndN/latest/0"
					title="Moonlander keyboard layout"
					loading="lazy"
				></iframe>
			</div>

			<div class="keyboard-embed">
				<iframe
					src="https://configure.zsa.io/embed/voyager/layouts/4qQw3/latest/0"
					title="Voyager keyboard layout"
					loading="lazy"
				></iframe>
			</div>
		</article>
	</section>
</article>

<style>
	.image-pop {
		margin: 0 0 1.5rem 0;
	}

	.image-pop img {
		max-width: 100%;
		height: auto;
		border-radius: 4px;
	}

	.image-pop a {
		display: block;
	}

	.keyboard-embed {
		padding-top: 60%;
		position: relative;
		margin: 1.5rem 0;
	}

	.keyboard-embed iframe {
		border: 0;
		height: 100%;
		left: 0;
		position: absolute;
		top: 0;
		width: 100%;
		border-radius: 4px;
	}
</style>
