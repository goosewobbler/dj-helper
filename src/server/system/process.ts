import chalk from 'chalk';
import { exec, spawn } from 'child_process';
import stripAnsi from 'strip-ansi';
import { log as consoleLog } from '../helpers/console';
import { ProcessSystem } from '../../common/types';

const MESSAGE_REPLACE_PATTERN = /.*\[\d\d\d\] http.+( {.+})$/;

const trim = (s: string | Buffer): string => stripAnsi(s.toString()).trim();

const getStatusCode = (message: string): string => {
  const MESSAGE_STATUS_CODE_PATTERN = /\[(\d\d\d)\]/;
  const statusMatches = MESSAGE_STATUS_CODE_PATTERN.exec(message);
  if (!statusMatches) {
    return null;
  }
  return statusMatches[1];
};

interface MessageDetails {
  title?: string;
  body: string;
  colour: (message: string) => void;
}

const getMessageDetails = (message: string): MessageDetails => {
  const MESSAGE_TITLE_PATTERN = /^(\[[^\]]+\]) .+/;
  const TITLE_COLOURS = [chalk.blue, chalk.magenta, chalk.cyan, chalk.yellow, chalk.white];
  const titleMatches = MESSAGE_TITLE_PATTERN.exec(message);
  const assignedTitleColours: { [key: string]: MessageDetails['colour'] } = {};
  let nextColour = 0;
  if (!titleMatches) {
    return {
      body: message,
      colour: TITLE_COLOURS[0],
    };
  }
  const title = titleMatches[1];
  if (title && !(title in assignedTitleColours)) {
    assignedTitleColours[title] = TITLE_COLOURS[nextColour % TITLE_COLOURS.length];
    nextColour += 1;
  }
  const colour = assignedTitleColours[title];
  const body = message.substr(title.length + 1);
  return {
    title,
    body,
    colour,
  };
};

const log = (message: string): void => {
  const removeMatches = MESSAGE_REPLACE_PATTERN.exec(message);
  const shortMessage = trim(removeMatches ? message.replace(removeMatches[1], '') : message);

  if (shortMessage) {
    const statusCode = getStatusCode(shortMessage);
    const { title, body, colour } = getMessageDetails(shortMessage);
    let logMessage = '';

    if (statusCode === '200') {
      logMessage = colour(title) + (title ? ' ' : '') + chalk.green(body);
    } else if (statusCode === '202') {
      logMessage = colour(title) + (title ? ' ' : '') + chalk.yellow(body);
    } else if (statusCode) {
      logMessage = colour(title) + (title ? ' ' : '') + chalk.red(body);
    } else {
      logMessage = colour(title) + (title ? ' ' : '') + body;
    }

    consoleLog(logMessage);
  }
};

const getCommandLineArgs = (): Promise<string[]> => Promise.resolve(process.argv.slice(1));

const getCurrentWorkingDirectory = (): Promise<string> => Promise.resolve(process.cwd());

const open = (url: string): Promise<void> => {
  spawn('open', [url]);
  return Promise.resolve();
};

const runToCompletion = (
  directory: string,
  command: string,
  onOutput: (message: string) => void,
  onError: (message: string) => void,
): Promise<void> =>
  new Promise((resolve): void => {
    const childProcess = exec(command, { cwd: directory });

    childProcess.stdout.on('data', (data): void => {
      if (onOutput) {
        const output = trim(data);
        if (output) {
          onOutput(output);
        }
      }
    });

    childProcess.stderr.on('data', (data): void => {
      if (onError) {
        const error = trim(data);
        if (error) {
          onError(error);
        }
      }
    });

    childProcess.on('error', (error): void => {
      if (onError) {
        onError(error.toString());
      }
    });

    childProcess.on(
      'close',
      async (): Promise<void> => {
        resolve();
      },
    );
  });

const runUntilStopped = (
  directory: string,
  command: string,
  onOutput: (message: string) => void,
  onError: (message: string) => void,
): Promise<() => Promise<void>> =>
  new Promise((resolve): void => {
    let started = false;
    let stopped = false;
    const commandParts = command.split(' ');
    const childProcess = spawn(commandParts[0], commandParts.slice(1), {
      cwd: directory,
    });

    const start = (): void => {
      if (!started) {
        started = true;
        setTimeout((): void => {
          resolve(
            (): Promise<void> =>
              new Promise((resolveStop): void => {
                if (stopped) {
                  resolveStop();
                } else {
                  childProcess.on('close', (): void => {
                    resolveStop();
                  });

                  childProcess.kill('SIGHUP');
                }
              }),
          );
        }, 1000);
      }
    };

    childProcess.stdout.on('data', (data): void => {
      if (onOutput) {
        const output = trim(data);
        if (output) {
          onOutput(output);
        }
      }
      start();
    });

    childProcess.stderr.on('data', (data): void => {
      if (onError) {
        const error = trim(data);
        if (error) {
          onError(error);
        }
      }
      start();
    });

    childProcess.on('error', (error): void => {
      if (onError) {
        onError(error.toString());
      }
    });

    childProcess.on(
      'close',
      async (): Promise<void> => {
        stopped = true;
      },
    );
  });

const processSystem: ProcessSystem = {
  getCommandLineArgs,
  getCurrentWorkingDirectory,
  log,
  open,
  runToCompletion,
  runUntilStopped,
};

export default processSystem;
