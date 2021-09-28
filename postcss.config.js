const { resolve } = require('path');
const { generateMediaQueries } = require('@jmondi/mobile-first');

module.exports = {
    plugins: {
        'postcss-import': {
            path: [resolve(__dirname, 'assets')],
        },
        'postcss-mixins': {},
        'postcss-nested': {},
        'postcss-custom-media': {
            importFrom: [{
                customMedia: {
                    '--light': '(prefers-color-scheme: light)',
                    '--dark': '(prefers-color-scheme: dark)',
                    ...generateMediaQueries({
                        xsmall: 420,
                        small: 640,
                        medium: 768,
                        large: 1024,
                        xlarge: 1280,
                        xxlarge: 1536,
                    }),
                },
            }],
        },
        autoprefixer: {},
    },
};
