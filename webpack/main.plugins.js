const { ProgressPlugin, ContextReplacementPlugin } = require('webpack');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const ElectronReloadPlugin = require('webpack-electron-reload');

const isDev = process.env.NODE_ENV === 'development';

const plugins = [new ProgressPlugin(), new ForkTsCheckerWebpackPlugin()];

if (isDev) {
  plugins.push(
    new ContextReplacementPlugin(/electron-debug/), // kill electron-debug dynamic import warning
  );
} else {
  plugins.push(
    new BundleAnalyzerPlugin({
      analyzerMode: 'static',
      generateStatsFile: true,
      openAnalyzer: true,
      reportFilename: 'report.main.html',
      statsFilename: 'stats.main.json',
    }),
    // ElectronReloadPlugin({
    //   path: path.join(__dirname, './dist/main.dev.js'),
    // }),
  );
}

module.exports = plugins;
