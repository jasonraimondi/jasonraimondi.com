type GlobEntry = {
  metadata: Post;
  default: unknown;
};

export interface Post {
  title: string;
  description: string;
  date: string;
  slug: string;
  draft?: boolean;
  categories: string[];
  tags: string[];
}

// Get all posts and add metadata
export const posts = Object.entries(import.meta.glob<GlobEntry>("/posts/**/*.md", { eager: true }))
  .map(([filepath, globEntry]) => {
    return {
      ...globEntry.metadata,

      isDraft: !!globEntry.metadata.draft,

      isIndexFile: filepath.endsWith("/index.md"),

      // generate the slug from the file path
      slug: filepath
        .replace(/(\/index)?\.md/, "")
        .split("/")
        .pop(),
    };
  })
  // sort by date
  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  // add references to the next/previous post
  .map((post, index, allPosts) => ({
    ...post,
    next: allPosts[index - 1] || 0,
    previous: allPosts[index + 1] || 0,
  }));
