import { app, ipcMain } from 'electron';
import { mainZustandBridge } from 'zutron/main';

import { getStore, initialState } from './store/index.js';
import { initWindow } from './window.js';
import { initBrowsers } from './browser.js';
import { initEmbed } from './trackEmbed.js';
import { log } from './helpers/console.js';
import { AppState } from '../common/types.js';
import { StoreApi } from 'zustand';
import { getHandlers } from '../features/index.js';

const currentVersion = app.getVersion();

export const createApp = async (mainWindow: Electron.BrowserWindow, isDev: boolean): Promise<void> => {
  const store = getStore();
  const { unsubscribe } = mainZustandBridge<AppState, StoreApi<AppState>>(ipcMain, store, [mainWindow], {
    handlers: getHandlers(store, initialState),
  });

  app.on('quit', () => unsubscribe);

  initWindow(mainWindow);
  initBrowsers(mainWindow);
  initEmbed(mainWindow);

  log(`DJ Helper v${currentVersion} is starting${isDev ? ' in development mode' : ''}...`);

  return Promise.resolve();
};
