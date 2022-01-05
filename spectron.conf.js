const { join } = require('path');
const fs = require('fs');

const packageJson = JSON.parse(fs.readFileSync('./package.json'));
const {
  build: { productName },
} = packageJson;

const config = {
  services: [
    [
      'electron',
      {
        appPath: join(__dirname, 'dist'),
        appName: productName,
        chromedriver: {
          port: 9519,
          logFileName: 'wdio-chromedriver.log',
        },
        // args: ['--silent'],
      },
    ],
  ],
  // hostname: '127.0.0.1',
  port: 9515,
  waitforTimeout: 5000,
  connectionRetryCount: 10,
  connectionRetryTimeout: 30000,
  logLevel: 'debug',
  runner: 'local',
  outputDir: 'all-logs',
  specs: ['./test/e2e/*.spec.ts'],
  autoCompileOpts: {
    autoCompile: true,
    // see https://github.com/TypeStrong/ts-node#cli-and-programmatic-options
    // for all available options
    tsNodeOpts: {
      transpileOnly: true,
      files: true,
      // moduleTypes: {
      //   // WDIO doesn't currently support ESM
      //   '*.conf.ts': 'cjs',
      //   '*.spec.ts': 'cjs',
      // },
      project: './tsconfig.json',
    },
    // tsconfig-paths is only used if "tsConfigPathsOpts" are provided, if you
    // do please make sure "tsconfig-paths" is installed as dependency
    tsConfigPathsOpts: {
      baseUrl: './',
    },
  },
  framework: 'mocha',
};

module.exports = { config };
