import url from 'node:url';
import path from 'node:path';
import plugins from './main.plugins.js';
import rules from './rules.js';

const mainRules = rules('main');
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));
const isDev = process.env.NODE_ENV === 'development';

export default {
  context: `${__dirname}/..`,
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: './src/main/index.ts',
  output: {
    path: `${__dirname}/../bundle`,
    filename: `main.${isDev ? 'dev' : 'prod'}.js`,
  },
  module: {
    rules: mainRules,
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
