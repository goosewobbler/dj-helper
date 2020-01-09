import * as React from 'react';
import { Provider } from 'react-redux';
import { ipcMain } from 'electron';
import { renderToString } from 'react-dom/server';
import App from '../../renderer/components/App';
import { Service, ModuleType, BumpType, Store, AppState } from '../../common/types';
import { logError, log } from '../helpers/console';
import createReduxStore from '../../renderer/reduxStore';

const componentTypeMap: { [Key: string]: ModuleType } = {
  data: ModuleType.Data,
  view: ModuleType.View,
  viewcss: ModuleType.ViewCSS,
};

const setupRendererComms = (mainWindow: Electron.BrowserWindow, service: Service, config: Store): void => {
  log('setting up renderer comms');

  ipcMain.on('get-app-setup', (): void => {
    log('get-app-setup requested');
    const { components, editors } = service.getComponentsSummaryData();
    const theme = service.getTheme();

    const initialState: AppState = {
      components,
      ui: {
        editors,
        theme,
      },
    };

    const reduxStore = createReduxStore(initialState);
    const componentPort = config.get('componentPort') as number;
    const html = renderToString(
      <Provider store={reduxStore}>
        <App componentPort={componentPort} />
      </Provider>,
    );

    const preloadedState = reduxStore.getState();
    const dynamicCSS = `mark{background-color:${theme.highlightColour};}`;

    mainWindow.webContents.send('app-setup', { initialState: preloadedState, dynamicCSS, html, componentPort });
  });

  ipcMain.on('get-components-data', (): void =>
    mainWindow.webContents.send('components-data', service.getComponentsSummaryData()),
  );

  ipcMain.on('get-dependency-graph', (event, componentName): void =>
    mainWindow.webContents.send('dependency-graph', service.getDependencyGraph(componentName)),
  );

  ipcMain.on('get-dependant-graph', (event, componentName): void =>
    mainWindow.webContents.send('dependant-graph', service.getDependantGraph(componentName)),
  );

  ipcMain.on('update-component-versions', (event, componentName): void => {
    service.fetchDetails(componentName).catch(logError);
  });

  ipcMain.on('start-component', (event, componentName): void => {
    service.start(componentName).catch(logError);
  });

  ipcMain.on('stop-component', (event, componentName): void => {
    service.stop(componentName).catch(logError);
  });

  ipcMain.on('install-component', (event, componentName): void => {
    service.reinstall(componentName).catch(logError);
  });

  ipcMain.on('build-component', (event, componentName): void => {
    service.build(componentName).catch(logError);
  });

  ipcMain.on('favourite-component', (event, componentName, favourite): void => {
    service.setFavourite(componentName, favourite === 'true').catch(logError);
  });

  ipcMain.on('cache-component', (event, componentName, useCache): void => {
    service.setUseCache(componentName, useCache === 'true').catch(logError);
  });

  ipcMain.on('promote-component', (event, componentName, environment): void => {
    service.promote(componentName, environment).catch(logError);
  });

  ipcMain.on('link-component', (event, componentName, dependency): void => {
    service.link(componentName, dependency).catch(logError);
  });

  ipcMain.on('unlink-component', (event, componentName, dependency): void => {
    service.unlink(componentName, dependency).catch(logError);
  });

  ipcMain.on('edit-component', (event, componentName): void => {
    service.openInEditor(componentName).catch(logError);
  });

  ipcMain.on('bump-component', (event, componentName, type): void => {
    service
      .bump(componentName, type as BumpType)
      .then((url: string | void | null) => mainWindow.webContents.send('component-bumped', { url }))
      .catch(logError);
  });

  ipcMain.on('clone-component', (event, componentName, cloneName, cloneDescription): void => {
    service
      .clone(componentName, cloneName, { description: cloneDescription })
      .then(() => mainWindow.webContents.send('component-cloned'))
      .catch(logError);
  });

  ipcMain.on('create-component', (event, componentName, componentType, componentDescription): void => {
    service
      .create(componentName, componentTypeMap[componentType], { description: componentDescription })
      .then(() => mainWindow.webContents.send('component-created'))
      .catch(logError);
  });
};

export default setupRendererComms;
