const plugins = require('./main.plugins');
const rules = require('./rules')('main');

const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  context: `${__dirname}/..`,
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: './src/main/index.ts',
  output: {
    path: `${__dirname}/../dist-src`,
    filename: `main.${isDev ? 'dev' : 'prod'}.js`,
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
  },
  target: 'electron-main',
  node: {
    __dirname: true,
    __filename: true,
  },
};
