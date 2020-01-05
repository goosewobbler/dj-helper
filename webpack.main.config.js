/* eslint global-require: off */
const plugins = require('./webpack.main.plugins');
const rules = require('./webpack.rules');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  // context: __dirname,
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
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    // modules: [path.join(__dirname, 'node_modules')],
    // alias: {},
  },
  target: 'electron-main',
  node: {
    __dirname: true,
    __filename: true,
  },
  externals: [
    (context, request, callback) => {
      if (request[0] === '.') {
        callback();
      } else {
        callback(null, `require('${request}')`);
      }
    },
  ],
  // node: {
  // child_process: 'empty',
  // fs: 'empty',
  // module: 'empty',
  // net: 'empty',
  // tls: 'empty',
  // },
  // externals: [],
};
