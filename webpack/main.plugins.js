/* eslint global-require: off */
const { ProgressPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const isDev = process.env.NODE_ENV === 'development';
const reportFiles = isDev ? ['src/**/*.{ts,tsx}'] : []; // in dev mode we only report type errors in source files

const plugins = [
  new ProgressPlugin(),
  new ForkTsCheckerWebpackPlugin({
    async: false,
    reportFiles,
  }),
];

if (!isDev) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: true,
      reportFilename: 'report.main.html',
      statsFilename: 'stats.main.json',
    }),
  );
}

module.exports = plugins;
