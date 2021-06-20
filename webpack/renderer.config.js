/* eslint global-require: off, import/no-dynamic-require: off, no-console: off */
const { spawn } = require('child_process');
const detectPort = require('detect-port');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rules = require('./rules');
const plugins = require('./renderer.plugins');

const isDev = process.env.NODE_ENV === 'development';
const devServerPort = process.env.PORT || 1212;

const componentPort = 4000;
const publicPath = `http://localhost:${devServerPort}/`;

const startMain = () => {
  console.log('\nStarting Main Process...');

  spawn('pnpm', ['dev:start-main'], {
    shell: true,
    env: process.env,
    stdio: 'inherit',
  })
    .on('close', (code) => process.exit(code))
    .on('error', (spawnError) => console.error(spawnError));
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
  ],
});

rules.push({
  test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
  loader: 'url-loader',
  options: {
    limit: 8192,
  },
});

// const baseEntry = ['webpack/hot/dev-server'];
const baseEntry = [`webpack-dev-server/client?http://localhost:${devServerPort}/`, 'webpack/hot/only-dev-server'];

module.exports = {
  context: `${__dirname}/../`,
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: {
    renderer: [...baseEntry, `${__dirname}/../src/renderer/index.tsx`],
  },
  output: {
    path: `${__dirname}/../dist`,
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
  },
  target: 'electron-renderer',
  node: {
    __dirname: true,
    __filename: true,
  },
  devServer: {
    port: devServerPort,
    publicPath,
    compress: false,
    // stats: 'normal', // 'verbose',
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: [`${__dirname}/../static`, `${__dirname}/../dll`],
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
};
