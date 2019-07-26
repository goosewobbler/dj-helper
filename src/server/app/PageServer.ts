import * as express from 'express';
import * as url from 'url';

import IConfig from '../types/IConfig';
import IService from '../types/IService';
import ceefaxStyle from './helpers/ceefaxStyle';

const headScript = (config: IConfig) =>
  `<script src="http://localhost:3333/socket.io/socket.io.js"></script>${config.getValue('ceefax') === true
    ? ceefaxStyle
    : ''}`;
const bodyScript =
  '<script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script>';

const extractHtml = (body: string) => {
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

const createResponse = (config: IConfig, body: string, statusCode: number) => {
  if (statusCode === 404 && (!body || body === '{}')) {
    return `<!doctype html><html lang="en-gb"><head><style>*{margin:0;padding:0;}body{padding:16px;}</style></head><body><pre style="font-size: 48px;">404 😕</pre></body></html>`;
  }
  return extractHtml(body)
    .replace('<head>', `<head>${headScript(config)}`)
    .replace('</body>', `${bodyScript}</body>`);
};

const createPageServer = (service: IService, config: IConfig, componentName: string) => {
  const server = express();

  server.get('*', async (req, res) => {
    try {
      const accept = req.headers.accept;
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
        .send(createResponse(config, body, pageStatusCode));
    } catch (ex) {
      res.status(500).send(ex.message);
    }
  });

  return server;
};

export default createPageServer;
