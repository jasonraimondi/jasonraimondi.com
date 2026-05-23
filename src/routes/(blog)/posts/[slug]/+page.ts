import type { Post } from "$lib/data/types";
import { error } from "@sveltejs/kit";
import type { Component } from "svelte";

export async function load({ params }) {
  const slug = params.slug;

  const postModules = import.meta.glob<{
    default: Component;
    metadata: Post;
  }>("/src/content/posts/*.svx", { eager: true });

  const postModule = Object.values(postModules).find(module => module.metadata?.slug === slug);

  if (!postModule) {
    error(404, `Post not found: ${slug}`);
  }

  const { default: content, metadata } = postModule;

  return {
    content,
    metadata: {
      ...metadata,
      slug: metadata.slug ?? slug,
    },
  };
}
