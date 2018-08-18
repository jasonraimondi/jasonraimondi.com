import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { resolve } from 'path';
import * as webpack from 'webpack';
import VueLoaderPlugin from 'vue-loader/lib/plugin';
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
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.tsx?$/,
        exclude: /node_modules/,
        use: [{
          loader: 'ts-loader',
          options: {
            appendTsSuffixTo: [/\.vue$/],
          }
        }],

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
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].package.css',
      chunkFilename: '[id].package.css',
    }),
  ],
};

export default config;
