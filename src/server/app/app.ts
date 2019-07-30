import { Express } from 'express';
import { join } from 'path';
import * as appRoot from 'app-root-path';

import { createService } from '../service';
import { System } from '../system';
import { ComponentData } from '../service/Component';
import { createApiServer } from './apiServer';
import { createComponentServer } from './componentServer';
import { createConfig } from './config';
import { createPageServer } from './pageServer';
import { createState } from './state';
import { createUpdater } from './updater';

const createApp = async (
  system: System,
  onComponentUpdate: (data: ComponentData) => void,
  onReload: () => void,
  onUpdated: () => void,
  startServer: (server: Express, port: number) => Promise<void>,
  currentVersion: string,
) => {
  system.process.log(`Morph Developer Console v${currentVersion} is starting...`);

  let nextPageServerPort = 4001;
  const pageServers: { [Key: string]: number } = {};

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

  const startPageServer = async (name: string) => {
    if (name in pageServers) {
      return pageServers[name];
    }

    const port = nextPageServerPort++;
    pageServers[name] = port;
    await startServer(createPageServer(service, config, name), port);
    return port;
  };

  const service = await createService(system, config, state, onComponentUpdate, onReload, startPageServer, {
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

export { createApp };
