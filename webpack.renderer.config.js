/* eslint global-require: off */
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const tailwind = require('tailwindcss');
// const autoprefixer = require('autoprefixer');
const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

plugins.push(
  new HtmlWebPackPlugin({
    template: './public/index.html',
    filename: './index.html',
  }),
);

rules.push({
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: process.env.NODE_ENV === 'development',
      },
    },
    {
      loader: 'css-loader',
      options: { importLoaders: 1, sourceMap: true },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
    // {
    //   loader: 'postcss-loader',
    //   options: {
    //     ident: 'postcss',
    //     plugins: [tailwind, autoprefixer],
    //   },
    // },
  ],
});

module.exports = {
  mode: process.env.NODE_ENV,
  entry: {
    app: './src/renderer/index.tsx',
    // styles: './src/renderer/css/tailwind.src.css',
  },
  output: {
    path: `${__dirname}/dist`,
    filename: '[name].prod.js',
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
