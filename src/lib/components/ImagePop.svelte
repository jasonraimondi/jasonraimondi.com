<script lang="ts">
	import { fade, scale } from 'svelte/transition';

	interface Props {
		src: string;
		alt?: string;
		caption?: string;
		portrait?: boolean;
		nodesc?: boolean;
	}

	let { src, alt = '', caption, portrait = false, nodesc = false }: Props = $props();

	let isOpen = $state(false);

	const displayCaption = $derived(caption ?? alt);

	function openModal() {
		isOpen = true;
	}

	function closeModal() {
		isOpen = false;
	}

	function handleKeydown(event: KeyboardEvent) {
		if (event.key === 'Escape' && isOpen) {
			closeModal();
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === event.currentTarget) {
			closeModal();
		}
	}
</script>

<svelte:window onkeydown={handleKeydown} />

<div class="image-pop-container" class:portrait>
	<button type="button" class="image-pop-trigger" onclick={openModal}>
		<img {src} {alt} class="pops" loading="lazy" />
	</button>
	{#if !nodesc && displayCaption}
		<small class="image-pop-title">{displayCaption}</small>
	{/if}
</div>

{#if isOpen}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="lightbox-backdrop"
		transition:fade={{ duration: 200 }}
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
	>
		<div class="lightbox-content" transition:scale={{ duration: 200, start: 0.9 }}>
			<button type="button" class="lightbox-close" onclick={closeModal} aria-label="Close">
				<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
					<path
						d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"
					/>
				</svg>
			</button>
			<img {src} {alt} class="lightbox-image" />
			{#if displayCaption}
				<p class="lightbox-caption">{displayCaption}</p>
			{/if}
		</div>
	</div>
{/if}

<style>
	.image-pop-container {
		margin: 15px auto 30px;
	}

	.image-pop-container.portrait {
		@media (--large) {
			width: 55%;
			margin: 0;
			margin-right: 30%;
		}

		@media (--xlarge) {
			width: 50%;
			margin: 0;
			margin-right: 40%;
		}

		@media (--xxlarge) {
			margin: 0;
			margin-right: 50%;
		}
	}

	.image-pop-trigger {
		display: block;
		width: 100%;
		padding: 0;
		border: none;
		background: none;
		cursor: zoom-in;
	}

	.image-pop-title {
		font-style: italic;
		color: var(--color-gray-500);
	}

	.pops {
		max-width: 100%;
		width: 100%;
		transition: transform 200ms;
	}

	@media (--large) {
		.pops:hover {
			transform: scale(1.04);
		}
	}

	@media (--xlarge) {
		.pops:hover {
			transform: scale(1.06);
		}
	}

	@media (--xxlarge) {
		.pops:hover {
			transform: scale(1.1);
		}
	}

	@media (prefers-reduced-motion: reduce) {
		.pops {
			transition: none;
		}

		.pops:hover {
			transform: none;
		}
	}

	.lightbox-backdrop {
		position: fixed;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.9);
		display: flex;
		align-items: center;
		justify-content: center;
		z-index: 1000;
		padding: 1rem;
	}

	.lightbox-content {
		position: relative;
		max-width: 90vw;
		max-height: 90vh;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.lightbox-close {
		position: absolute;
		top: -40px;
		right: 0;
		width: 32px;
		height: 32px;
		padding: 4px;
		border: none;
		background: transparent;
		color: white;
		cursor: pointer;
		opacity: 0.8;
		transition: opacity 150ms;
	}

	.lightbox-close:hover {
		opacity: 1;
	}

	.lightbox-close svg {
		width: 100%;
		height: 100%;
	}

	.lightbox-image {
		max-width: 100%;
		max-height: 85vh;
		object-fit: contain;
		border-radius: 4px;
	}

	.lightbox-caption {
		margin-top: 1rem;
		color: white;
		font-size: 0.875rem;
		text-align: center;
		max-width: 600px;
	}
</style>
