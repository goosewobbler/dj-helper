import { randomBytes } from 'crypto';
import { process } from './process';

import { logError } from '../helpers/console';

interface GitSystem {
  checkoutMaster(directory: string): Promise<void>;
  checkoutExistingBranch(directory: string, branchName: string): Promise<void>;
  checkoutNewBranch(directory: string, branchName: string): Promise<void>;
  commit(directory: string, message: string): Promise<void>;
  getCurrentBranch(directory: string): Promise<string>;
  getRandomBranchName(): Promise<string>;
  push(directory: string, branchName: string): Promise<void>;
  readyToCommit(directory: string): Promise<boolean>;
  stageFile(directory: string, path: string): Promise<void>;
}

const checkoutExistingBranch = (directory: string, branchName: string): Promise<void> =>
  process.runToCompletion(directory, `git checkout ${branchName}`, (): void => null, logError);

const checkoutMaster = (directory: string): Promise<void> =>
  process.runToCompletion(directory, `git checkout master`, (): void => null, logError);

const checkoutNewBranch = (directory: string, branchName: string): Promise<void> =>
  process.runToCompletion(directory, `git checkout -b ${branchName}`, (): void => null, logError);

const commit = (directory: string, message: string): Promise<void> =>
  process.runToCompletion(directory, `git commit -m "${message}"`, (): void => null, logError);

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
  process.runToCompletion(directory, `git push origin ${branchName}`, (): void => null, logError);

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
  process.runToCompletion(directory, `git add ${path}`, (): void => null, logError);

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

export { git, GitSystem };
