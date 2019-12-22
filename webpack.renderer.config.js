/* eslint global-require: off */
const path = require('path');
const spawn = require('child_process').spawn;
const HtmlWebPackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const tailwind = require('tailwindcss');
// const autoprefixer = require('autoprefixer');
const rules = require('./webpack.rules');
const plugins = require('./webpack.renderer.plugins');

const isDev = process.env.NODE_ENV === 'development';

plugins.push(
  new HtmlWebPackPlugin({
    template: './public/index.html',
    filename: './index.html',
  }),
);

const port = process.env.PORT || 1212;
const publicPath = `http://localhost:${port}/dist`;

rules.push({
  test: /\.css$/,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
      },
    },
    {
      loader: 'css-loader',
      options: { importLoaders: 1, sourceMap: true },
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
      },
    },
    // {
    //   loader: 'postcss-loader',
    //   options: {
    //     ident: 'postcss',
    //     plugins: [tailwind, autoprefixer],
    //   },
    // },
  ],
});

const baseEntry = [`webpack-dev-server/client?http://localhost:${port}/`, 'webpack/hot/only-dev-server'];

module.exports = {
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: {
    renderer: [...baseEntry, './src/renderer/index.tsx'],
    styles: [...baseEntry, './src/renderer/css/tailwind.src.css'],
  },
  output: {
    publicPath: `http://localhost:${port}/dist/`,
    filename: '[name].dev.js',
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
  target: 'electron-renderer',
  node: {
    __dirname: false,
    __filename: false,
  },
  devServer: {
    port,
    publicPath,
    compress: true,
    noInfo: true,
    stats: 'errors-only',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'dist'),
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    before() {
      if (process.env.START_HOT) {
        console.log('Starting Main Process...');
        spawn('yarn', ['dev:start-main'], {
          shell: true,
          env: process.env,
          stdio: 'inherit',
        })
          .on('close', code => process.exit(code))
          .on('error', spawnError => console.error(spawnError));
      }
    },
  },
  // externals: [],
};
