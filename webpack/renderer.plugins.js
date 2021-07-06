const { ProgressPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const plugins = [];
const isDev = process.env.NODE_ENV === 'development';

let templateParameters = {
  rendererSrc: './renderer.prod.js',
  stylesheetHref: './renderer.css',
};

if (isDev) {
  const port = process.env.PORT || 1212;
  templateParameters = {
    rendererSrc: `http://localhost:${port}/renderer.dev.js`,
    stylesheetHref: `http://localhost:${port}/renderer.css`,
  };
}

if (!isDev) {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: true,
      reportFilename: 'report.renderer.html',
      statsFilename: 'stats.renderer.json',
    }),
  );
}

plugins.push(
  new ProgressPlugin(),
  new ForkTsCheckerWebpackPlugin(),
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
  new ReactRefreshWebpackPlugin(),
);

module.exports = plugins;
