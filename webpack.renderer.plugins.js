/* eslint global-require: off */
const { ProgressPlugin, HotModuleReplacementPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
// const WebpackHookPlugin = require('webpack-hook-plugin');

const plugins = [];
const isDev = process.env.NODE_ENV === 'development';
let templateParameters = {
  rendererSrc: './renderer.prod.js',
  stylesheetHref: './renderer.css',
};

if (isDev && process.env.START_HOT) {
  // const HtmlWebpackInjector = require('html-webpack-injector');
  const port = process.env.PORT || 1212;
  templateParameters = {
    rendererSrc: `http://localhost:${port}/renderer.dev.js`,
    stylesheetHref: `http://localhost:${port}/renderer.css`,
  };
  // plugins.push(
  //   new WebpackHookPlugin({
  //     onBuildEnd: ['yarn dev:start-main'],
  //   }),
  // );
}

plugins.push(
  new ProgressPlugin(),
  new HotModuleReplacementPlugin({ multiStep: true }),
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
    filename: isDev ? '[name].css' : '[name].[hash].css',
    chunkFilename: isDev ? '[id].css' : '[id].[hash].css',
  }),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.ejs',
    inject: false,
    alwaysWriteToDisk: true,
    templateParameters,
  }),
  new HtmlWebpackHarddiskPlugin(),
  // new HtmlWebpackInjector(),
);

module.exports = plugins;
