import type { Post, Thing } from '$lib/data/types';
import type { RequestHandler } from './$types';

const SITE_URL = 'https://jasonraimondi.com';

function formatW3CDate(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toISOString().split('T')[0];
}

export const GET: RequestHandler = async () => {
	const postModules = import.meta.glob<{
		metadata: Post;
	}>('/src/content/posts/*.svx', { eager: true });

	const thingModules = import.meta.glob<{
		metadata: Thing;
	}>('/src/content/things/*.svx', { eager: true });

	const posts: Post[] = Object.entries(postModules).map(([path, module]) => {
		const slug = path.split('/').pop()?.replace('.svx', '') ?? '';
		return {
			...module.metadata,
			slug: module.metadata.slug ?? slug
		};
	});

	const things: Thing[] = Object.entries(thingModules).map(([path, module]) => {
		const slug = path.split('/').pop()?.replace('.svx', '') ?? '';
		return {
			...module.metadata,
			slug: module.metadata.slug ?? slug
		};
	});

	// Find most recent dates for list pages
	const mostRecentPostDate = posts.reduce((latest, post) => {
		const postDate = new Date(post.lastmod ?? post.date);
		return postDate > latest ? postDate : latest;
	}, new Date(0));

	const mostRecentThingDate = things.reduce((latest, thing) => {
		const thingDate = new Date(thing.date);
		return thingDate > latest ? thingDate : latest;
	}, new Date(0));

	const today = new Date().toISOString().split('T')[0];

	// Static pages
	const staticPages = [
		{ url: '', lastmod: today, priority: '1.0', changefreq: 'weekly' },
		{
			url: '/posts/',
			lastmod: formatW3CDate(mostRecentPostDate.toISOString()),
			priority: '0.9',
			changefreq: 'weekly'
		},
		{
			url: '/things/',
			lastmod: formatW3CDate(mostRecentThingDate.toISOString()),
			priority: '0.8',
			changefreq: 'monthly'
		},
		{ url: '/uses/', lastmod: today, priority: '0.6', changefreq: 'monthly' },
		{ url: '/resume/', lastmod: today, priority: '0.7', changefreq: 'monthly' }
	];

	const staticUrls = staticPages
		.map(
			(page) => `  <url>
    <loc>${SITE_URL}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`
		)
		.join('\n');

	const postUrls = posts
		.map(
			(post) => `  <url>
    <loc>${SITE_URL}/posts/${post.slug}/</loc>
    <lastmod>${formatW3CDate(post.lastmod ?? post.date)}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.8</priority>
  </url>`
		)
		.join('\n');

	const thingUrls = things
		.map(
			(thing) => `  <url>
    <loc>${SITE_URL}/things/${thing.slug}/</loc>
    <lastmod>${formatW3CDate(thing.date)}</lastmod>
    <changefreq>yearly</changefreq>
    <priority>0.7</priority>
  </url>`
		)
		.join('\n');

	const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticUrls}
${postUrls}
${thingUrls}
</urlset>`;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};

export const prerender = true;
