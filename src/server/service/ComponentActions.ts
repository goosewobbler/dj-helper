import { join } from 'path';

import runNpm from '../helpers/runNpm';
import Config from '../types/Config';
import Routing from '../types/Routing';
import System from '../types/System';
import packageHash from './helpers/packageHash';
import Component from './types/Component';
import ComponentActions from './types/ComponentActions';

const ComponentActions = (
  system: System,
  routing: Routing,
  config: Config,
  componentPath: string,
  name: string,
  getPort: () => number,
  log: (message: string) => void,
  getOther: (name: string) => Component,
  getUseCache: () => boolean,
  onReload: (restartOthers: boolean) => void,
): ComponentActions => {
  let stopRunning: () => Promise<void>;

  const readPackage = async () => JSON.parse(await system.file.readFile(join(componentPath, 'package.json')));

  const hasBuildScript = async () => {
    const packageContents = await readPackage();
    return packageContents.scripts && packageContents.scripts.build;
  };

  const hasBower = () => system.file.exists(join(componentPath, 'bower.json'));

  const hasGrunt = () => system.file.exists(join(componentPath, 'Gruntfile.js'));

  const calculatePackageHash = async () => packageHash(await readPackage());

  const updatePackageHash = async () => {
    const hash = await calculatePackageHash();
    const mdcFile = JSON.stringify({ hash });
    await system.file.writeFile(join(componentPath, 'node_modules', '.mdc.json'), mdcFile);
  };

  const getPackageHash = async () => {
    try {
      const packageHashContents = JSON.parse(
        await system.file.readFile(join(componentPath, 'node_modules', '.mdc.json')),
      );
      return packageHashContents.hash;
    } catch (ex) {
      // ignore
    }
    return null;
  };

  const buildAll = async () => {
    let command: string;
    let shortName: string;
    if (await hasBuildScript()) {
      command = 'npm run build';
      shortName = 'npm run build';
    } else if (await hasGrunt()) {
      command = join(__dirname, '../../../node_modules/.bin/grunt build');
      shortName = 'grunt build';
    }
    if (command) {
      log(`Running ${shortName}...`);
      const buildLog = (message: string) => log(`[${shortName}] ${message}`);
      await system.process.runToCompletion(componentPath, command, buildLog, buildLog);
      log('Built.');
    }
  };

  const buildSass = async () => {
    const command = join(__dirname, '../../../node_modules/.bin/grunt sass');
    log('Running grunt sass...');
    const buildLog = (message: string) => log(`[grunt sass] ${message}`);
    await system.process.runToCompletion(componentPath, command, buildLog, buildLog);
    log('Built.');
  };

  const install = async () => {
    log('Running npm install...');
    const installLog = (message: string) => log(`[npm install] ${message}`);
    await runNpm(system, componentPath, ['install'], installLog, installLog);
    await updatePackageHash();
    if (await hasBower()) {
      const bowerLog = (message: string) => log(`[bower install] ${message}`);
      await system.process.runToCompletion(
        componentPath,
        'node node_modules/bower/bin/bower install',
        bowerLog,
        bowerLog,
      );
    }
    log('Installed.');
  };

  const link = async (dependency: string) => {
    log(`Linking ${dependency}...`);
    const otherDirectoryName = getOther(dependency).getDirectoryName();
    const otherPath = join(componentPath, '..', otherDirectoryName);
    const nodeModulePath = join(componentPath, 'node_modules', dependency);
    const oldNodeModulePath = `${nodeModulePath}.old`;
    await system.file.moveDirectory(nodeModulePath, oldNodeModulePath);
    await system.file.createSymlink(otherPath, nodeModulePath);
    log(`Linked ${dependency}.`);
  };

  const makeOtherLinkable = async (otherName: string) => getOther(otherName).makeLinkable();

  const needsInstall = async () => {
    if (config.getValue('installOnStart') === false) {
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

  const run = async (restartOthers: boolean = false) => {
    const useCache = getUseCache();
    log('Starting...');
    const command = join(
      __dirname,
      `../../../node_modules/morph-cli/bin/morph.js develop${useCache ? ' --cache' : ''} --port ${getPort()}`,
    );
    const stopProcess = await system.process.runUntilStopped(componentPath, command, log, log);
    await onReload(restartOthers);
    await routing.updateRoute(name, getPort());
    stopRunning = async () => {
      await routing.updateRoute(name, null);
      await stopProcess();
    };

    log(useCache ? 'Running with cache enabled.' : 'Running.');
  };

  const stop = async () => {
    if (stopRunning) {
      log('Stopping...');
      await stopRunning();
      log('Stopped.');
    }
  };

  const uninstall = async () => {
    log('Deleting node_modules.');
    await system.file.deleteDirectory(join(componentPath, 'node_modules'));
  };

  const unlink = async (dependency: string) => {
    log(`Unlinking ${dependency}...`);
    const nodeModulePath = join(componentPath, 'node_modules', dependency);
    const oldNodeModulePath = `${nodeModulePath}.old`;
    await system.file.removeSymlink(nodeModulePath);
    await system.file.moveDirectory(oldNodeModulePath, nodeModulePath);
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

export default ComponentActions;
