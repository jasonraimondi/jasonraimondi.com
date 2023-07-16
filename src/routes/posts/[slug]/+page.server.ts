import { error, type ServerLoadEvent } from "@sveltejs/kit";
import { readFile } from "fs/promises";

import { posts } from "$lib/posts";
import mdsvexConfig from "../../../../mdsvex.config";
import { compile } from "mdsvex";

import { fileURLToPath } from "url";
import { join } from "path";

const __dirname = fileURLToPath(new URL(".", import.meta.url));

export async function load({ params }: ServerLoadEvent) {
  const { slug } = params;

  // get post with metadata
  const post = posts.find(post => slug === post.slug);

  if (!post) {
    throw error(404, "Post not found");
  }

  let pathname = import.meta.env.PROD ? "../../../../../../../" : "../../../../";

  pathname = post.isIndexFile
    ? `${pathname}posts/${post.slug}/index.md`
    : `${pathname}posts/${post.slug}.md`;

  pathname = join(__dirname, pathname);

  const rawMarkdown = await readFile(pathname, "utf-8");
  const postWithContent = await compile(rawMarkdown, mdsvexConfig);

  if (!postWithContent) {
    throw error(404, "Post not found");
  }

  return {
    post: {
      ...post,
      fontmatter: postWithContent.data?.fm,
      content: fixHtmlCodeBlocks(postWithContent.code),
    },
  };
}

/**
 * @see https://github.com/pngwn/MDsveX/issues/392#issuecomment-1013755667
 */
function fixHtmlCodeBlocks(code: string) {
  return code
    .replace(/>{@html `<code class="language-/g, '><code class="language-')
    .replace(/<\/code>`}<\/pre>/g, "</code></pre>");
}
