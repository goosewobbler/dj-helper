import * as express from 'express';
import * as url from 'url';
import { Service } from '../../common/types';

const nextPageServerPort = 4001;
const pageServers: { [Key: string]: number } = {};

const headScript = (): string => `<script src="http://localhost:3333/socket.io/socket.io.js"></script>`;
const bodyScript =
  '<script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script>';

const extractHtml = (body: string): string => {
  // Old versions of morph-cli v15 and below used to incorrectly JSON-encode text/html responses.
  // As of morph-cli v16.X, this is no logner the case, matching the behaviour of the renderers.
  // We should support either version.
  try {
    const parsed = JSON.parse(body);
    return typeof parsed === 'string' ? parsed : body;
  } catch (ex) {
    return body;
  }
};

const createResponse = (body: string, statusCode: number): string => {
  if (statusCode === 404 && (!body || body === '{}')) {
    return `<!doctype html><html lang="en-gb"><head><style>*{margin:0;padding:0;}body{padding:16px;}</style></head><body><pre style="font-size: 48px;">404 😕</pre></body></html>`;
  }
  return extractHtml(body)
    .replace('<head>', `<head>${headScript()}`)
    .replace('</body>', `${bodyScript}</body>`);
};

const start = async (server: express.Express, port: number): Promise<void> => {
  await new Promise((resolve): void => {
    server.listen(port, (): void => {
      resolve();
    });
  });
};

const createPageServer = (service: Service, componentName: string): express.Express => {
  const server = express();

  server.get(
    '*',
    async (req, res): Promise<void> => {
      try {
        const { accept } = req.headers;
        const history = !accept || accept.indexOf('text/html') !== -1;
        const query = url.parse(req.url).query || '';
        const path = req.path + (query ? `?${query}` : '');

        const props = {
          closeEnvelope: 'true',
          path,
        };

        const { body, headers } = await service.request(componentName, props, history);
        const pageStatusCode = Number(headers['x-page-status-code']) || 200;
        const pageLocation = headers['x-page-location'];
        if (pageLocation) {
          res.set('Location', pageLocation);
        }
        res
          .status(pageStatusCode)
          .set(headers)
          .set('Content-Type', 'text/html')
          .send(createResponse(body, pageStatusCode));
      } catch (ex) {
        res.status(500).send(ex.message);
      }
    },
  );

  return server;
};

const startPageServer = async (service: Service, name: string): Promise<number> => {
  if (name in pageServers) {
    return pageServers[name];
  }

  const port = nextPageServerPort + 1;
  pageServers[name] = port;
  await start(createPageServer(service, name), port);
  return port;
};

export default startPageServer;
