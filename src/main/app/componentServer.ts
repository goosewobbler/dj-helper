import express from 'express';

import { LooseObject, Service, Store } from '../../common/types';
import { socketIoLibraryScript, socketIoPageReloadScript } from '../helpers/scripts';

const convertPropsString = (propsString: string): LooseObject => {
  const props: LooseObject = {};
  const parts = propsString.split('/');

  for (let i = 1; i < parts.length; i += 2) {
    props[decodeURIComponent(parts[i])] = decodeURIComponent(parts[i + 1]);
  }

  return props;
};

const createViewPage = (
  response: { head: string[]; bodyInline: string; bodyLast: string[] },
  apiPort: number,
): string =>
  `<!doctype html>
   <html class="b-pw-1280">
     <head>
       <meta charset="utf-8">
       <meta http-equiv="x-ua-compatible" content="ie=edge">
       <meta name="viewport" content="width=device-width, initial-scale=1">
       <link rel="shortcut icon" type="image/png" href="http://localhost:${apiPort}/image/icon/morph.png"/>
       ${socketIoLibraryScript(apiPort)}
       ${(response.head || []).join('')}
       <style>body {font-size: 62.5%;line-height: 1;}</style>
     </head>
     <body>
       ${response.bodyInline}
       <script src="//m.int.files.bbci.co.uk/modules/vendor/requirejs/2.1.20/require.min.js"></script>
       ${(response.bodyLast || []).join('')}
       ${socketIoPageReloadScript(apiPort)}
     </body>
   </html>`;

const createComponentServer = (service: Service, config: Store): express.Express => {
  const server = express();

  server.get(
    '/data/:name*',
    async (req, res): Promise<void> => {
      try {
        const { accept } = req.headers;
        const history = !accept || accept.indexOf('text/html') !== -1;
        const propsString = req.path.replace(`/data/${req.params.name}`, '');
        const { body, headers, statusCode } = await service.request(
          req.params.name,
          convertPropsString(propsString),
          history,
        );
        res
          .status(statusCode)
          .set(headers)
          .send(body);
      } catch (ex) {
        res.status(500).send(ex.message);
      }
    },
  );

  server.get(
    '/view/:name*',
    async (req, res): Promise<void> => {
      try {
        const { accept } = req.headers;
        const history = !accept || accept.indexOf('text/html') !== -1;
        const propsString = req.path.replace(`/view/${req.params.name}`, '');
        const { body, headers, statusCode } = await service.request(
          req.params.name,
          convertPropsString(propsString),
          history,
        );
        if (statusCode === 200) {
          const apiPort = config.get('apiPort');
          res.send(createViewPage(JSON.parse(body), apiPort as number));
        } else {
          res
            .status(statusCode)
            .set(headers)
            .send(body);
        }
      } catch (ex) {
        res.status(500).send(ex.message);
      }
    },
  );

  server.get(
    '/proxy/:name*',
    async (req, res): Promise<void> => {
      try {
        const propsString = req.path.replace(`/proxy/${req.params.name}`, '');
        const { body, headers, statusCode } = await service.request(
          req.params.name,
          convertPropsString(propsString),
          false,
        );
        res
          .status(statusCode)
          .set(headers)
          .send(body);
      } catch (ex) {
        res.status(500).send(ex.message);
      }
    },
  );

  return server;
};

export default createComponentServer;
