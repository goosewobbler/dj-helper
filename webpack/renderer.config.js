/* eslint no-console: off */
const { spawn } = require('child_process');
const { cwd } = require('process');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const rules = require('./rules')('renderer');
const plugins = require('./renderer.plugins');

const isDev = process.env.NODE_ENV === 'development';
const devServerPort = process.env.PORT || 1212;
const publicPath = `http://localhost:${devServerPort}/`;
const spawnOpts = {
  shell: true,
  env: process.env,
  stdio: 'inherit',
};

let mainProcess;
let startingMainProcess = false;

const buildMain = () =>
  spawn('pnpm', ['dev:build:main'], spawnOpts).on('error', (spawnError) => console.error(spawnError));

const startMain = () => {
  console.log('\nStarting Main Process...');

  mainProcess = spawn('pnpm', ['dev:start'], spawnOpts)
    .on('spawn', () => {
      startingMainProcess = false;
    })
    .on('exit', (code) => {
      console.log('received close', code);
      if (!startingMainProcess) {
        // can exit parent process if main is not about to restart
        process.exit(code);
      }
    })
    .on('error', (spawnError) => console.error(spawnError));
};

rules.push({
  test: /\.p*css$/,
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
  type: 'asset/resource',
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
    compress: false,
    hot: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    devMiddleware: {
      publicPath,
      writeToDisk: true,
    },
    static: [
      {
        directory: `${__dirname}/../static`,
        watch: {
          aggregateTimeout: 300,
          ignored: ['**/node_modules'],
          poll: 100,
        },
      },
      {
        directory: `${__dirname}/../dll`,
        watch: {
          aggregateTimeout: 300,
          ignored: ['**/node_modules'],
          poll: 100,
        },
      },
    ],
    historyApiFallback: {
      verbose: true,
      disableDotRule: false,
    },
    onBeforeSetupMiddleware({ compiler }) {
      let requiresRestart = false;
      compiler.hooks.watchRun.tap('ElectronDevServerManagement', ({ modifiedFiles }) => {
        if (modifiedFiles) {
          requiresRestart = Array.from(modifiedFiles).some(
            (modifiedFilePath) =>
              modifiedFilePath.includes(`${cwd()}/src/main`) || modifiedFilePath.includes(`${cwd()}/src/renderer`),
          );
          // if (requiresRestart) {

          //   console.log('killing main');

          //   // mainProcess.kill('SIGSTOP');
          //   // process.exit(0);
          // }
        }
      });
      compiler.hooks.done.tap('ElectronDevServerManagement', () => {
        console.log('compile complete', requiresRestart, typeof mainProcess, mainProcess);
        if (!mainProcess) {
          // first run => start main process
          console.log('first run');
          startingMainProcess = true;
          startMain();
        } else if (requiresRestart) {
          console.log('restarting', mainProcess.exitCode);
          // process.kill(mainProcess.pid);
          startingMainProcess = true;
          // already running & main files modified => restart

          // buildMain().on('close', () => startMain());
        }
      });
    },
  },
};
