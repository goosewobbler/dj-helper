/* eslint global-require: off */
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');

const plugins = [
  new ForkTsCheckerWebpackPlugin({
    async: false,
  }),
];

if (process.env.NODE_ENV === 'development') {
  const ReactRefreshPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
  plugins.push(new ReactRefreshPlugin());
}

module.exports = plugins;
