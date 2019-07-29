import { gt } from 'semver';
import runNpm from '../helpers/runNpm';
import System from '../types/System';
import Updater from '../types/Updater';

const createUpdater = (system: System, currentVersion: string): Updater => {
  const fetchNewVersion = async (): Promise<string> => {
    let version: string = null;
    const installPath = '/tmp/morph-developer-console-version';
    await system.file.deleteDirectory(installPath);

    await runNpm(
      system,
      installPath,
      ['install', 'git+ssh://git@github.com:bbc/morph-developer-console.git#version'],
      (output: string) => {
        const versionMatches = /morph-developer-console@(\d+).(\d+).(\d+)/.exec(output);
        if (versionMatches) {
          const major = Number(versionMatches[1]);
          const minor = Number(versionMatches[2]);
          const patch = Number(versionMatches[3]);
          const latestVersion = `${major}.${minor}.${patch}`;
          if (gt(latestVersion, currentVersion)) {
            version = latestVersion;
          }
        }
      },
      () => null,
    );

    return version;
  };

  let updating = false;
  let updated = false;

  const getStatus = async (): Promise<{
    currentVersion: string;
    updateAvailable: string;
    updated: boolean;
    updating: boolean;
  }> => {
    return {
      currentVersion,
      updateAvailable: await fetchNewVersion(),
      updated,
      updating,
    };
  };

  const update = async () => {
    updating = true;
    system.process.log('[console] Updating Morph Developer Console...');
    await runNpm(
      system,
      await system.process.getCurrentWorkingDirectory(),
      ['install', 'git+ssh://git@github.com:bbc/morph-developer-console.git', '--global', '--production'],
      () => null,
      () => null,
    );
    system.process.log('[console] Morph Developer Console updated sucessfully. Restart to apply updates.');
    updating = false;
    updated = true;
  };

  return {
    getStatus,
    update,
  };
};

export default createUpdater;
