import { join } from 'path';

import runNpm from '../helpers/npm';
import packageHash from '../helpers/packageHash';
import { Component, System, Store, Package } from '../../common/types';

interface ComponentActions {
  buildAll(): Promise<void>;
  buildSass(): Promise<void>;
  install(): Promise<void>;
  link(dependency: string): void;
  makeOtherLinkable(name: string): Promise<void>;
  needsInstall(): Promise<boolean>;
  run(restartOthers?: boolean): Promise<void>;
  stop(): Promise<void>;
  uninstall(): void;
  unlink(dependency: string): void;
}

const createComponentActions = (
  system: System,
  routing: Store,
  config: Store,
  componentPath: string,
  name: string,
  getPort: () => number,
  log: (message: string) => void,
  getOther: (name: string) => Component,
  getUseCache: () => boolean,
  onReload: (restartOthers: boolean) => Promise<void>,
): ComponentActions => {
  let stopRunning: () => Promise<void>;

  const readPackage = async (): Promise<Package> =>
    JSON.parse(await system.file.readFile(join(componentPath, 'package.json'))) as Package;

  const hasBuildScript = async (): Promise<boolean> => {
    const packageContents = await readPackage();
    return packageContents.scripts && !!packageContents.scripts.build;
  };

  const hasBower = (): Promise<boolean> => system.file.exists(join(componentPath, 'bower.json'));

  const hasGrunt = (): Promise<boolean> => system.file.exists(join(componentPath, 'Gruntfile.js'));

  const calculatePackageHash = async (): Promise<string> => packageHash(await readPackage());

  const updatePackageHash = async (): Promise<void> => {
    const hash = await calculatePackageHash();
    const mdcFile = JSON.stringify({ hash });
    await system.file.writeFile(join(componentPath, 'node_modules', '.mdc.json'), mdcFile);
  };

  const getPackageHash = async (): Promise<string | null> => {
    try {
      const { hash } = JSON.parse(await system.file.readFile(join(componentPath, 'node_modules', '.mdc.json'))) as {
        hash: string;
      };
      return hash;
    } catch (ex) {
      // ignore
    }
    return null;
  };

  const build = async (command: string): Promise<void> => {
    const displayCommand = command.replace(/(.*\/)+/, '');
    log(`Running ${displayCommand}...`);
    const buildLog = (message: string): void => log(`[${displayCommand}] ${message}`);
    await system.process.runToCompletion(componentPath, command, buildLog, buildLog);
    log('Built.');
  };

  const buildAll = async (): Promise<void> => {
    if (await hasBuildScript()) {
      void build('npm run build');
    } else if (await hasGrunt()) {
      const command = join(__dirname, '../../../node_modules/.bin/grunt build');
      void build(command);
    }
  };

  const buildSass = async (): Promise<void> => {
    const command = join(__dirname, '../../../node_modules/.bin/grunt sass');
    log('Running grunt sass...');
    const buildLog = (message: string): void => log(`[grunt sass] ${message}`);
    await system.process.runToCompletion(componentPath, command, buildLog, buildLog);
    log('Built.');
  };

  const install = async (): Promise<void> => {
    log('Running npm install...');
    const installLog = (message: string): void => log(`[npm install] ${message}`);
    await runNpm(componentPath, ['install'], installLog, installLog);
    await updatePackageHash();
    if (await hasBower()) {
      const bowerLog = (message: string): void => log(`[bower install] ${message}`);
      await system.process.runToCompletion(
        componentPath,
        'node node_modules/bower/bin/bower install',
        bowerLog,
        bowerLog,
      );
    }
    log('Installed.');
  };

  const link = (dependency: string): void => {
    log(`Linking ${dependency}...`);
    const otherDirectoryName = getOther(dependency).getDirectoryName();
    const otherPath = join(componentPath, '..', otherDirectoryName);
    const nodeModulePath = join(componentPath, 'node_modules', dependency);
    const oldNodeModulePath = `${nodeModulePath}.old`;
    system.file.moveDirectory(nodeModulePath, oldNodeModulePath);
    system.file.createSymlink(otherPath, nodeModulePath);
    log(`Linked ${dependency}.`);
  };

  const makeOtherLinkable = async (otherName: string): Promise<void> => getOther(otherName).makeLinkable();

  const needsInstall = async (): Promise<boolean> => {
    if (config.get('installOnStart') === false) {
      return false;
    }

    log('Installing...');
    const oldPackageHash = await getPackageHash();
    const newPackageHash = await calculatePackageHash();
    if (oldPackageHash !== newPackageHash) {
      log('Dependencies need installing.');
      return true;
    }
    log('Dependencies are up to date.');
    return false;
  };

  const run = async (restartOthers = false): Promise<void> => {
    const useCache = getUseCache();
    log('Starting...');
    const command = join(
      await system.process.getCurrentWorkingDirectory(),
      `node_modules/morph-cli/bin/morph.js develop${useCache ? ' --cache' : ''} --port ${getPort()}`,
    );
    const stopProcess = await system.process.runUntilStopped(componentPath, command, log, log);
    void onReload(restartOthers);
    await routing.set(name, getPort());
    stopRunning = async (): Promise<void> => {
      await routing.set(name, null);
      await stopProcess();
    };

    log(useCache ? 'Running with cache enabled.' : 'Running.');
  };

  const stop = async (): Promise<void> => {
    if (stopRunning) {
      log('Stopping...');
      await stopRunning();
      log('Stopped.');
    }
  };

  const uninstall = (): void => {
    log('Deleting node_modules.');
    system.file.deleteDirectory(join(componentPath, 'node_modules'));
  };

  const unlink = (dependency: string): void => {
    log(`Unlinking ${dependency}...`);
    const nodeModulePath = join(componentPath, 'node_modules', dependency);
    const oldNodeModulePath = `${nodeModulePath}.old`;
    system.file.removeSymlink(nodeModulePath);
    system.file.moveDirectory(oldNodeModulePath, nodeModulePath);
    log(`Unlinked ${dependency}.`);
  };

  return {
    buildAll,
    buildSass,
    install,
    link,
    makeOtherLinkable,
    needsInstall,
    run,
    stop,
    uninstall,
    unlink,
  };
};

export { createComponentActions, ComponentActions };
