import path from 'path';
import { app, BrowserView, BrowserWindow } from 'electron';
import { createApp } from './app';
import { log } from './helpers/console';

const isDev = process.env.NODE_ENV === 'development';
const isProd = process.env.NODE_ENV === 'production';
const isDebugMode = isDev || process.env.DEBUG_PROD === 'true';

if (isDev) {
  (module as any).hot?.accept(); //eslint-disable-line
}

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

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    show: false,
    height: 1000,
    width: 1100,
    webPreferences: {
      preload: path.resolve(__dirname, '../renderer/preload.js'),
    },
  });

  mainWindow.webContents.session.webRequest.onHeadersReceived(
    { urls: ['*://*/*'] },
    ({ responseHeaders }, callback) => {
      if (responseHeaders) {
        Object.keys(responseHeaders)
          .filter((x) => x.toLowerCase() === 'x-frame-options')
          .map((x) => delete responseHeaders[x]);

        callback({
          cancel: false,
          responseHeaders,
        });
      }
    },
  );

  const view = new BrowserView();
  mainWindow.setBrowserView(view);
  view.setBounds({ x: 200, y: 100, width: 800, height: 1500 });
  void view.webContents.loadURL('https://bandcamp.com');

  // before loadUrl
  // read cookie from electron-store
  // view.webContents.session.cookies.set('loginCookie')

  // upon login (webContents.did-navigate?)
  // view.webContents.session.cookies.get('loginCookie')
  // write cookie to electron-store

  // Session.defaultSession.cookies.set({ url: 'https://bandcamp.com', sameSite: 'lax' }).then(
  //   () => {
  //     // success
  //   },
  //   (error) => {
  //     console.error(error);
  //   },
  // );

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
  log('single instance lock rejected');
}
