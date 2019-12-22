/* eslint global-require: off */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';

const plugins = [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    generateStatsFile: true,
    openAnalyzer: !isDev,
    reportFilename: 'report.renderer.html',
    statsFilename: 'stats.renderer.json',
  }),
  new ForkTsCheckerWebpackPlugin({
    async: false,
  }),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
  }),
];

// if (isDev) {
//   const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
//   plugins.push(new ReactRefreshPlugin());
// }

module.exports = plugins;
