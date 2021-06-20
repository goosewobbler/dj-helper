/* eslint global-require: off, no-console: off */
const { ProgressPlugin, HotModuleReplacementPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
// const DashboardPlugin = require('webpack-dashboard/plugin');

// TODO: check out dashboardPlugin again

const plugins = [];
const isDev = process.env.NODE_ENV === 'development';

let templateParameters = {
  rendererSrc: './renderer.prod.js',
  stylesheetHref: './renderer.css',
};

if (isDev && process.env.START_HOT) {
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
    //    new DashboardPlugin(),
  );
}

plugins.push(
  new ProgressPlugin(),
  new HotModuleReplacementPlugin(),
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
  new HardSourceWebpackPlugin(),
  new HardSourceWebpackPlugin.ExcludeModulePlugin([
    {
      test: /mini-css-extract-plugin[\\/]dist[\\/]loader/,
    },
  ]),
  new CopyWebpackPlugin({
    patterns: [
      {
        from: './src/local-push.js',
        to: '.',
      },
    ],
  }),
);

module.exports = plugins;
