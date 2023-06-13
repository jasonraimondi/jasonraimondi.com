const {resolve} = require("path");

module.exports = {
  plugins: {
    "postcss-import": {
      path: [resolve(__dirname, "assets")],
    },
    "postcss-mixins": {},
    "postcss-custom-media-generator": {
      "--light": "prefers-color-scheme: light",
      "--dark": "prefers-color-scheme: dark",
      xsmall: 420,
      small: 640,
      medium: 768,
      large: 1024,
      xlarge: 1280,
      xxlarge: 1536,
    },
    "postcss-preset-env": {
      stage: 2,
      features: {
        "nesting-rules": true,
      },
    },
    cssnano: { preset: ["default"] },
  },
};
