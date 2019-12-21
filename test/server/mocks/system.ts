import ISystem from '../../../src/server/types/ISystem';

const createMockSystem = (): any => {
  const self = {};

  const packageDirectories: { [Key: string]: string[] } = {};
  const readFiles: { [Key: string]: string } = {};
  const symbolicLinks: string[] = [];
  const environmentVersions: { [Key: string]: { int: string; test: string; live: string } } = {};
  const commandLineArgs: string[] = [];
  const logs: string[] = [];
  const getRequests: { [Key: string]: { body: string; headers: { [Key: string]: string }; statusCode: number } } = {};
  const ephemeralGetRequests: {
    [Key: string]: Array<{ body: string; headers: { [Key: string]: string }; statusCode: number }>;
  } = {};
  const deletedDirectories: string[] = [];
  const watchCallbacks: { [Key: string]: (path: string) => void } = {};
  let currentWorkingDirectory: string = '/cwd/';
  const promoted: { [Key: string]: string[] } = { test: [], live: [] };
  const promotionFailures: Array<{ name: string; environment: string; failure: string }> = [];
  const runCommands: Array<{ command: string; directory: string }> = [];
  const copiedDirectories: Array<{ from: string; to: string; filter: boolean }> = [];
  const processOutputs: Array<{ command: string; directory: string; outputs: string[]; errors: string[] }> = [];
  const existPaths: string[] = [];

  const getPackageDirectories = (directory: string) => Promise.resolve(packageDirectories[directory]);

  const exists = (path: string) => Promise.resolve(existPaths.indexOf(path) !== -1);

  const readFile = (path: string) => {
    const contents = readFiles[path];
    if (!contents && contents !== '') {
      return Promise.reject(`No such file ${path}`);
    }
    return Promise.resolve(contents);
  };

  const writeFile = (path: string, contents: string) => {
    readFiles[path] = contents;
    return Promise.resolve();
  };

  const watchDirectory = (directory: string, callback: (path: string) => void) => {
    watchCallbacks[directory] = callback;
    return Promise.resolve();
  };

  const copyDirectory = async (from: string, to: string, filter: boolean) => {
    copiedDirectories.push({ from, to, filter });
  };

  const deleteDirectory = (directory: string) => {
    deletedDirectories.push(directory);
    return Promise.resolve();
  };

  const symbolicLinkExists = (path: string) => {
    return Promise.resolve(symbolicLinks.indexOf(path) !== -1);
  };

  const getVersionOnEnvironment = (name: string, environment: 'int' | 'test' | 'live') => {
    const versions = environmentVersions[name];
    return Promise.resolve(versions ? versions[environment] : null);
  };

  const promote = (name: string, environment: 'test' | 'live') => {
    const promotionFailure = promotionFailures.find(p => p.name === name && p.environment === environment);
    if (promotionFailure) {
      promotionFailures.splice(promotionFailures.indexOf(promotionFailure), 1);
      throw promotionFailure.failure;
    }
    promoted[environment].push(name);
    environmentVersions[name] = environmentVersions[name] || { int: null, test: null, live: null };
    environmentVersions[name][environment] = '9.9.9';
    return Promise.resolve();
  };

  const getCommandLineArgs = () => Promise.resolve(commandLineArgs);

  const getCurrentWorkingDirectory = () => Promise.resolve(currentWorkingDirectory);

  const log = (message: string) => {
    logs.push(message);
  };

  const runToCompletion = (
    directory: string,
    command: string,
    onOutput: (message: string) => void,
    onError: (message: string) => void,
  ) => {
    runCommands.push({ command, directory });
    const outputs = processOutputs.find(
      processOutput => processOutput.command === command && processOutput.directory === directory,
    );
    if (outputs) {
      outputs.outputs.forEach(onOutput);
      outputs.errors.forEach(onError);
    } else {
      onOutput(`Output log from running ${command} in ${directory}`);
      onError(`Error log from running ${command} in ${directory}`);
    }
    return Promise.resolve();
  };

  const runUntilStopped = (
    directory: string,
    command: string,
    onOutput: (message: string) => void,
    onError: (message: string) => void,
  ) => {
    runCommands.push({ command, directory });
    onOutput(`Output log from ongoing ${command} run in ${directory}`);
    onError(`Error log from ongoing ${command} run in ${directory}`);
    return Promise.resolve(
      (): Promise<void> =>
        new Promise(resolve => {
          onOutput(`Stopping ${command} run in ${directory}`);
          resolve();
        }),
    );
  };

  const get = (url: string) => {
    const ephemeralResponses = ephemeralGetRequests[url];
    if (Array.isArray(ephemeralResponses) && ephemeralResponses.length > 0) {
      return Promise.resolve(ephemeralResponses.shift());
    }
    return Promise.resolve(getRequests[url]);
  };

  const getCopiedDirectories = () => copiedDirectories;

  const getDeletedDirectories = () => deletedDirectories;

  const getLogs = () => logs;

  const getPromoted = () => promoted;

  const getRunCommands = () => runCommands;

  const withGetPackageDirectories = (directory: string, directories: string[]) => {
    packageDirectories[directory] = directories;
    return self;
  };

  const withReadFile = (path: string, contents: string) => {
    readFiles[path] = contents;
    return self;
  };

  const withSymbolicLink = (path: string) => {
    symbolicLinks.push(path);
    return self;
  };

  const withVersionOnEnvironment = (name: string, environment: 'int' | 'test' | 'live', version: string) => {
    environmentVersions[name] = environmentVersions[name] || { int: null, test: null, live: null };
    environmentVersions[name][environment] = version;
    return self;
  };

  const withCommandLineArg = (arg: string) => {
    commandLineArgs.push(arg);
    return self;
  };

  const withGetResponse = (
    url: string,
    body: string,
    statusCode: number = 200,
    headers: { [Key: string]: string } = {},
  ) => {
    getRequests[url] = { body, headers, statusCode };
    return self;
  };

  const withEphemeralGetResponse = (
    url: string,
    body: string,
    statusCode: number = 200,
    headers: { [Key: string]: string } = {},
  ) => {
    ephemeralGetRequests[url] = ephemeralGetRequests[url] || [];
    ephemeralGetRequests[url].push({ body, headers, statusCode });
    return self;
  };

  const withCurrentWorkingDirectory = (directory: string) => {
    currentWorkingDirectory = directory;
    return self;
  };

  const withPromotionFailure = (name: string, environment: string, failure: string) => {
    promotionFailures.push({ name, environment, failure });
    return self;
  };

  const withProcessOutputs = (command: string, directory: string, outputs: string[], errors: string[]) => {
    processOutputs.push({ command, directory, outputs, errors });
    return self;
  };

  const withExists = (path: string) => {
    existPaths.push(path);
    return self;
  };

  const simulateFileChanged = async (path: string) => {
    const directoryOfWatcher = Object.keys(watchCallbacks).find(directory => path.startsWith(directory));
    if (directoryOfWatcher) {
      const callback = watchCallbacks[directoryOfWatcher];
      await callback(path);
    }
  };

  const build = (): ISystem => ({
    file: {
      copyDirectory,
      createSymlink: jest.fn(),
      deleteDirectory,
      exists,
      getPackageDirectories,
      moveDirectory: jest.fn(),
      readFile,
      removeSymlink: jest.fn(),
      symbolicLinkExists,
      watchDirectory,
      writeFile,
    },
    git: {
      checkoutExistingBranch: jest.fn(),
      checkoutMaster: jest.fn(),
      checkoutNewBranch: jest.fn(),
      commit: jest.fn(),
      getCurrentBranch: jest.fn(),
      getRandomBranchName: jest.fn(),
      push: jest.fn(),
      readyToCommit: jest.fn(),
      stageFile: jest.fn(),
    },
    morph: {
      getShrinkwrapped: jest.fn().mockReturnValue({}),
      getVersionOnEnvironment,
      promote,
    },
    network: {
      get,
    },
    process: {
      getCommandLineArgs,
      getCurrentWorkingDirectory,
      log,
      open: jest.fn(),
      runToCompletion,
      runUntilStopped,
    },
  });

  Object.assign(self, {
    build,
    getCopiedDirectories,
    getDeletedDirectories,
    getLogs,
    getPromoted,
    getRunCommands,
    simulateFileChanged,
    withCommandLineArg,
    withCurrentWorkingDirectory,
    withEphemeralGetResponse,
    withExists,
    withGetPackageDirectories,
    withGetResponse,
    withProcessOutputs,
    withPromotionFailure,
    withReadFile,
    withSymbolicLink,
    withVersionOnEnvironment,
  });

  return self;
};

export default createMockSystem;
