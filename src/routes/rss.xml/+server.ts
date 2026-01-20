import type { Post } from '$lib/data/types';
import type { RequestHandler } from './$types';

const SITE_URL = 'https://jasonraimondi.com';
const SITE_TITLE = 'Jason Raimondi';
const SITE_DESCRIPTION =
	'My name is Jason Raimondi and I am a Full Stack Software Engineer based out of Los Angeles. My focus has been in web systems, building and deploying server and client web applications.';

function escapeXml(text: string): string {
	return text
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

function formatRFC822Date(dateStr: string): string {
	const date = new Date(dateStr);
	return date.toUTCString();
}

export const GET: RequestHandler = async () => {
	const postModules = import.meta.glob<{
		metadata: Post;
	}>('/src/content/posts/*.svx', { eager: true });

	const posts: Post[] = Object.entries(postModules)
		.map(([path, module]) => {
			const slug = path.split('/').pop()?.replace('.svx', '') ?? '';
			return {
				...module.metadata,
				slug: module.metadata.slug ?? slug
			};
		})
		.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

	const items = posts
		.map(
			(post) => `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${SITE_URL}/posts/${post.slug}/</link>
      <guid isPermaLink="true">${SITE_URL}/posts/${post.slug}/</guid>
      <description>${escapeXml(post.description)}</description>
      <pubDate>${formatRFC822Date(post.date)}</pubDate>
    </item>`
		)
		.join('\n');

	const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_TITLE)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <lastBuildDate>${formatRFC822Date(new Date().toISOString())}</lastBuildDate>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

	return new Response(rss, {
		headers: {
			'Content-Type': 'application/rss+xml; charset=utf-8',
			'Cache-Control': 'max-age=0, s-maxage=3600'
		}
	});
};

export const prerender = true;
