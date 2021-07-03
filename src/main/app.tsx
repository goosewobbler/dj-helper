import * as React from 'react';
import { Provider } from 'react-redux';
import { ipcMain } from 'electron';
import { syncMain } from '@mckayla/electron-redux';
import Store from 'electron-store';
import { renderToString } from 'react-dom/server';
import { App } from '../renderer/App';
import { AppState, LooseObject } from '../common/types';
import { createReduxStore } from '../common/reduxStore';
import { log } from './helpers/console';

const currentVersion = process.env.npm_package_version as string;

export const createApp = (mainWindow: Electron.BrowserWindow, isDev: boolean): void => {
  const store = new Store<AppState>();

  ipcMain.handleOnce('get-setup', (): { initialState: AppState; html: string } => {
    const initialState: AppState = {
      lists: store.get('lists'),
    };

    const reduxStore = createReduxStore(initialState, syncMain);
    const html = renderToString(
      <Provider store={reduxStore}>
        <App />
      </Provider>,
    );

    const preloadedState = reduxStore.getState() as AppState;

    return { initialState: preloadedState, html };
  });

  ipcMain.handle('get-store-value', (event, key): LooseObject => store.get(key));

  log(`DJ Helper v${currentVersion} is starting${isDev ? ' in development mode...' : '...'}`);
};
