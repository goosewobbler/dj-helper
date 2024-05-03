import { fileURLToPath } from 'node:url';

import { app, BrowserWindow } from 'electron';

import { createApp } from './app.js';
import { log } from './helpers/console.js';

const appPath = app.getAppPath();
const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isDebugMode = isDev || process.env.DEBUG_PROD === 'true';
const appRootPath = `${appPath}${app.isPackaged ? '/bundle' : ''}`;

let mainWindow: BrowserWindow | undefined;

void (async () => {
  if (isProd) {
    const sourceMapSupport = await import('source-map-support');
    sourceMapSupport.install();
  }

  if (isDebugMode) {
    const electronDebug = await import('electron-debug');
    electronDebug.default();
  }
})();

// process.on('SIGSTOP', () => {
//   log('Received SIGSTOP. Closing...');
//   mainWindow?.close();
// });

// console.log('ZOMG', fileURLToPath(new URL('../preload/index.mjs', import.meta.url)));

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    show: false,
    height: 1000,
    width: 1500,
    webPreferences: {
      contextIsolation: true,
      sandbox: false,
      preload: fileURLToPath(new URL('../preload/index.mjs', import.meta.url)),
    },
  });

  // disable Windows application menu
  mainWindow.setMenu(null);

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

  if (isDebugMode) {
    const { installDevToolsExtensions } = await import('./helpers/dev.js');
    void (await installDevToolsExtensions());
  }

  void (await createApp(mainWindow, isDev));

  const htmlRoot = isDev ? 'http://localhost:5173' : `file:///${appRootPath}/out/renderer`;
  void (await mainWindow.loadURL(`${htmlRoot}/index.html`));
}

if (app.requestSingleInstanceLock()) {
  app.on('second-instance', () => {
    // Someone tried to run a second instance, we should focus our window.
    log('second instance requested');
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        log('restoring main window');
        mainWindow.restore();
      }
      log('focussing main window');
      mainWindow.focus();
    }
  });

  app.on('ready', (): void => {
    void createWindow();
  });

  app.on('window-all-closed', () => {
    // Respect the OSX convention of having the application in memory even
    // after all windows have been closed
    if (isDev || process.platform !== 'darwin') {
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
  log('single instance lock rejected');
}
