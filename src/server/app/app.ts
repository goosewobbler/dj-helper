import { join } from 'path';
import { Express } from 'express';
import * as appRoot from 'app-root-path';

import { createService } from '../service';
import { System } from '../system';
import createApiServer from './apiServer';
import createComponentServer from './componentServer';
import { createConfig, Config } from './config';
import { createState } from './state';
import { createUpdater } from './updater';

import { ComponentData, Service } from '../../common/types';

interface App {
  api: Express;
  component: Express;
  config: Config;
  devMode: boolean;
  service: Service;
}

const createApp = async (
  system: System,
  onComponentUpdate: (data: ComponentData) => void,
  onReload: () => void,
  onUpdated: () => void,
  currentVersion: string,
): Promise<App> => {
  system.process.log(`Morph Developer Console v${currentVersion} is starting...`);

  const devMode = (await system.process.getCommandLineArgs()).indexOf('-D') !== -1;
  const currentWorkingDirectory = await system.process.getCurrentWorkingDirectory();
  const componentsDirectory = devMode ? join(currentWorkingDirectory, '../morph-modules') : currentWorkingDirectory;
  const routingFilePath = `${appRoot}/.routing.json`;
  const configFilePath = join(componentsDirectory, 'morph-developer-console-config.json');
  const config = await createConfig(configFilePath, system);
  const stateFilePath = join(componentsDirectory, 'morph-developer-console-state.json');
  const state = await createState(stateFilePath, system);
  const updater = createUpdater(system, currentVersion);

  process.env.APP_ROOT_PATH = appRoot.toString();

  const service = await createService(system, config, state, onComponentUpdate, onReload, {
    componentsDirectory,
    routingFilePath,
  });

  return {
    api: createApiServer(service, config, updater, onUpdated),
    component: createComponentServer(service),
    config,
    devMode,
    service,
  };
};

export default createApp;
