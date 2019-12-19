/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const ElectronReloadPlugin = require('webpack-electron-reload')({
  path: path.join(__dirname, './lib/main.js'),
});

module.exports = {
  entry: ['react-hot-loader/patch', './src/indexClient.tsx'],

  target: 'electron-main',

  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'public'),
  },

  // Enable sourcemaps for debugging webpack's output.
  devtool: 'source-map',

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: ['.ts', '.tsx', '.js', '.json'],
  },

  plugins: [new webpack.NamedModulesPlugin(), new webpack.HotModuleReplacementPlugin(), ElectronReloadPlugin()],

  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'ts-loader'.
      {
        test: /\.tsx?$/,
        loaders: ['react-hot-loader/webpack', 'awesome-typescript-loader'],
        exclude: path.resolve(__dirname, 'node_modules'),
        include: path.resolve(__dirname, 'src'),
      },
      // All output '.js' files will have any sourcemaps re-processed by 'source-map-loader'.
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
      // {
      //   test: /\.css$/,
      //   use: [
      //     'style-loader',
      //     { loader: 'css-loader', options: { importLoaders: 1 } },
      //     {
      //       loader: 'postcss-loader',
      //       options: {
      //         ident: 'postcss',
      //         plugins: [require('tailwindcss'), require('autoprefixer')],
      //       },
      //     },
      //   ],
      // },
    ],
  },

  devServer: {
    contentBase: './static',
    hot: true,
  },
};
