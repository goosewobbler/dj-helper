import * as request from 'supertest';

import createServer from '../../../src/server/app/ComponentServer';
import createMockService from '../mocks/service';

test('cannot request data component that is not running', async () => {
  const { service } = await createMockService();
  const server = createServer(service);

  return request(server)
    .get('/data/bbc-morph-baz')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(500)
    .then(response => {
      expect(response.text).toBe('Component is not running');
    });
});

test('cannot request view component that is not running', async () => {
  const { service } = await createMockService();
  const server = createServer(service);

  return request(server)
    .get('/view/bbc-morph-bar')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(500)
    .then(response => {
      expect(response.text).toBe('Component is not running');
    });
});

test('cannot proxy component that is not running', async () => {
  const { service } = await createMockService();
  const server = createServer(service);

  return request(server)
    .get('/proxy/bbc-morph-baz')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(500)
    .then(response => {
      expect(response.text).toBe('Component is not running');
    });
});

test('can request data component without props', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz', '{ "baz": 123 }');
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-baz');

  return request(server)
    .get('/data/bbc-morph-baz')
    .expect(200)
    .then(response => {
      expect(JSON.parse(response.text)).toEqual({ baz: 123 });
    });
});

test('can request data component with props', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz/a/1/b%2Fb/2%202/c/3', '{ "baz": 456 }');
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-baz');

  return request(server)
    .get('/data/bbc-morph-baz/a/1/b%2Fb/2%202/c/3')
    .expect(200)
    .then(response => {
      expect(JSON.parse(response.text)).toEqual({ baz: 456 });
    });
});

test('can request view component without props', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/view/bbc-morph-bar', '{ "bodyInline": "<h1>Hello bar</h1>" }');
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-bar');

  return request(server)
    .get('/view/bbc-morph-bar')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toContain('<h1>Hello bar</h1>');
    });
});

test('can request view component with props', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/view/bbc-morph-bar/hello/world',
        '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
      );
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-bar');

  return request(server)
    .get('/view/bbc-morph-bar/hello/world')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toContain('<h1>Hello bar with props</h1>');
    });
});

test('can proxy data requests without props', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8085/data/bbc-morph-baz',
        '{ "bodyInline": "Something using localhost:8082/thing", "foo": "Something else using http://localhost:8082" }',
      );
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-foo');
  await service.start('bbc-morph-bar');
  await service.start('bbc-morph-baz');

  return request(server)
    .get('/proxy/bbc-morph-baz')
    .expect(200)
    .then(response => {
      expect(JSON.parse(response.text)).toEqual({
        bodyInline: 'Something using localhost:8085/thing',
        foo: 'Something else using http://localhost:8085',
      });
    });
});

test('can proxy data requests with props', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8085/data/bbc-morph-baz/hello/world',
        '{ "bodyInline": "Something using localhost:8082/thing", "foo": "Something else using http://localhost:8082" }',
      );
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-foo');
  await service.start('bbc-morph-bar');
  await service.start('bbc-morph-baz');

  return request(server)
    .get('/proxy/bbc-morph-baz/hello/world')
    .expect(200)
    .then(response => {
      expect(JSON.parse(response.text)).toEqual({
        bodyInline: 'Something using localhost:8085/thing',
        foo: 'Something else using http://localhost:8085',
      });
    });
});

test('can proxy view requests without props', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8084/view/bbc-morph-bar',
        '{ "bodyInline": "Something using localhost:8082/thing", "foo": "Something else using http://localhost:8082" }',
      );
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-foo');
  await service.start('bbc-morph-bar');

  return request(server)
    .get('/proxy/bbc-morph-bar')
    .expect(200)
    .then(response => {
      expect(JSON.parse(response.text)).toEqual({
        bodyInline: 'Something using localhost:8084/thing',
        foo: 'Something else using http://localhost:8084',
      });
    });
});

test('can proxy view requests with props', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8084/view/bbc-morph-bar/hello/world',
        '{ "bodyInline": "Something using localhost:8082/thing", "foo": "Something else using http://localhost:8082" }',
      );
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-foo');
  await service.start('bbc-morph-bar');

  return request(server)
    .get('/proxy/bbc-morph-bar/hello/world')
    .expect(200)
    .then(response => {
      expect(JSON.parse(response.text)).toEqual({
        bodyInline: 'Something using localhost:8084/thing',
        foo: 'Something else using http://localhost:8084',
      });
    });
});

test('view response is wrapped in live reloading page', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/view/bbc-morph-bar/hello/world',
        '{ "head": ["<link>head1</link>", "<link>head2</link>"], "bodyInline": "<h1>Hello bar with props</h1>", "bodyLast": ["<p>bodylast1</p>", "<p>bodylast2</p>"] }',
      );
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-bar');

  return request(server)
    .get('/view/bbc-morph-bar/hello/world')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe(
        '<!doctype html><html class="b-pw-1280"><head><meta charset="utf-8"><meta http-equiv="x-ua-compatible" content="ie=edge"><meta name="viewport" content="width=device-width, initial-scale=1"><link rel="shortcut icon" type="image/png" href="http://localhost:3333/image/icon/morph.png"/><script src="http://localhost:3333/socket.io/socket.io.js"></script><link>head1</link><link>head2</link><style>body {font-size: 62.5%;line-height: 1;}</style></head><body><h1>Hello bar with props</h1><script src="//m.int.files.bbci.co.uk/modules/vendor/requirejs/2.1.20/require.min.js"></script><p>bodylast1</p><p>bodylast2</p><script>const socket = io("http://localhost:3333"); socket.on("reload", () => window.location.reload(true));</script></body></html>',
      );
    });
});

test('data component request forwards status code and headers', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz', '{ "baz": 123 }', 222, { custom: 'header' });
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-baz');

  return request(server)
    .get('/data/bbc-morph-baz')
    .expect(222)
    .expect('custom', 'header')
    .then(response => {
      expect(JSON.parse(response.text)).toEqual({ baz: 123 });
    });
});

test('view component request forwards status code and headers and does not create page for non 200 responses', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/view/bbc-morph-bar', 'hello', 222, { custom: 'header' });
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-bar');

  return request(server)
    .get('/view/bbc-morph-bar')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(222)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe('hello');
    });
});

test('proxy data request forwards status code and headers', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz', '{"hello": "world"}', 222, {
        custom: 'header',
      });
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-baz');

  return request(server)
    .get('/proxy/bbc-morph-baz')
    .expect(222)
    .expect('custom', 'header')
    .then(response => {
      expect(JSON.parse(response.text)).toEqual({ hello: 'world' });
    });
});

test('proxy view request forwards status code and headers', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/view/bbc-morph-bar', '{"hello": "world"}', 222, {
        custom: 'header',
      });
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-bar');

  return request(server)
    .get('/proxy/bbc-morph-bar')
    .expect(222)
    .expect('custom', 'header')
    .then(response => {
      expect(JSON.parse(response.text)).toEqual({ hello: 'world' });
    });
});

test('history is updated on data request', async () => {
  const { service, onComponentUpdate } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz/a/1', '{ "baz": 123 }');
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-baz');
  await request(server).get('/data/bbc-morph-baz/a/1');

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      history: ['/a/1'],
      name: 'bbc-morph-baz',
    }),
  );
});

test('history is updated on view request', async () => {
  const { service, onComponentUpdate } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/view/bbc-morph-bar/hello/world',
        '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
      );
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-bar');
  await request(server).get('/view/bbc-morph-bar/hello/world');

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      history: ['/hello/world'],
      name: 'bbc-morph-bar',
    }),
  );
});

test('history is not updated on proxy request', async () => {
  const { service, onComponentUpdate } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz/b/2', '123');
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-baz');
  await request(server).get('/proxy/bbc-morph-baz/b/2');

  expect(onComponentUpdate).not.toHaveBeenCalledWith(
    expect.objectContaining({
      history: ['/b/2'],
      name: 'bbc-morph-baz',
    }),
  );
});

test('history is not updated on data request when Accept header exists does not contain text/html', async () => {
  const { service, onComponentUpdate } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse('http://localhost:8083/data/bbc-morph-baz/a/1', '{ "baz": 123 }');
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-baz');
  await request(server)
    .get('/data/bbc-morph-baz/a/1')
    .set('Accept', '*/*');

  expect(onComponentUpdate).not.toHaveBeenCalledWith(
    expect.objectContaining({
      history: ['/a/1'],
      name: 'bbc-morph-baz',
    }),
  );
});

test('history is not updated on view request when Accept header exists does not contain text/html', async () => {
  const { service, onComponentUpdate } = await createMockService({
    systemModifier: builder => {
      builder.withGetResponse(
        'http://localhost:8083/view/bbc-morph-bar/hello/world',
        '{ "bodyInline": "<h1>Hello bar with props</h1>" }',
      );
    },
  });
  const server = createServer(service);
  await service.start('bbc-morph-bar');
  await request(server)
    .get('/view/bbc-morph-bar/hello/world')
    .set('Accept', '*/*');

  expect(onComponentUpdate).not.toHaveBeenCalledWith(
    expect.objectContaining({
      history: ['/hello/world'],
      name: 'bbc-morph-bar',
    }),
  );
});
