import { syncMain } from '@mckayla/electron-redux';
import { createReduxStore } from '../common/reduxStore';
import { initBrowsers } from './browser';
import { log } from './helpers/console';

const currentVersion = process.env.npm_package_version as string;

export const createApp = (mainWindow: Electron.BrowserWindow, isDev: boolean): void => {
  const reduxStore = createReduxStore({ context: 'main', syncFn: syncMain, persistCallback: () => {} });
  initBrowsers(mainWindow, reduxStore);

  // ipcMain.handle('get-store-value', (event, key): LooseObject => store.get(key));

  log(`DJ Helper v${currentVersion} is starting${isDev ? ' in development mode...' : '...'}`);
};
