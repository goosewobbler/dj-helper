import { spawn } from 'child_process';
import { Express } from 'express';
import { Server } from 'http';
import { join } from 'path';
import * as socketIo from 'socket.io';
import createApp from './server/app/app';
import System from './server/system/System';
import IComponentData from './types/IComponentData';

const startServer = async () => {
  let sendComponentData: (data: IComponentData) => void;
  let sendReload: () => void;
  let sendUpdated: () => void;

  const onComponentUpdate = (data: IComponentData) => {
    if (sendComponentData) {
      sendComponentData(data);
    }
  };

  const onReload = () => {
    if (sendReload) {
      sendReload();
    }
  };

  const onUpdated = () => {
    if (sendUpdated) {
      sendUpdated();
    }
  };

  const startServer = async (server: Express, port: number) => {
    await new Promise(resolve => {
      server.listen(port, () => {
        resolve();
      });
    });
  };

  const packageJSON = require(join(__dirname, '../package.json'));

  const { api, component, devMode, config, service } = await createApp(
    System,
    onComponentUpdate,
    onReload,
    onUpdated,
    startServer,
    packageJSON.version,
  );
  const apiServer = new Server(api);
  const componentServer = new Server(component);
  const io = socketIo(apiServer);

  sendComponentData = (data: IComponentData) => {
    io.emit('component', data);
  };

  sendReload = () => {
    io.emit('reload');
  };

  sendUpdated = () => {
    io.emit('updated');
  };

  await new Promise(resolve => {
    apiServer.listen(3333, () => {
      resolve();
    });
  });

  await new Promise(resolve => {
    componentServer.listen(4000, () => {
      resolve();
    });
  });

  const url = 'http://localhost:3333';
  console.log(`[console] Running at ${url}`);

  const canOpen = config.getValue('openOnStart') !== false;

  if (!devMode && canOpen) {
    spawn('open', [url]);
  }

  io.on('connection', socket => {
    io.emit('freshState', service.getComponentsData());
  });
};

export default startServer;
