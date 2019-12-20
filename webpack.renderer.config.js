/* eslint global-require: off */

// import tailwind from 'tailwindcss';
// import autoprefixer from 'autoprefixer';
const rules = require('./webpack.rules');

rules.push({
  test: /\.css$/,
  use: [
    'style-loader',
    { loader: 'css-loader', options: { importLoaders: 1 } },
    'postcss-loader',
    // {
    //   loader: 'postcss-loader',
    //   options: {
    //     ident: 'postcss',
    //     plugins: [tailwind, autoprefixer],
    //   },
    // },
  ],
});

module.exports = {
  entry: './src/renderer/index.tsx',
  output: {
    filename: './dist/renderer.prod.js',
  },
  module: {
    rules,
  },
  plugins: require('./webpack.plugins'),
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
  },
};
