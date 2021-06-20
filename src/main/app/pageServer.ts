import express from 'express';
import * as url from 'url';

import { socketIoLibraryScript, socketIoPageReloadScript } from '../helpers/scripts';
import { Service, Store } from '../../common/types';

const nextPageServerPort = 5001;
const pageServers: { [Key: string]: number } = {};

const createResponseBody = (body: string, statusCode: number): string => {
  if (statusCode === 404 && (!body || body === '{}')) {
    return `<!doctype html><html lang="en-gb"><head><style>*{margin:0;padding:0;}body{padding:16px;}</style></head><body><pre style="font-size: 48px;">404 😕</pre></body></html>`;
  }
  return body;
};

const appendSocketReloadScript = (responseBody: string, componentPort: number): string =>
  responseBody
    .replace('<head>', `<head>${socketIoLibraryScript(componentPort)}`)
    .replace('</body>', `${socketIoPageReloadScript(componentPort)}</body>`);

const start = async (server: express.Express, port: number): Promise<void> => {
  await new Promise((resolve): void => {
    server.listen(port, (): void => {
      resolve();
    });
  });
};

const createPageServer = (service: Service, componentName: string, componentPort: number): express.Express => {
  const server = express();

  server.get(
    '*',
    async (req, res): Promise<void> => {
      try {
        const { accept } = req.headers;
        const history = !accept || accept.includes('text/html');
        const query = url.parse(req.url).query || '';
        const path = req.path + (query ? `?${query}` : '');

        const props = {
          closeEnvelope: 'true',
          path,
        };

        const { body, headers } = await service.request(componentName, props, history);
        const pageStatusCode = Number(headers.get('x-page-status-code')) || 200;
        const pageLocation = headers.get('x-page-location');
        if (pageLocation) {
          res.set('Location', pageLocation);
        }
        const basicResponseBody = createResponseBody(body, pageStatusCode);
        const responseBody = appendSocketReloadScript(basicResponseBody, componentPort);
        res.status(pageStatusCode).set(headers).set('Content-Type', 'text/html').send(responseBody);
      } catch ({ message }) {
        res.status(500).send(message);
      }
    },
  );

  return server;
};

const startPageServer = async (service: Service, name: string, config: Store): Promise<number> => {
  if (name in pageServers) {
    return pageServers[name];
  }

  const componentPort = config.get('componentPort');
  const port = nextPageServerPort + 1;
  pageServers[name] = port;
  await start(createPageServer(service, name, componentPort as number), port);
  return port;
};

export default startPageServer;
