import { Server } from 'http';
import socketIo from 'socket.io';
import createApp from './app/app';
import system from './system';
import { log } from './helpers/console';
import { ComponentData } from '../common/types';

const startServer = async (mainWindow: Electron.BrowserWindow): Promise<number> => {
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

  const { component, service, config } = await createApp(
    mainWindow,
    system,
    onComponentUpdate,
    onReload,
    onUpdated,
    process.env.npm_package_version!, // TODO: Tech debt
  );
  const componentServer = new Server(component);
  const io = socketIo(componentServer);

  let componentPort = config.get('componentPort') as number;

  if (!componentPort) {
    componentPort = 4000;
    void (await config.set('componentPort', componentPort));
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
    componentServer.listen(componentPort, (): void => {
      resolve();
    });
  });

  log(`[console] Component server running at http://localhost:${componentPort}`);

  io.on('connection', (): void => {
    io.emit('freshState', service.getComponentsData());
  });

  return componentPort;
};

export default startServer;
