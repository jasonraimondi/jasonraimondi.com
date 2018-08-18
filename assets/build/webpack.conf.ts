import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import * as webpack from 'webpack';

import postCssConfig from './postcss.config';

const devMode = process.env.NODE_ENV !== 'production';
const assetsRoot = resolve(__dirname, '../');
const jekyllRoot = resolve(__dirname, '../../jekyll/');

const config: webpack.Configuration = {
  mode: devMode ? 'development' : 'production',
  devtool: devMode ? 'cheap-module-eval-source-map' : false,
  context: assetsRoot,
  entry: {
    'main': './src/main.ts',
  },
  output: {
    path: jekyllRoot + '/assets',
    filename: '[name].package.js',
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.json', '.scss'],
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: ['ts-loader'],
      },
      {
        test: /\.p?css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader',
          {
            loader: 'postcss-loader',
            options: {
              plugins: postCssConfig,
            },
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].package.css',
      chunkFilename: '[id].package.css',
    }),
  ],
};

export default config;
