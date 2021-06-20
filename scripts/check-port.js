// @flow
const chalk = require('chalk'); // eslint-disable-line
const detectPort = require('detect-port'); // eslint-disable-line

(() => {
  const port = process.env.PORT || '1212';

  detectPort(port, (err, availablePort) => {
    if (port !== String(availablePort)) {
      throw new Error(
        chalk.whiteBright.bgRed.bold(
          `Port "${port}" on "localhost" is already in use. Please use another port. ex: PORT=4343 pnpm dev`,
        ),
      );
    } else {
      process.exit(0);
    }
  });
})();
