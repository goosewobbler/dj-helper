import { syncMain } from '@goosewobbler/electron-redux';
import { ipcMain } from 'electron';
import { createReduxStore } from '../common/reduxStore';
import { initBrowsers } from './browser';
import { log } from './helpers/console';
import { createTrackEmbed } from './trackEmbed';

const currentVersion = process.env.npm_package_version as string; // fix when packaged

export const createApp = async (mainWindow: Electron.BrowserWindow, isDev: boolean): Promise<void> => {
  const reduxStore = await createReduxStore({ context: 'main', syncFn: syncMain });

  initBrowsers(mainWindow, reduxStore);

  ipcMain.handle('create-track-embed', (event, [url, bounds]): void =>
    createTrackEmbed(mainWindow, reduxStore.dispatch, url, bounds),
  );

  log(`DJ Helper v${currentVersion} is starting${isDev ? ' in development mode...' : '...'}`);

  return Promise.resolve();
};
