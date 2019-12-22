import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { readFileSync } from 'graceful-fs';
import { join } from 'path';

import { Updater } from './updater';
import createApiComponentRouter from './apiComponentRouter';
import renderIndex from './indexRenderer';
import { logError } from '../helpers/console';
import { Service, Store } from '../../common/types';

const createApiServer = (service: Service, config: Store, updater: Updater, onUpdated: () => void): express.Express => {
  const app = express();

  const publicPath = join(__dirname, '../../../public');
  const staticPath = join(__dirname, '../../../static');

  app.use(cors());
  app.use(json());

  app.use('/api/component', createApiComponentRouter(service));

  app.get(
    '/api/status',
    async (req, res): Promise<void> => {
      await updater
        .getStatus()
        .then((status): express.Response => res.json(status))
        .catch(logError);
    },
  );

  app.post(
    '/api/update',
    async (req, res): Promise<void> => {
      res.send('🤔');
      await updater
        .update()
        .then(onUpdated)
        .catch(logError);
    },
  );

  app.get('/local-push.js', (req, res): void => {
    const pollInterval = String(config.get('livePushPollInterval') || 10000);
    const js = readFileSync(join(publicPath, 'local-push.js'), 'utf-8');
    const modifiedJs = js.replace('POLL_INTERVAL_FROM_CONFIG', pollInterval);

    res.contentType('application/javascript').send(modifiedJs);
  });

  app.get(
    '/',
    async (req, res): Promise<void> => {
      res.send(await renderIndex(service, config, readFileSync(join(publicPath, 'index.html'), 'utf-8')));
    },
  );

  app.get(
    '/component/:name',
    async (req, res): Promise<void> => {
      res.send(
        await renderIndex(service, config, readFileSync(join(publicPath, 'index.html'), 'utf-8'), req.params.name),
      );
    },
  );

  app.use(express.static(publicPath));

  app.use(
    express.static(staticPath, {
      maxAge: 31536000,
    }),
  );

  return app;
};

export default createApiServer;
