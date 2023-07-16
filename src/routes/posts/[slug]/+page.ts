import type { PageLoadEvent } from "./$types";

export async function load({ data }: PageLoadEvent) {
  return {
    post: data.post,
  };
}
