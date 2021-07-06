/* eslint global-require: off, import/no-dynamic-require: off, no-console: off */
const { spawn } = require('child_process');
const { cwd } = require('process');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rules = require('./rules')('renderer');
const plugins = require('./renderer.plugins');

const isDev = process.env.NODE_ENV === 'development';
const devServerPort = process.env.PORT || 1212;

const publicPath = `http://localhost:${devServerPort}/`;
let subprocess = false;

const buildMain = () =>
  spawn('pnpm', ['dev:build-main'], {
    shell: true,
    env: process.env,
    stdio: 'inherit',
  }).on('error', (spawnError) => console.error(spawnError));

const startMain = () => {
  console.log('\nStarting Main Process...');

  subprocess = spawn('pnpm', ['dev:start-main'], {
    shell: true,
    env: process.env,
    stdio: 'inherit',
  })
    .on('close', (code) => {
      console.log('closing', code);
      if (!subprocess.killed) {
        // exit parent process if not about to restart
        process.exit(code);
      }
    })
    .on('error', (spawnError) => console.error(spawnError));
};

rules.push({
  test: /\.pcss$/,
  exclude: /node_modules/,
  use: [
    {
      loader: MiniCssExtractPlugin.loader,
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

const baseEntry = [`webpack-dev-server/client?http://localhost:${devServerPort}/`];

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
  cache: {
    type: 'filesystem',
    buildDependencies: {
      config: [__filename],
    },
  },
  plugins,
  resolve: {
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
    alias: {
      'electron': false,
      'electron-store': false,
    },
  },
  target: 'web',
  node: {
    __dirname: true,
    __filename: true,
  },
  devServer: {
    port: devServerPort,
    publicPath,
    compress: false,
    inline: true,
    lazy: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    contentBase: [`${__dirname}/../static`, `${__dirname}/../dll`],
    writeToDisk: true,
    watchOptions: {
      aggregateTimeout: 300,
      ignored: ['**/node_modules'],
      poll: 100,
    },
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    before(app, server, compiler) {
      let modifiedMain = false;
      compiler.hooks.watchRun.tap('StartMainProcess', ({ modifiedFiles }) => {
        if (modifiedFiles) {
          modifiedMain = Array.from(modifiedFiles).some((modifiedFilePath) =>
            modifiedFilePath.includes(`${cwd()}/src/main`),
          );
        }
      });
      compiler.hooks.done.tap('ManageMainProcess', () => {
        if (!subprocess) {
          // first run => start
          startMain();
        } else if (modifiedMain) {
          // already running & main files modified => restart
          subprocess.kill();
          buildMain().on('close', () => startMain());
        }
      });
    },
  },
};
