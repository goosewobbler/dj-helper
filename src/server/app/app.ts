import { Express } from 'express';
import { join } from 'path';

import ComponentData from '../../types/IComponentData';
import Service from '../service/Service';
import ISystem from '../types/ISystem';
import createApiServer from './ApiServer';
import createComponentServer from './ComponentServer';
import Config from './Config';
import createPageServer from './PageServer';
import State from './State';
import Updater from './Updater';

const createApp = async (
  system: ISystem,
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
  const routingFilePath = '/tmp/morph-developer-console-routing.json';
  const configFilePath = join(componentsDirectory, 'morph-developer-console-config.json');
  const config = await Config(configFilePath, system);
  const stateFilePath = join(componentsDirectory, 'morph-developer-console-state.json');
  const state = await State(stateFilePath, system);
  const updater = Updater(system, currentVersion);

  const startPageServer = async (name: string) => {
    if (name in pageServers) {
      return pageServers[name];
    }

    const port = nextPageServerPort++;
    pageServers[name] = port;
    await startServer(createPageServer(service, config, name), port);
    return port;
  };

  const service = await Service(system, config, state, onComponentUpdate, onReload, startPageServer, {
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
