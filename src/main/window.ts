import { BrowserWindow, ipcMain } from 'electron';

import { getStore, getDispatch } from './store/index.js';

export function initWindow(mainWindow: BrowserWindow): void {
  const store = getStore();
  const dispatch = getDispatch();
  const { getState } = store;

  function boundsChangeHandler() {
    const { x, y, width, height } = mainWindow.getBounds();
    dispatch('UI:WINDOW_BOUNDS_CHANGED', { x, y, width, height });
  }

  mainWindow.on('resize', () => {
    mainWindow.webContents.send('window-resized');
    boundsChangeHandler();
  });
  mainWindow.on('move', boundsChangeHandler);

  ipcMain.handle('update-window-bounds', () => {
    const { windowBounds } = getState().ui;
    mainWindow.setBounds(windowBounds, true);
  });
}
