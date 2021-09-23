import { syncMain } from '@goosewobbler/electron-redux';
import { createReduxStore } from '../common/reduxStore';
import { initBrowsers } from './browser';
import { initEmbed } from './trackEmbed';
import { log } from './helpers/console';

const currentVersion = process.env.npm_package_version as string; // fix when packaged

export const createApp = async (mainWindow: Electron.BrowserWindow, isDev: boolean): Promise<void> => {
  const reduxStore = await createReduxStore({ context: 'main', syncFn: syncMain });

  initBrowsers(mainWindow, reduxStore);
  initEmbed(mainWindow, reduxStore);

  log(`DJ Helper v${currentVersion} is starting${isDev ? ' in development mode...' : '...'}`);

  return Promise.resolve();
};
