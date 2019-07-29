export default interface Updater {
  getStatus(): Promise<{
    currentVersion: string;
    updateAvailable: string;
    updated: boolean;
    updating: boolean;
  }>;
  update(): Promise<void>;
}
