import plugins from './main.plugins.js';
import rules from './rules.js';

const mainRules = rules('main');
const isDev = process.env.NODE_ENV === 'development';

export default {
  context: `${__dirname}/..`,
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: './src/renderer/preload.ts',
  output: {
    path: `${__dirname}/../bundle`,
    filename: 'preload.js',
  },
  module: {
    rules: mainRules,
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
