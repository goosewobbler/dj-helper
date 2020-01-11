import { BrowserWindow } from 'electron';
import electronDevToolsInstaller, {
  REACT_DEVELOPER_TOOLS,
  REDUX_DEVTOOLS,
  REACT_PERF,
  ExtensionReference,
} from 'electron-devtools-installer';
import { log, logError } from './console';

type DevToolsExtension = {
  id: ExtensionReference;
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
  {
    ref: REACT_PERF,
    name: 'React Perf',
  },
];

const installExtension = async (extension: DevToolsExtension): Promise<string | void> => {
  const forceInstall = extension.installed;

  return electronDevToolsInstaller(extension.id, forceInstall)
    .then((installedExtension: string) =>
      log(`${forceInstall ? 'Upgraded' : 'Added'} Extension: ${installedExtension}`),
    )
    .catch((err: Error) => logError(err));
};

const getExtensionsToInstall = (installedExtensions: string[]): DevToolsExtension[] => {
  const forceInstall = !!process.env.UPGRADE_EXTENSIONS;
  return devToolsExtensions
    .map(({ ref, name }) => ({ id: ref, name, installed: installedExtensions.includes(name) }))
    .filter(extension => !extension.installed || forceInstall);
};

const installDevToolsExtensions = async (): Promise<void> => {
  const installedExtensions = Object.keys(BrowserWindow.getDevToolsExtensions());
  const extensionsToInstall = getExtensionsToInstall(installedExtensions);

  if (extensionsToInstall.length) {
    log('\nInstalling Developer Tools...', installedExtensions, extensionsToInstall);
    await Promise.all(extensionsToInstall.map(extension => installExtension(extension)));
  }
};

export { installDevToolsExtensions };
