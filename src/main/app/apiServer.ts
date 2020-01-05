import { json } from 'body-parser';
import cors from 'cors';
import express from 'express';
import { readFileSync } from 'graceful-fs';
import { join } from 'path';
import renderIndex from './indexRenderer';
import { Service, Store } from '../../common/types';

const createApiServer = (service: Service, config: Store): express.Express => {
  const app = express();

  const publicPath = join(__dirname, '../../../dist');
  const staticPath = join(__dirname, '../../../static');

  app.use(cors());
  app.use(json());

  app.get('/', (req, res): void => {
    res.send(renderIndex(service, config, readFileSync(join(publicPath, 'index.html'), 'utf-8')));
  });

  app.get('/component/:name', (req, res): void => {
    res.send(renderIndex(service, config, readFileSync(join(publicPath, 'index.html'), 'utf-8'), req.params.name));
  });

  app.get('/local-push.js', (req, res): void => {
    const pollInterval = String(config.get('livePushPollInterval') || 10000);
    const js = readFileSync(join(publicPath, 'local-push.js'), 'utf-8');
    const modifiedJs = js.replace('POLL_INTERVAL_FROM_CONFIG', pollInterval);

    res.contentType('application/javascript').send(modifiedJs);
  });

  app.use(express.static(publicPath));

  app.use(
    express.static(staticPath, {
      maxAge: 31536000,
    }),
  );

  return app;
};

export default createApiServer;
