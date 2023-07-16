import remarkEmoji from "remark-emoji";
import remarkAbbr from "remark-abbr";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import { defineMDSveXConfig as defineConfig } from "mdsvex";

export default defineConfig({
  extensions: [".svelte.md", ".md", ".svx"],
  layout: {
    _: "./src/lib/layouts/default.svelte",
    center: "./src/lib/layouts/center.svelte",
    home: "./src/lib/layouts/home.svelte",
  },
  smartypants: {
    dashes: "oldschool",
  },
  remarkPlugins: [remarkAbbr, [remarkEmoji, { accessible: true }]],
  rehypePlugins: [rehypeSlug, rehypeAutolinkHeadings],
});
