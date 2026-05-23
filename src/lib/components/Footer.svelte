<script lang="ts">
	import { base } from '$app/paths';
</script>

<footer class="footer">
	<h4 class="h2 footer--title">Follow Me Online Here:</h4>
	<ul class="footer--list">
		<li class="footer--list--item">
			<a href="https://github.com/jasonraimondi" target="_blank" rel="noopener">GitHub</a>
		</li>
		<li class="footer--list--item">
			<a href="https://linkedin.com/in/jasonraimondi" target="_blank" rel="noopener">LinkedIn</a>
		</li>
		<li class="footer--list--item">
			<a href="https://bugcrowd.com/jasonraimondi" target="_blank" rel="noopener">Bugcrowd</a>
		</li>
		<li class="footer--list--item">
			<a
				href="https://stackoverflow.com/users/5779440/jason-raimondi"
				target="_blank"
				rel="noopener">Stack Overflow</a
			>
		</li>
		<li class="footer--list--item">
			<a href="https://vimeo.com/jasonraimondi" target="_blank" rel="noopener">Vimeo</a>
		</li>
		<li class="footer--list--item">
			<a rel="noopener" href="https://indieweb.social/@jasonraimondi">Mastodon</a>
		</li>
		<li class="footer--list--item">
			<a rel="noopener" href="{base}/uses">Uses</a>
		</li>
	</ul>
</footer>

<style>
	.footer {
		margin-top: 1rem;
	}

	.footer--title {
		margin: 0 0 0.5em;
	}

	.footer--list {
		@media (--medium) {
			display: flex;
			flex-wrap: wrap;
		}
	}

	.footer--list--item {
		margin-right: 1em;
		margin-bottom: 0.5em;

		& a {
			font-weight: var(--font-bold);
		}
	}
</style>
