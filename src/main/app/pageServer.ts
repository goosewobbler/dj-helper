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

  // Old versions of morph-cli v15 and below used to incorrectly JSON-encode text/html responses.
  // As of morph-cli v16.X, this is no longer the case, matching the behaviour of the renderers.
  // We should support either version.
  try {
    const parsed = JSON.parse(body);
    return typeof parsed === 'string' ? parsed : body;
  } catch (ex) {
    return body;
  }
};

const appendSocketReloadScript = (responseBody: string, apiPort: number): string =>
  responseBody
    .replace('<head>', `<head>${socketIoLibraryScript(apiPort)}`)
    .replace('</body>', `${socketIoPageReloadScript(apiPort)}</body>`);

const start = async (server: express.Express, port: number): Promise<void> => {
  await new Promise((resolve): void => {
    server.listen(port, (): void => {
      resolve();
    });
  });
};

const createPageServer = (service: Service, componentName: string, apiPort: number): express.Express => {
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
        const pageStatusCode = Number(headers['x-page-status-code']) || 200;
        const pageLocation = headers['x-page-location'] as string;
        if (pageLocation) {
          res.set('Location', pageLocation);
        }
        const basicResponseBody = createResponseBody(body, pageStatusCode);
        const responseBody = appendSocketReloadScript(basicResponseBody, apiPort);
        res
          .status(pageStatusCode)
          .set(headers)
          .set('Content-Type', 'text/html')
          .send(responseBody);
      } catch (ex) {
        res.status(500).send(ex.message);
      }
    },
  );

  return server;
};

const startPageServer = async (service: Service, name: string, config: Store): Promise<number> => {
  if (name in pageServers) {
    return pageServers[name];
  }

  const apiPort = config.get('apiPort');
  const port = nextPageServerPort + 1;
  pageServers[name] = port;
  await start(createPageServer(service, name, apiPort as number), port);
  return port;
};

export default startPageServer;
