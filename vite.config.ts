import { defineConfig } from "vite";
import { sveltekit } from "@sveltejs/kit/vite";
import { imagetools } from "@zerodevx/svelte-img/vite";

export default defineConfig({
  plugins: [
    sveltekit(),
    imagetools({
      defaultDirectives: () => new URLSearchParams("?width=250;500&format=avif;webp;png"),
    }),
  ],
  assetsInclude: ["posts/**/*"],
  server: {
    fs: {
      allow: ["**/*"],
    },
  },
});
