import { randomBytes } from 'crypto';

import process from './process';
import { logError } from '../helpers/console';
import { GitSystem } from '../../common/types';

const checkoutExistingBranch = (directory: string, branchName: string): Promise<void> =>
  process.runToCompletion(directory, `git checkout ${branchName}`, (): null => null, logError);

const checkoutMaster = (directory: string): Promise<void> =>
  process.runToCompletion(directory, `git checkout master`, (): null => null, logError);

const checkoutNewBranch = (directory: string, branchName: string): Promise<void> =>
  process.runToCompletion(directory, `git checkout -b ${branchName}`, (): null => null, logError);

const commit = (directory: string, message: string): Promise<void> =>
  process.runToCompletion(directory, `git commit -m "${message}"`, (): null => null, logError);

const getCurrentBranch = (directory: string): Promise<string> =>
  new Promise((resolve, reject): void => {
    process.runToCompletion(directory, 'git rev-parse --abbrev-ref HEAD', resolve, reject).catch(reject);
  });

const getRandomBranchName = (): Promise<string> =>
  new Promise((resolve, reject): void => {
    randomBytes(4, (error, buffer): void => {
      if (error) {
        reject(error);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });

const push = (directory: string, branchName: string): Promise<void> =>
  process.runToCompletion(directory, `git push origin ${branchName}`, (): null => null, logError);

const readyToCommit = (directory: string): Promise<boolean> =>
  new Promise((resolve, reject): void => {
    process
      .runToCompletion(
        directory,
        'git diff --cached --numstat',
        (): void => {
          resolve(false);
        },
        reject,
      )
      .then((): void => resolve(true))
      .catch(reject);
  });

const stageFile = (directory: string, path: string): Promise<void> =>
  process.runToCompletion(directory, `git add ${path}`, (): null => null, logError);

const git: GitSystem = {
  checkoutExistingBranch,
  checkoutMaster,
  checkoutNewBranch,
  commit,
  getCurrentBranch,
  getRandomBranchName,
  push,
  readyToCommit,
  stageFile,
};

export default git;
