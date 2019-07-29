export default interface GitSystem {
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
