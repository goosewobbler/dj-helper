import { join } from 'path';
import { Express } from 'express';
import appRoot from 'app-root-path';

import createService from '../service';
import createApiServer from './apiServer';
import createComponentServer from './componentServer';
import createStore from '../helpers/store';
import { ComponentData, Service, System, Store } from '../../common/types';
import setupRendererComms from './rendererComms';

interface App {
  api: Express;
  component: Express;
  config: Store;
  devMode: boolean;
  service: Service;
}

const createApp = async (
  mainWindow: Electron.BrowserWindow,
  system: System,
  onComponentUpdate: (data: ComponentData) => void,
  onReload: () => void,
  onUpdated: () => void,
  currentVersion: string,
): Promise<App> => {
  const devMode = process.env.NODE_ENV === 'development';

  system.process.log(
    `Morph Developer Console v${currentVersion} is starting${devMode ? ' in development mode...' : '...'}`,
  );

  const currentWorkingDirectory = await system.process.getCurrentWorkingDirectory();
  const componentsDirectory = devMode ? join(currentWorkingDirectory, '../morph-modules') : currentWorkingDirectory;
  const configFilePath = join(componentsDirectory, 'morph-developer-console-config.json');
  const config = await createStore(configFilePath, system);
  const stateFilePath = join(componentsDirectory, 'morph-developer-console-state.json');
  const state = await createStore(stateFilePath, system);
  const routingFilePath = `${appRoot}/.routing.json`;
  const routing = await createStore(routingFilePath, system);

  system.process.log(`Components directory: ${componentsDirectory}`);

  process.env.APP_ROOT_PATH = appRoot.toString();

  const service = await createService(system, config, state, routing, onComponentUpdate, onReload, componentsDirectory);

  setupRendererComms(mainWindow);

  return {
    api: createApiServer(service, config),
    component: createComponentServer(service, config),
    config,
    devMode,
    service,
  };
};

export default createApp;
