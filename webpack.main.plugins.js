/* eslint global-require: off */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';

const plugins = [
  new CleanWebpackPlugin(),
  new BundleAnalyzerPlugin({ analyzerMode: 'static', openAnalyzer: !isDev }),
  new ForkTsCheckerWebpackPlugin({
    async: false,
  }),
];

module.exports = plugins;
