/* eslint global-require: off */
const plugins = require('./webpack.main.plugins');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: './src/main/index.ts',
  output: {
    path: `${__dirname}/dist`,
    filename: `main.${isDev ? 'dev' : 'prod'}.js`,
  },
  module: {
    rules: require('./webpack.rules'),
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {},
  },
  target: 'electron-main',
  node: {
    __dirname: false,
    __filename: false,
  },
  // node: {
  // child_process: 'empty',
  // fs: 'empty',
  // module: 'empty',
  // net: 'empty',
  // tls: 'empty',
  // },
  // externals: [],
};
