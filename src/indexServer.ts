import { Server } from 'http';
import socketIo from 'socket.io';
import createApp from './server/app/app';
import { system } from './server/system';
import { log } from './server/helpers/console';
import { ComponentData } from './common/types';
import { configValue } from './server/app/config';

const startServer = async (): Promise<configValue> => {
  let sendComponentData: (data: ComponentData) => void;
  let sendReload: () => void;
  let sendUpdated: () => void;

  const onComponentUpdate = (data: ComponentData): void => {
    if (sendComponentData) {
      sendComponentData(data);
    }
  };

  const onReload = (): void => {
    if (sendReload) {
      sendReload();
    }
  };

  const onUpdated = (): void => {
    if (sendUpdated) {
      sendUpdated();
    }
  };

  const { api, component, service, config } = await createApp(
    system,
    onComponentUpdate,
    onReload,
    onUpdated,
    process.env.npm_package_version,
  );
  const apiServer = new Server(api);
  const componentServer = new Server(component);
  const io = socketIo(apiServer);

  let apiPort = config.getValue('apiPort');
  let componentPort = config.getValue('componentPort');

  if (!apiPort) {
    apiPort = 4444;
    config.setValue('apiPort', apiPort);
  }

  if (!componentPort) {
    componentPort = 4000;
    config.setValue('componentPort', componentPort);
  }

  sendComponentData = (data: ComponentData): void => {
    io.emit('component', data);
  };

  sendReload = (): void => {
    io.emit('reload');
  };

  sendUpdated = (): void => {
    io.emit('updated');
  };

  await new Promise((resolve): void => {
    apiServer.listen(apiPort, (): void => {
      resolve();
    });
  });

  await new Promise((resolve): void => {
    componentServer.listen(componentPort, (): void => {
      resolve();
    });
  });

  const url = `http://localhost:${apiPort}`;
  log(`[console] Running at ${url}`);

  io.on('connection', (): void => {
    io.emit('freshState', service.getComponentsData());
  });

  return apiPort;
};

export default startServer;
