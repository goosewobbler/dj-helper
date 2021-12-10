import { BrowserWindow, ipcMain } from 'electron';
import { AppStore } from '../common/types';
import { windowBoundsChanged } from '../features/ui/uiSlice';

export function initWindow(mainWindow: BrowserWindow, reduxStore: AppStore): void {
  const { dispatch, getState } = reduxStore;

  function boundsChangeHandler() {
    const { x, y, width, height } = mainWindow.getBounds();
    dispatch(windowBoundsChanged({ x, y, width, height }));
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
