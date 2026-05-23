import adapter from "@sveltejs/adapter-cloudflare";
import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { mdsvex } from "mdsvex";
import rehypeSlug from "rehype-slug";
import { createHighlighter } from "shiki";

const highlighter = await createHighlighter({
  themes: ["github-dark", "github-light"],
  langs: [
    "typescript",
    "javascript",
    "html",
    "css",
    "json",
    "bash",
    "shell",
    "yaml",
    "markdown",
    "python",
    "go",
    "rust",
    "sql",
    "php",
    "ruby",
    "java",
    "c",
    "cpp",
    "csharp",
    "swift",
    "kotlin",
    "dockerfile",
    "nginx",
    "graphql",
    "vue",
    "svelte",
    "jsx",
    "tsx",
    "makefile",
    "make",
    "terraform",
    "hcl",
    "toml",
    "ini",
    "diff",
    "text",
    "dotenv",
    "properties",
    "xml",
    "scss",
    "less",
    "sass",
  ],
});

// Get list of loaded language IDs for fallback
const loadedLangs = highlighter.getLoadedLanguages();

/** @type {import('mdsvex').MdsvexOptions} */
const mdsvexOptions = {
  extensions: [".svx"],
  rehypePlugins: [rehypeSlug],
  highlight: {
    highlighter: async (code, lang) => {
      // Fallback to 'text' if language is not loaded
      const safeLang = lang && loadedLangs.includes(lang) ? lang : "text";
      const html = highlighter.codeToHtml(code, {
        lang: safeLang,
        themes: {
          light: "github-light",
          dark: "github-dark",
        },
      });
      return `{@html \`${html.replace(/`/g, "\\`").replace(/\$/g, "\\$")}\`}`;
    },
  },
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
  extensions: [".svelte", ".svx"],
  preprocess: [vitePreprocess(), mdsvex(mdsvexOptions)],
  kit: {
    adapter: adapter(),
    alias: {
      $content: "src/content",
      $components: "src/lib/components",
      $styles: "src/styles",
    },
  },
};

export default config;
