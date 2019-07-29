import * as express from 'express';

import Service from '../types/Service';

const convertPropsString = (propsString: string) => {
  const props: { [Key: string]: string } = {};
  const parts = propsString.split('/');

  for (let i = 1; i < parts.length; i += 2) {
    props[decodeURIComponent(parts[i])] = decodeURIComponent(parts[i + 1]);
  }

  return props;
};

const createViewPage = (response: { head: string[]; bodyInline: string; bodyLast: string[] }) =>
  [
    '<!doctype html>',
    '<html class="b-pw-1280">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta http-equiv="x-ua-compatible" content="ie=edge">',
    '<meta name="viewport" content="width=device-width, initial-scale=1">',
    '<link rel="shortcut icon" type="image/png" href="http://localhost:3333/image/icon/morph.png"/>',
    '<script src="http://localhost:3333/socket.io/socket.io.js"></script>',
    (response.head || []).join(''),
    '<style>body {font-size: 62.5%;line-height: 1;}</style>',
    '</head>',
    '<body>',
    response.bodyInline,
    '<script src="//m.int.files.bbci.co.uk/modules/vendor/requirejs/2.1.20/require.min.js"></script>',
    (response.bodyLast || []).join(''),
    '<script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script>',
    '</body>',
    '</html>',
  ].join('');

const createComponentServer = (service: Service) => {
  const server = express();

  server.get('/data/:name*', async (req, res) => {
    try {
      const {accept} = req.headers;
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
  });

  server.get('/view/:name*', async (req, res) => {
    try {
      const {accept} = req.headers;
      const history = !accept || accept.indexOf('text/html') !== -1;
      const propsString = req.path.replace(`/view/${req.params.name}`, '');
      const { body, headers, statusCode } = await service.request(
        req.params.name,
        convertPropsString(propsString),
        history,
      );
      if (statusCode === 200) {
        res.send(createViewPage(JSON.parse(body)));
      } else {
        res
          .status(statusCode)
          .set(headers)
          .send(body);
      }
    } catch (ex) {
      res.status(500).send(ex.message);
    }
  });

  server.get('/proxy/:name*', async (req, res) => {
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
  });

  return server;
};

export default createComponentServer;
