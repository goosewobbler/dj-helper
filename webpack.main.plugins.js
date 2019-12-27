/* eslint global-require: off */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';

const plugins = [
  new BundleAnalyzerPlugin({
    analyzerMode: 'static',
    generateStatsFile: true,
    openAnalyzer: !isDev,
    reportFilename: 'report.main.html',
    statsFilename: 'stats.main.json',
  }),
  new ForkTsCheckerWebpackPlugin({
    async: false,
  }),
];

if (isDev) {
  // const CopyPlugin = require('copy-webpack-plugin');
  // plugins.push(new CopyPlugin([{ from: './src/index.html', to: './index.html' }]));
}

module.exports = plugins;
