import { syncMain } from '@goosewobbler/electron-redux';
import { createReduxStore } from '../common/reduxStore';
import { initBrowsers } from './browser';
import { log } from './helpers/console';

const currentVersion = process.env.npm_package_version as string;

export const createApp = async (mainWindow: Electron.BrowserWindow, isDev: boolean): Promise<void> => {
  const reduxStore = await createReduxStore({ context: 'main', syncFn: syncMain });

  initBrowsers(mainWindow, reduxStore);

  // ipcMain.handle('get-store-value', (event, key): LooseObject => store.get(key));

  log(`DJ Helper v${currentVersion} is starting${isDev ? ' in development mode...' : '...'}`);

  return Promise.resolve();
};
