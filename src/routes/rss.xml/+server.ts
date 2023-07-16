import * as config from "$lib/config";
import type { Post } from "$lib/types";
import type { RequestEvent } from "@sveltejs/kit";
import { json } from "@sveltejs/kit";

export const prerender = true;

export async function GET({ fetch }: RequestEvent) {
  // const response = await fetch("api/posts.json");
  // const posts: Post[] = await response.json();
  // const postsXml = posts.map(post => {
  //   return `
  //       <item>
  //           <title>${post.title}</title>
  //           <description>${post.description}</description>
  //           <link>${config.url}/${post.slug}</link>
  //           <guid isPermaLink="true">${config.url}/${post.slug}</guid>
  //           <pubDate>${new Date(post.date).toUTCString()}</pubDate>
  //       </item>
  //   `;
  // });
  // const headers = { "Content-Type": "application/xml" };
  // const xml = `
  // 	<rss xmlns:atom="http://www.w3.org/2005/Atom" version="2.0">
  // 		<channel>
  // 			<title>${config.title}</title>
  // 			<description>${config.description}</description>
  // 			<link>${config.url}</link>
  // 			<atom:link href="${config.url}/rss.xml" rel="self" type="application/rss+xml"/>
  // 			${postsXml.join("")}
  // 		</channel>
  // 	</rss>
  // `.trim();
  // const xml = ``;
  //
  // return new Response(xml, { headers });
  return json({});
}
