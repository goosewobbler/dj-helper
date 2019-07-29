interface IProcessSystem {
  getCommandLineArgs(): Promise<string[]>;
  getCurrentWorkingDirectory(): Promise<string>;
  log(message: string): void;
  open(url: string): void;
  runToCompletion(
    directory: string,
    command: string,
    onOutput: (message: string) => void,
    onError: (message: string) => void,
  ): Promise<void>;
  runUntilStopped(
    directory: string,
    command: string,
    onOutput: (message: string) => void,
    onError: (message: string) => void,
  ): Promise<() => Promise<void>>;
}

export default IProcessSystem;
