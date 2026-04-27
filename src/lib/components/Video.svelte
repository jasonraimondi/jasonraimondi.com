<script lang="ts">
	interface Props {
		mp4?: string;
		webm?: string;
		poster?: string;
		portrait?: boolean;
	}

	let { mp4, webm, poster, portrait = false }: Props = $props();
</script>

<div class="video-container" class:portrait>
	<video controls {poster}>
		{#if mp4}
			<source src={mp4} type="video/mp4" />
		{/if}
		{#if webm}
			<source src={webm} type="video/webm" />
		{/if}
		Your browser doesn't support HTML5 video tag.
	</video>
</div>

<style>
	.video-container {
		margin: 1.5rem 0;
	}

	.video-container video {
		width: 100%;
		max-width: 100%;
		height: auto;
		border-radius: 0.5rem;
	}

	.video-container.portrait video {
		max-width: 400px;
		margin: 0 auto;
		display: block;
	}
</style>
