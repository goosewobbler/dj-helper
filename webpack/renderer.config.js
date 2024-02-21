/* eslint no-console: off */
import { spawn } from 'child_process';
import { cwd } from 'process';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import TerserPlugin from 'terser-webpack-plugin';
import rules from './rules.js';
import plugins from './renderer.plugins.js';

const rendererRules = rules('renderer');
const isDev = process.env.NODE_ENV === 'development';
const devServerPort = process.env.PORT || 1212;
const publicPath = isDev ? `http://localhost:${devServerPort}/` : '/';
const spawnOpts = {
  shell: true,
  env: process.env,
  stdio: 'inherit',
};

let mainProcess;
let startingMainProcess = false;
let optimization = {};

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
        // process.exit(code);
      }
    })
    .on('error', (spawnError) => console.error(spawnError));
};

rendererRules.push({
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

rendererRules.push({
  test: /\.(png|jpe?g|gif|svg|eot|ttf|woff|woff2)$/i,
  type: 'asset/resource',
});

if (!isDev) {
  optimization = {
    minimizer: [
      new TerserPlugin({
        exclude: ['node_modules'],
      }),
    ],
    splitChunks: {
      cacheGroups: {
        styles: {
          name: 'renderer',
          type: 'css/mini-extract',
          chunks: 'all',
          enforce: true,
        },
      },
    },
    removeEmptyChunks: true,
  };
}

const baseEntry = isDev ? [`webpack-dev-server/client?http://localhost:${devServerPort}/`] : [];

export default {
  context: `${__dirname}/../`,
  mode: process.env.NODE_ENV,
  devtool: isDev ? 'inline-source-map' : 'source-map',
  entry: {
    renderer: [...baseEntry, `${__dirname}/../src/renderer/index.tsx`],
  },
  output: {
    path: `${__dirname}/../bundle`,
    publicPath,
    filename: `[name].${isDev ? 'dev' : 'prod'}.js`,
  },
  module: {
    rules: rendererRules,
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
  optimization,
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
    setupMiddlewares(middlewares, { compiler }) {
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

          buildMain().on('close', () => startMain());
        }
      });

      return middlewares;
    },
  },
};
