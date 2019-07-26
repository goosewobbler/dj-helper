interface IUpdater {
  getStatus(): Promise<{
    currentVersion: string;
    updateAvailable: string;
    updated: boolean;
    updating: boolean;
  }>;
  update(): Promise<void>;
}

export default IUpdater;
