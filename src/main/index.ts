/* eslint-disable no-console */
import path from 'path';
import { app, BrowserWindow } from 'electron';
import { createApp } from './app';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isDebugMode = isDev || process.env.DEBUG_PROD === 'true';

if (isDev) {
  (module as any).hot?.accept(); //eslint-disable-line
}

let mainWindow: BrowserWindow | undefined;

if (isProd) {
  const sourceMapSupport = await import('source-map-support');
  sourceMapSupport.install();
}

if (isDebugMode) {
  const electronDebug = await import('electron-debug');
  electronDebug.default();
}

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    show: false,
    height: 1000,
    width: 1100,
    webPreferences: {
      preload: path.resolve(__dirname, 'preload.js'),
    },
  });

  if (isDebugMode) {
    const { installDevToolsExtensions } = await import('./helpers/dev');
    void (await installDevToolsExtensions());
  }

  createApp(mainWindow, isDev);

  void (await mainWindow.loadURL(isDev ? 'http://localhost:1212/' : `file:///${__dirname}/../../dist/index.html`));

  mainWindow.once('ready-to-show', () => {
    const browser = mainWindow as BrowserWindow;
    if (isDebugMode) {
      browser.webContents.once('dom-ready', () => {
        browser.webContents.openDevTools();
      });
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

  app.on('ready', (): void => {
    void createWindow();
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
      void createWindow();
    }
  });
} else {
  console.log('single instance lock rejected');
}
