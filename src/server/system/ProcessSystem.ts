import chalk from 'chalk';
import { exec, spawn } from 'child_process';
import * as stripAnsi from 'strip-ansi';
import ProcessSystem from '../types/ProcessSystem';

const MESSAGE_NAME_PATTERN = /^(\[[^\]]+\]) .+/;
const MESSAGE_REPLACE_PATTERN = /.*\[\d\d\d\] http.+( {.+})$/;
const MESSAGE_STATUS_CODE_PATTERN = /\[(\d\d\d)\]/;

const NAME_COLOURS = [chalk.blue, chalk.magenta, chalk.cyan, chalk.yellow, chalk.white];

const assignedNameColours: any = {};
let nextColour = 0;

const trim = (s: string | Buffer) => (stripAnsi as any)(s.toString()).trim();

const log = (message: string) => {
  const removeMatches = MESSAGE_REPLACE_PATTERN.exec(message);
  const shortMessage = trim(removeMatches ? message.replace(removeMatches[1], '') : message);

  if (shortMessage) {
    const statusMatches = MESSAGE_STATUS_CODE_PATTERN.exec(shortMessage);
    let statusCode = '';
    if (statusMatches) {
      statusCode = statusMatches[1];
    }

    const nameMatches = MESSAGE_NAME_PATTERN.exec(shortMessage);
    let name = '';
    let details = shortMessage;
    if (nameMatches) {
      name = nameMatches[1];
      details = shortMessage.substr(name.length + 1);
    }

    if (name && !(name in assignedNameColours)) {
      assignedNameColours[name] = NAME_COLOURS[nextColour % NAME_COLOURS.length];
      nextColour += 1;
    }
    const nameColour = assignedNameColours[name] || NAME_COLOURS[0];

    if (statusCode === '200') {
      console.log(nameColour(name) + (name ? ' ' : '') + chalk.green(details));
    } else if (statusCode === '202') {
      console.log(nameColour(name) + (name ? ' ' : '') + chalk.yellow(details));
    } else if (statusCode) {
      console.log(nameColour(name) + (name ? ' ' : '') + chalk.red(details));
    } else {
      console.log(nameColour(name) + (name ? ' ' : '') + details);
    }
  }
};

const getCommandLineArgs = () => Promise.resolve(process.argv.slice(1));

const getCurrentWorkingDirectory = () => Promise.resolve(process.cwd());

const open = (url: string) => {
  spawn('open', [url]);
  return Promise.resolve();
};

const runToCompletion = (
  directory: string,
  command: string,
  onOutput: (message: string) => void,
  onError: (message: string) => void,
) =>
  new Promise<void>(resolve => {
    const childProcess = exec(command, { cwd: directory });

    childProcess.stdout.on('data', data => {
      if (onOutput) {
        const output = trim(data);
        if (output) {
          onOutput(output);
        }
      }
    });

    childProcess.stderr.on('data', data => {
      if (onError) {
        const error = trim(data);
        if (error) {
          onError(error);
        }
      }
    });

    childProcess.on('error', error => {
      if (onError) {
        onError(error.toString());
      }
    });

    childProcess.on('close', async () => {
      resolve();
    });
  });

const runUntilStopped = (
  directory: string,
  command: string,
  onOutput: (message: string) => void,
  onError: (message: string) => void,
) =>
  new Promise<() => Promise<void>>(resolve => {
    let started = false;
    let stopped = false;
    const commandParts = command.split(' ');
    const childProcess = spawn(commandParts[0], commandParts.slice(1), {
      cwd: directory,
    });

    const start = () => {
      if (!started) {
        started = true;
        setTimeout(() => {
          resolve(
            () =>
              new Promise(resolveStop => {
                if (stopped) {
                  resolveStop();
                } else {
                  childProcess.on('close', () => {
                    resolveStop();
                  });

                  childProcess.kill('SIGHUP');
                }
              }),
          );
        }, 1000);
      }
    };

    childProcess.stdout.on('data', data => {
      if (onOutput) {
        const output = trim(data);
        if (output) {
          onOutput(output);
        }
      }
      start();
    });

    childProcess.stderr.on('data', data => {
      if (onError) {
        const error = trim(data);
        if (error) {
          onError(error);
        }
      }
      start();
    });

    childProcess.on('error', error => {
      if (onError) {
        onError(error.toString());
      }
    });

    childProcess.on('close', async () => {
      stopped = true;
    });
  });

const ProcessSystemExport: ProcessSystem = {
  getCommandLineArgs,
  getCurrentWorkingDirectory,
  log,
  open,
  runToCompletion,
  runUntilStopped,
};

export default ProcessSystemExport;
