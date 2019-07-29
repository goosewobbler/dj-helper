import { randomBytes } from 'crypto';
import GitSystem from '../types/GitSystem';
import ProcessSystem from './ProcessSystem';

const checkoutExistingBranch = (directory: string, branchName: string) =>
  ProcessSystem.runToCompletion(directory, `git checkout ${branchName}`, () => null, console.error);

const checkoutMaster = (directory: string) =>
  ProcessSystem.runToCompletion(directory, `git checkout master`, () => null, console.error);

const checkoutNewBranch = (directory: string, branchName: string) =>
  ProcessSystem.runToCompletion(directory, `git checkout -b ${branchName}`, () => null, console.error);

const commit = (directory: string, message: string) =>
  ProcessSystem.runToCompletion(directory, `git commit -m "${message}"`, () => null, console.error);

const getCurrentBranch = (directory: string) =>
  new Promise<string>((resolve, reject) => {
    ProcessSystem.runToCompletion(directory, 'git rev-parse --abbrev-ref HEAD', resolve, reject).catch(reject);
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
  ProcessSystem.runToCompletion(directory, `git push origin ${branchName}`, () => null, console.error);

const readyToCommit = (directory: string) =>
  new Promise<boolean>((resolve, reject) => {
    ProcessSystem.runToCompletion(
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
  ProcessSystem.runToCompletion(directory, `git add ${path}`, () => null, console.error);

const GitSystemObj: GitSystem = {
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

export default GitSystemObj;
