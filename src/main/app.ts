import { app } from 'electron';

// import { syncMain } from '@goosewobbler/electron-redux';

import { createReduxStore } from '../common/reduxStore.js';
import { initWindow } from './window.js';
import { initBrowsers } from './browser.js';
import { initEmbed } from './trackEmbed.js';
import { log } from './helpers/console.js';

const currentVersion = app.getVersion();

export const createApp = async (mainWindow: Electron.BrowserWindow, isDev: boolean): Promise<void> => {
  const reduxStore = await createReduxStore({ context: 'main' });

  initWindow(mainWindow, reduxStore);
  initBrowsers(mainWindow, reduxStore);
  initEmbed(mainWindow, reduxStore);

  log(`DJ Helper v${currentVersion} is starting${isDev ? ' in development mode' : ''}...`);

  return Promise.resolve();
};
