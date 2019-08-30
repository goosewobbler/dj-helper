import { Server } from 'http';
import socketIo from 'socket.io';
import createApp from './server/app/app';
import { system } from './server/system';
import { log } from './server/helpers/console';
import { ComponentData } from './common/types';

const startServer = async (): Promise<void> => {
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

  const { api, component, service } = await createApp(
    system,
    onComponentUpdate,
    onReload,
    onUpdated,
    process.env.npm_package_version,
  );
  const apiServer = new Server(api);
  const componentServer = new Server(component);
  const io = socketIo(apiServer);

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
    apiServer.listen(3333, (): void => {
      resolve();
    });
  });

  await new Promise((resolve): void => {
    componentServer.listen(4000, (): void => {
      resolve();
    });
  });

  const url = 'http://localhost:3333';
  log(`[console] Running at ${url}`);

  io.on('connection', (): void => {
    io.emit('freshState', service.getComponentsData());
  });
};

export default startServer;
