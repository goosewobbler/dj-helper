import webpack from 'webpack';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
// import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import HtmlWebpackHarddiskPlugin from 'html-webpack-harddisk-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
// import ElectronReloadPlugin from 'webpack-electron-reload';

const { ProgressPlugin } = webpack;
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
    stylesheetHref: './renderer.css',
  };
  plugins.push(
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new ReactRefreshWebpackPlugin(),
  );
} else {
  plugins.push(
    // TODO: re-enable bundle analysis after webpack conf rework
    // new BundleAnalyzerPlugin({
    //   analyzerMode: 'static',
    //   generateStatsFile: true,
    //   openAnalyzer: true,
    //   reportFilename: 'report.renderer.html',
    //   statsFilename: 'stats.renderer.json',
    // }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      runtime: false,
    }),
  );
}

plugins.push(
  new ProgressPlugin(),
  new ForkTsCheckerWebpackPlugin(),
  new HtmlWebpackPlugin({
    filename: 'index.html',
    template: 'src/index.ejs',
    inject: false,
    alwaysWriteToDisk: true,
    templateParameters,
  }),
  new HtmlWebpackHarddiskPlugin(),
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

export default plugins;
