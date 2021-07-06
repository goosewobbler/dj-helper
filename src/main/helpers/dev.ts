import electronDevToolsInstaller, { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS } from 'electron-devtools-installer';
import { log, logError } from './console';

type DevToolsExtension = {
  ref: typeof REACT_DEVELOPER_TOOLS;
  name: string;
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
  return electronDevToolsInstaller(extension.ref, {
    loadExtensionOptions: { allowFileAccess: true },
  })
    .then((installedExtension: string) => log(`Added Extension: ${installedExtension}`))
    .catch((err: Error) => logError(err));
};

const installDevToolsExtensions = async (): Promise<void> => {
  log(`Installing Developer Tools Extensions...`);
  await Promise.all(devToolsExtensions.map((extension) => installExtension(extension)));
};

export { installDevToolsExtensions };
