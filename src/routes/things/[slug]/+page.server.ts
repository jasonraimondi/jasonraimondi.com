import type { Thing } from '$lib/data/types';
import { error } from '@sveltejs/kit';
import type { Component } from 'svelte';

export async function load({ params }) {
	const slug = params.slug;

	const thingModules = import.meta.glob<{
		default: Component;
		metadata: Thing;
	}>('/src/content/things/*.svx', { eager: true });

	const thingPath = `/src/content/things/${slug}.svx`;
	const thingModule = thingModules[thingPath];

	if (!thingModule) {
		error(404, `Thing not found: ${slug}`);
	}

	const { default: content, metadata } = thingModule;

	return {
		content,
		metadata: {
			...metadata,
			slug: metadata.slug ?? slug
		}
	};
}
