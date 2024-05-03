import electronDevToolsInstaller, { REACT_DEVELOPER_TOOLS } from 'electron-devtools-assembler';

import { log, logError } from './console.js';

type DevToolsExtension = {
  ref: typeof REACT_DEVELOPER_TOOLS;
  name: string;
};

const devToolsExtensions = [
  {
    ref: REACT_DEVELOPER_TOOLS,
    name: 'React Developer Tools',
  },
  /* Redux Dev Tools causes electron-redux to fail store synchronisation */
  // {
  //   ref: REDUX_DEVTOOLS,
  //   name: 'Redux DevTools',
  // },
];

const installExtension = async (extension: DevToolsExtension): Promise<string | void> => {
  try {
    const installedExtension = await electronDevToolsInstaller(extension.ref, {
      loadExtensionOptions: { allowFileAccess: true },
    });
    log(`Added Extension: ${installedExtension}`);
  } catch (e: unknown) {
    logError((e as Error).message);
  }
};

const installDevToolsExtensions = async (): Promise<void> => {
  log(`Installing Developer Tools Extensions...`);
  await Promise.all(devToolsExtensions.map((extension) => installExtension(extension)));
};

export { installDevToolsExtensions };
