import webpack from 'webpack';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
// const ElectronReloadPlugin = require('webpack-electron-reload');

const isDev = process.env.NODE_ENV === 'development';
const { ProgressPlugin, ContextReplacementPlugin } = webpack;
const plugins = [new ProgressPlugin(), new ForkTsCheckerWebpackPlugin()];

if (isDev) {
  plugins.push(
    new ContextReplacementPlugin(/electron-debug/), // kill electron-debug dynamic import warning
  );
} else {
  plugins
    .push
    // TODO: re-enable bundle analysis after webpack conf rework
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   generateStatsFile: true,
    //   openAnalyzer: true,
    //   reportFilename: 'report.main.html',
    //   statsFilename: 'stats.main.json',
    // }),
    // TODO: fix broken reload of app on main ts file update
    // ElectronReloadPlugin({
    //   path: path.join(__dirname, './bundle/main.dev.js'),
    // }),
    ();
}

export default plugins;
