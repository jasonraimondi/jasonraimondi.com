import type { Thing } from '$lib/data/types';

export async function load() {
	const thingModules = import.meta.glob<{
		metadata: Thing;
	}>('/src/content/things/*.svx', { eager: true });

	const things: Thing[] = Object.entries(thingModules)
		.filter(([, module]) => module.metadata)
		.map(([path, module]) => {
			const slug = path.split('/').pop()?.replace('.svx', '') ?? '';
			return {
				...module.metadata,
				slug: module.metadata.slug ?? slug
			};
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	return { things };
}
