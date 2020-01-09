/* eslint-disable no-console */
import { app, BrowserWindow } from 'electron';
import startServer from './server';
import { logError } from './helpers/console';

if (module.hot) {
  module.hot.accept();
}

const isDev = process.env.NODE_ENV === 'development';

let mainWindow: BrowserWindow | undefined;

if (process.env.NODE_ENV === 'production') {
  import('source-map-support').then(sourceMapSupport => sourceMapSupport.install());
}

if (isDev || process.env.DEBUG_PROD === 'true') {
  import('electron-debug').then(electronDebug => electronDebug.default());
}

const installExtensions = async (): Promise<string | void> => {
  const electronDevtoolsInstaller = await import('electron-devtools-installer');
  const { REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF } = electronDevtoolsInstaller;
  const installer = electronDevtoolsInstaller.default;
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = [REACT_DEVELOPER_TOOLS, REDUX_DEVTOOLS, REACT_PERF];

  console.log('\nInstalling Developer Tools...');

  return installer(extensions, forceDownload)
    .then((
      extensionNames: unknown, // electron-devtools-installer typedefs are wrong for the array of extensions case
    ) => (extensionNames as string[]).forEach(name => console.log(`Added Extension:  ${name}`)))
    .catch(err => console.log('An error occurred: ', err));
};

async function createWindow(): Promise<void> {
  if (process.env.NODE_ENV === 'development' || process.env.DEBUG_PROD === 'true') {
    await installExtensions();
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

  // mainWindow.show();
  // mainWindow.webContents.openDevTools();

  mainWindow.once('ready-to-show', () => {
    (mainWindow as BrowserWindow).show();
    (mainWindow as BrowserWindow).webContents.openDevTools();
  });

  mainWindow.on('closed', (): void => {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = undefined;
  });
}

app.on('ready', () => {
  createWindow();
});

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
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
