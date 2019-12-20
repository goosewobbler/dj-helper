/* eslint global-require: off */
module.exports = {
  /**
   * This is the main entry point for your application, it's the first file
   * that runs in the main process.
   */
  entry: './src/main/index.ts',
  output: {
    filename: './dist/main.prod.js',
  },
  module: {
    rules: require('./webpack.rules'),
  },
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    alias: {
      'rx.virtualtime': 'empty',
      // uws$: path.resolve(__dirname, 'path/to/file.js')
    },
  },
  node: {
    child_process: 'empty',
    fs: 'empty',
    module: 'empty',
    net: 'empty',
    tls: 'empty',
  },
};
