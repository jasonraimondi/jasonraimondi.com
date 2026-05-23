<script lang="ts">
	interface Props {
		filePath: string;
	}

	let { filePath }: Props = $props();

	const repoUrl = 'https://github.com/jasonraimondi/jasonraimondi.com';
	const editUrl = $derived(`${repoUrl}/tree/main/src/content/${filePath}`);
</script>

<a class="edit-on-github" href={editUrl} target="_blank" rel="noopener">
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
		<path d="M12.3 3.7l4 4L4 20H0v-4L12.3 3.7zm1.4-1.4L16 0l4 4-2.3 2.3-4-4z" />
	</svg>
	<span>Improve this page</span>
</a>

<style>
	.edit-on-github {
		font-size: 0.8em;
		font-weight: 400;
		border-radius: 0.25em;
		display: inline-flex;
		align-self: start;
	}

	.edit-on-github svg {
		height: 1rem;
		margin-right: 0.5rem;
		fill: currentColor;
	}

	@media (--large) {
		.edit-on-github {
			margin-left: 1rem;
		}
	}
</style>
