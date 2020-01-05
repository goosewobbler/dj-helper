/* eslint-disable no-console */
import { app, BrowserWindow } from 'electron';
import startServer from './server';
import { logError } from './helpers/console';

if (module.hot) {
  module.hot.accept();
}
const isDev = process.env.NODE_ENV === 'development';

let mainWindow: Electron.BrowserWindow;

if (process.env.NODE_ENV === 'production') {
  import('source-map-support').then(sourceMapSupport => sourceMapSupport.install());
}

if (isDev || process.env.DEBUG_PROD === 'true') {
  import('electron-debug').then(electronDebug => electronDebug.default());
}

async function createWindow(): Promise<void> {
  mainWindow = new BrowserWindow({
    height: 800,
    width: 1200,
    show: false,
    webPreferences: {
      nodeIntegration: true,
    },
  });

  const apiPort = await startServer(mainWindow).catch(logError);

  console.log(`Server running on ${apiPort}`);

  mainWindow.loadURL(`http://localhost:${apiPort}/`);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.webContents.openDevTools();
  });

  // Emitted when the window is closed.
  mainWindow.on('closed', (): void => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    // mainWindow = null;
  });

  // mainWindow.once('ready-to-show', () => {
  //   mainWindow.show();
  // });
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', (): void => {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', (): void => {
  // On OS X it"s common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow();
  }
});
