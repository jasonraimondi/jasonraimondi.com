import adapter from "@sveltejs/adapter-static";
import { vitePreprocess } from "@sveltejs/kit/vite";
import { mdsvex } from "mdsvex";
import mdsvexConfig from "./mdsvex.config.js";

/** @type {import('@sveltejs/kit').Config} */
const config = {
  // prettier-ignore
  extensions: [
    ".svelte",
    ...mdsvexConfig.extensions,
  ],

  // prettier-ignore
  preprocess: [
    vitePreprocess(),
    mdsvex(mdsvexConfig),
  ],

  kit: {
    adapter: adapter(),
    alias: {
      $resume: "./resume.json",
      $posts: "./posts",
      $assets: "./src/assets",
      $lib: "./src/lib",
      $styles: "./src/styles",
    },
  },
};

export default config;
