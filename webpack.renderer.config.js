/* eslint global-require: off,no-console: off */
const path = require('path');
const { spawn } = require('child_process');
const detectPort = require('detect-port');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const tailwind = require('tailwindcss');
// const autoprefixer = require('autoprefixer');
const rules = require('./webpack.rules');
const plugins = require('./webpack.renderer.plugins');

const isDev = process.env.NODE_ENV === 'development';

const devServerPort = process.env.PORT || 1212;
const componentPort = 4000;
const publicPath = `http://localhost:${devServerPort}/`;

const startMain = () => {
  console.log('\nStarting Main Process...');

  spawn('yarn', ['dev:start-main'], {
    shell: true,
    env: process.env,
    stdio: 'inherit',
  })
    .on('close', code => process.exit(code))
    .on('error', spawnError => console.error(spawnError));
};

rules.push({
  test: /\.pcss$/,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true,
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

// const baseEntry = ['webpack/hot/dev-server'];
const baseEntry = [`webpack-dev-server/client?http://localhost:${devServerPort}/`, 'webpack/hot/only-dev-server'];

module.exports = {
  context: __dirname,
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: {
    renderer: [...baseEntry, './src/renderer/index.tsx'],
  },
  output: {
    path: `${__dirname}/dist`,
    publicPath,
    filename: `[name].${isDev ? 'dev' : 'prod'}.js`,
  },
  module: {
    rules,
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      'react-dom': '@hot-loader/react-dom',
    },
    //    modules: [path.join(__dirname, 'node_modules')],
  },
  target: 'electron-renderer',
  node: {
    __dirname: true,
    __filename: true,
  },
  devServer: {
    port: devServerPort,
    publicPath,
    compress: true,
    // stats: 'normal', // 'verbose',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: path.join(__dirname, 'static'),
    writeToDisk: true,
    watchOptions: {
      aggregateTimeout: 300,
      ignored: /node_modules/,
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    before(app, server, compiler) {
      if (process.env.START_HOT) {
        compiler.hooks.done.tap('StartMainProcessOnAvailablePort', () => {
          detectPort(componentPort, (err, availablePort) => {
            if (componentPort === availablePort) {
              startMain();
            }
          });
        });
      }
    },
  },
  // externals: [
  //   (context, request, callback) => {
  //     if (request[0] === '.' || request.includes('webpack-dev-server')) {
  //       callback();
  //     } else {
  //       callback(null, `require('${request}')`);
  //     }
  //   },
  // ],
};
