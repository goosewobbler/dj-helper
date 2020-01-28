/* eslint-disable no-console */
import { app, BrowserWindow } from 'electron';
import startServer from './server';
import { logError } from './helpers/console';
import { installDevToolsExtensions } from './helpers/dev';

if (module.hot) {
  module.hot.accept();
}

const isDev = process.env.NODE_ENV === 'development';
const isDebugMode = isDev || process.env.DEBUG_PROD === 'true';

let mainWindow: BrowserWindow | undefined;

if (process.env.NODE_ENV === 'production') {
  import('source-map-support').then(sourceMapSupport => sourceMapSupport.install());
}

if (isDebugMode) {
  import('electron-debug').then(electronDebug => electronDebug.default());
}

async function createWindow(): Promise<void> {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installDevToolsExtensions();
  }

  mainWindow = new BrowserWindow({
    show: false,
    height: 800,
    width: 1200,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  await startServer(mainWindow).catch(logError);

  mainWindow.loadURL(isDev ? 'http://localhost:1212/' : `file:///${__dirname}/../../dist/index.html`);

  mainWindow.once('ready-to-show', () => {
    const browser = mainWindow as BrowserWindow;
    if (isDebugMode) {
      browser.webContents.once('did-frame-finish-load', () => browser.webContents.openDevTools());
    }
    browser.show();
  });

  mainWindow.on('closed', (): void => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = undefined;
  });
}

if (app.requestSingleInstanceLock()) {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    console.log('second instance requested');
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        console.log('restoring main window');
        mainWindow.restore();
      }
      console.log('focussing main window');
      mainWindow.focus();
    }
  });

  app.on('ready', () => {
    createWindow();
  });

  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (!isDev && process.platform !== 'darwin') {
      app.quit();
    }
  });

  app.on('activate', (): void => {
    // On OS X it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === undefined) {
      createWindow();
    }
  });
} else {
  console.log('single instance lock rejected');
}
