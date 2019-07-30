import { randomBytes } from 'crypto';
import { process } from './process';

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

const checkoutExistingBranch = (directory: string, branchName: string) =>
  process.runToCompletion(directory, `git checkout ${branchName}`, (): void => null, console.error);

const checkoutMaster = (directory: string) =>
  process.runToCompletion(directory, `git checkout master`, (): void => null, console.error);

const checkoutNewBranch = (directory: string, branchName: string) =>
  process.runToCompletion(directory, `git checkout -b ${branchName}`, (): void => null, console.error);

const commit = (directory: string, message: string) =>
  process.runToCompletion(directory, `git commit -m "${message}"`, (): void => null, console.error);

const getCurrentBranch = (directory: string) =>
  new Promise<string>((resolve, reject) => {
    process.runToCompletion(directory, 'git rev-parse --abbrev-ref HEAD', resolve, reject).catch(reject);
  });

const getRandomBranchName = () =>
  new Promise<string>((resolve, reject) => {
    randomBytes(4, (error, buffer) => {
      if (error) {
        reject(error);
      } else {
        resolve(buffer.toString('hex'));
      }
    });
  });

const push = (directory: string, branchName: string) =>
  process.runToCompletion(directory, `git push origin ${branchName}`, (): void => null, console.error);

const readyToCommit = (directory: string) =>
  new Promise<boolean>((resolve, reject) => {
    process.runToCompletion(
      directory,
      'git diff --cached --numstat',
      message => {
        resolve(false);
      },
      reject,
    )
      .then(() => resolve(true))
      .catch(reject);
  });

const stageFile = (directory: string, path: string) =>
  process.runToCompletion(directory, `git add ${path}`, (): void => null, console.error);

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
