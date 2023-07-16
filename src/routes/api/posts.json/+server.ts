import { json, type RequestEvent } from "@sveltejs/kit";
import { posts } from "$lib/posts";

export const prerender = true;

export async function GET(_: RequestEvent) {
  return json(posts);
}
