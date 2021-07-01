import { session } from 'electron';
import electronDevToolsInstaller, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import { log, logError } from './console';

type DevToolsExtension = {
  id: typeof REACT_DEVELOPER_TOOLS;
  name: string;
  installed?: boolean;
};

const devToolsExtensions = [
  {
    ref: REACT_DEVELOPER_TOOLS,
    name: 'React Developer Tools',
  },
  {
    ref: REDUX_DEVTOOLS,
    name: 'Redux DevTools',
  },
];

const installExtension = async (extension: DevToolsExtension): Promise<string | void> => {
  const forceInstall = extension.installed;

  return electronDevToolsInstaller(extension.id, {
    loadExtensionOptions: { allowFileAccess: true },
    forceDownload: forceInstall,
  })
    .then((installedExtension: string) =>
      log(`${forceInstall ? 'Upgraded' : 'Added'} Extension: ${installedExtension}`),
    )
    .catch((err: Error) => logError(err));
};

const getExtensionsToInstall = (installedExtensions: string[], forceInstall: boolean): DevToolsExtension[] => {
  return devToolsExtensions
    .map(({ ref, name }) => ({ id: ref, name, installed: installedExtensions.includes(name) }))
    .filter((extension) => !extension.installed || forceInstall);
};

const installDevToolsExtensions = async (): Promise<void> => {
  const forceInstall = !!process.env.UPGRADE_EXTENSIONS;
  const installedExtensions = Object.keys(session.defaultSession.getAllExtensions());
  const extensionsToInstall = getExtensionsToInstall(installedExtensions, forceInstall);
  if (installedExtensions.length) {
    log('\nFound existing Developer Tools Extensions...', installedExtensions);
  } else {
    log('\nFound no Developer Tools Extensions...');
  }

  if (extensionsToInstall.length) {
    log(`${forceInstall ? 'Upgrading' : 'Installing'} Developer Tools Extensions...`);
    await Promise.all(extensionsToInstall.map((extension) => installExtension(extension)));
  }
};

export { installDevToolsExtensions };
