const { ProgressPlugin } = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackHarddiskPlugin = require('html-webpack-harddisk-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
// const ElectronReloadPlugin = require('webpack-electron-reload');

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
  plugins
    .push
    // TODO: re-enable bundle analysis after webpack conf rework
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   generateStatsFile: true,
    //   openAnalyzer: true,
    //   reportFilename: 'report.renderer.html',
    //   statsFilename: 'stats.renderer.json',
    // }),
    ();
}

plugins.push(
  new ProgressPlugin(),
  new ForkTsCheckerWebpackPlugin(),
  new MiniCssExtractPlugin({
    filename: '[name].css',
    chunkFilename: '[id].css',
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
  new CopyPlugin({
    patterns: [
      {
        from: 'static/*',
        to: './[name][ext]',
      },
    ],
  }),
  // TODO: fix broken reload of app on main ts file update
  // ElectronReloadPlugin(),
);

module.exports = plugins;
