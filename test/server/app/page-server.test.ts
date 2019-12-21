import * as request from 'supertest';

import createServer from '../../../src/server/app/PageServer';
import createMockService from '../mocks/service';

test('can request page', async () => {
  const mockPage =
    '<!doctype html><html lang="en-gb"><head><title>Hello</title></head><body><h1>Hello world</h1></body></html>';

  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fhello%2Fworld',
        mockPage,
        200,
        { custom: 'header', 'Content-Type': 'application/json' },
      );
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/hello/world')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe(
        '<!doctype html><html lang="en-gb"><head><script src="http://localhost:3333/socket.io/socket.io.js"></script><title>Hello</title></head><body><h1>Hello world</h1><script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script></body></html>',
      );
    });
});

test('can request page with query string', async () => {
  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fhello%2Fworld%3Fq%3D123',
        'Query Params',
      );
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/hello/world?q=123')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toContain('Query Params');
    });
});

test('forwards 404 response', async () => {
  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fmissing',
        '<!doctype html><html lang="en-gb"><head><title>404</title></head><body>Custom 404 body</body></html>',
        200,
        {
          custom: 'header',
          'x-page-status-code': 404,
        },
      );
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/missing')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(404)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe(
        '<!doctype html><html lang="en-gb"><head><script src="http://localhost:3333/socket.io/socket.io.js"></script><title>404</title></head><body>Custom 404 body<script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script></body></html>',
      );
    });
});

test('defaults 404 response body for empty response', async () => {
  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fmissing', '', 200, {
        custom: 'header',
        'x-page-status-code': 404,
      });
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/missing')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(404)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe(
        '<!doctype html><html lang="en-gb"><head><style>*{margin:0;padding:0;}body{padding:16px;}</style></head><body><pre style="font-size: 48px;">404 😕</pre></body></html>',
      );
    });
});

test('defaults 404 response body for empty json response', async () => {
  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fmissing',
        '{}',
        200,
        {
          custom: 'header',
          'x-page-status-code': 404,
        },
      );
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/missing')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(404)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe(
        '<!doctype html><html lang="en-gb"><head><style>*{margin:0;padding:0;}body{padding:16px;}</style></head><body><pre style="font-size: 48px;">404 😕</pre></body></html>',
      );
    });
});

test('cannot request page that is not running', async () => {
  const { service, config } = await createMockService();
  const server = createServer(service, config, 'bbc-morph-foo');

  return request(server)
    .get('/hello/world')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(500)
    .then(response => {
      expect(response.text).toBe('Component is not running');
    });
});

test('if page response is in JSON format then it is parsed first', async () => {
  const mockPage = '"<!doctype html><html><head><title>Hello</title></head><body><h1>Hello world</h1></body></html>"';

  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fhello%2Fworld',
        mockPage,
        200,
        { custom: 'header', 'Content-Type': 'application/json' },
      );
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/hello/world')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe(
        '<!doctype html><html><head><script src="http://localhost:3333/socket.io/socket.io.js"></script><title>Hello</title></head><body><h1>Hello world</h1><script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script></body></html>',
      );
    });
});

test('forwards 301 response', async () => {
  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2F301',
        '<!doctype html><html lang="en-gb"><head><title>301</title></head><body>Custom 301 body</body></html>',
        200,
        {
          custom: 'header',
          'x-page-location': 'http://301.example.com',
          'x-page-status-code': 301,
        },
      );
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/301')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(301)
    .expect('Location', 'http://301.example.com')
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe(
        '<!doctype html><html lang="en-gb"><head><script src="http://localhost:3333/socket.io/socket.io.js"></script><title>301</title></head><body>Custom 301 body<script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script></body></html>',
      );
    });
});

test('forwards 302 response', async () => {
  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2F302',
        '<!doctype html><html lang="en-gb"><head><title>302</title></head><body>Custom 302 body</body></html>',
        200,
        {
          custom: 'header',
          'x-page-location': 'http://302.example.com',
          'x-page-status-code': 302,
        },
      );
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/302')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(302)
    .expect('Location', 'http://302.example.com')
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe(
        '<!doctype html><html lang="en-gb"><head><script src="http://localhost:3333/socket.io/socket.io.js"></script><title>302</title></head><body>Custom 302 body<script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script></body></html>',
      );
    });
});

test('can handle json response', async () => {
  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2F302', '{}', 200, {
        custom: 'header',
        'x-page-location': 'http://302.example.com',
        'x-page-status-code': 302,
      });
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/302')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(302)
    .expect('Location', 'http://302.example.com')
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe('{}');
    });
});

test('history is updated on page request', async () => {
  const { service, onComponentUpdate, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fhello%2Fworld%3Fq%3D123',
        'Query Params',
      );
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');
  await request(server)
    .get('/hello/world?q=123')
    .expect(200);

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      history: ['/hello/world?q=123'],
      name: 'bbc-morph-foo',
    }),
  );
});

test('history is not updated when Accept header exists does not contain text/html', async () => {
  const { service, onComponentUpdate, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fhello%2Fworld%3Fq%3D123',
        '123',
      );
    },
  });

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');
  await request(server)
    .get('/hello/world?q=123')
    .set('Accept', '*/*')
    .expect(200);

  expect(onComponentUpdate).not.toHaveBeenCalledWith(
    expect.objectContaining({
      history: ['/hello/world?q=123'],
      name: 'bbc-morph-foo',
    }),
  );
});

test('adds Ceefax styling if enabled', async () => {
  const { service, config } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fhello%2Fworld',
        '<!doctype html><html lang="en-gb"><head><title>Hello</title></head><body><h1>Hello world</h1></body></html>',
        200,
        { custom: 'header', 'Content-Type': 'application/json' },
      );
    },
  });

  config.setValue('ceefax', true);

  const server = createServer(service, config, 'bbc-morph-foo');
  await service.start('bbc-morph-foo');

  return request(server)
    .get('/hello/world')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toContain("font-family: 'bbcmode7';");
    });
});
