import autoprefixer from "autoprefixer";
import cssnano from "cssnano";
import { dirname, resolve } from "path";
import postcssCustomMediaGenerator from "postcss-custom-media-generator";
import postcssImport from "postcss-import";
import postcssMixins from "postcss-mixins";
import postcssPresetEnv from "postcss-preset-env";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const plugins = [
  postcssImport({
    path: [resolve(__dirname, "src/styles")],
  }),
  postcssMixins({
    mixinsDir: resolve(__dirname, "src/styles/_shared"),
  }),
  postcssCustomMediaGenerator({
    "--light": "prefers-color-scheme: light",
    "--dark": "prefers-color-scheme: dark",
    xsmall: 420,
    small: 640,
    medium: 768,
    large: 1024,
    xlarge: 1280,
    xxlarge: 1536,
  }),
  postcssPresetEnv({
    stage: 1,
    features: {
      "nesting-rules": true,
      "custom-media-queries": true,
    },
  }),
  autoprefixer(),
];

if (process.env.NODE_ENV === "production") {
  plugins.push(cssnano({ preset: ["default"] }));
}

export default { plugins };
