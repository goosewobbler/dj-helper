import { ipcMain } from 'electron';
import { Updater } from './updater';

const setupRendererComms = (mainWindow: Electron.BrowserWindow, updater: Updater): void => {
  ipcMain.on(
    'get-app-version-status',
    (): void => {
      updater.getStatus().then((appStatus) => {
        mainWindow.webContents.send('app-version-status', appStatus);
      });
    },
  );
};

export default setupRendererComms;
