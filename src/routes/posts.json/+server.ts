import { json } from "@sveltejs/kit";
import { posts } from "$lib/posts";

export const prerender = true;

export async function GET() {
  return json(posts);
}
