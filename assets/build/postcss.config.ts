import { mediaQueries, properties } from '../settings/variables';

export default (loader) => [
  require('postcss-cssnext')({
    features: {
      customProperties: { variables: properties },
      customMedia: { extensions: mediaQueries },
    },
  }),
];
