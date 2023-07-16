import type { LoadEvent } from "@sveltejs/kit";

export const prerender = true;

export async function load({ fetch }: LoadEvent) {
  const res = await fetch("/resume.json");
  const resume = await res.json();
  return {
    resume,
  };
}
