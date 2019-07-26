import { json } from 'body-parser';
import * as cors from 'cors';
import * as express from 'express';
import { readFileSync } from 'graceful-fs';
import { join } from 'path';

import IConfig from '../types/IConfig';
import IService from '../types/IService';
import IUpdater from '../types/IUpdater';
import createApiComponentRouter from './ApiComponentRouter';
import renderIndex from './indexRenderer';

const createServer = (service: IService, config: IConfig, updater: IUpdater, onUpdated: () => void) => {
  const app = express();

  const publicPath = join(__dirname, '../../../public');
  const staticPath = join(__dirname, '../../../static');

  app.use(cors());
  app.use(json());

  app.use('/api/component', createApiComponentRouter(service));

  app.get('/api/status', async (req, res) => {
    updater
      .getStatus()
      .then(status => res.json(status))
      .catch(console.error);
  });

  app.post('/api/update', async (req, res) => {
    updater
      .update()
      .then(onUpdated)
      .catch(console.error);
    res.send('🤔');
  });

  app.get('/local-push.js', (req, res) => {
    const pollInterval = String(config.getValue('livePushPollInterval') || 10000);
    const js = readFileSync(join(publicPath, 'local-push.js'), 'utf-8');
    const modifiedJs = js.replace('POLL_INTERVAL_FROM_CONFIG', pollInterval);

    res.contentType('application/javascript').send(modifiedJs);
  });

  app.get('/', async (req, res) => {
    res.send(await renderIndex(service, readFileSync(join(publicPath, 'index.html'), 'utf-8')));
  });

  app.get('/component/:name', async (req, res) => {
    res.send(await renderIndex(service, readFileSync(join(publicPath, 'index.html'), 'utf-8'), req.params.name));
  });

  app.use(express.static(publicPath));

  app.use(
    express.static(staticPath, {
      maxAge: 31536000,
    }),
  );

  return app;
};

export default createServer;
