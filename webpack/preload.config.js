const plugins = require('./main.plugins');
const rules = require('./rules')('main');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  context: `${__dirname}/..`,
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: './src/renderer/preload.ts',
  output: {
    path: `${__dirname}/../dist`,
    filename: 'preload.js',
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx'],
  },
  target: 'electron-preload',
  node: {
    __dirname: true,
    __filename: true,
  },
};
