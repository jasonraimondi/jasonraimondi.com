import { mediaQueries } from '../settings/variables';

export default (loader) => [
  require("postcss-import"),
  require('postcss-cssnext')({
    features: {
      customMedia: { extensions: mediaQueries },
    },
  }),
];
