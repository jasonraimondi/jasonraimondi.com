import type { Post } from "$lib/data/types";

export async function load() {
  const postModules = import.meta.glob<{
    metadata: Post;
  }>("/src/content/posts/*.svx", { eager: true });

  const posts: Post[] = Object.entries(postModules)
    .filter(([, module]) => module.metadata)
    .map(([path, module]) => {
      const slug = path.split("/").pop()?.replace(".svx", "") ?? "";
      return {
        ...module.metadata,
        slug: module.metadata.slug ?? slug,
      };
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return { posts };
}
