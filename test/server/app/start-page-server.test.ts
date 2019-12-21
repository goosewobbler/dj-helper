import * as request from 'supertest';

import createApp from '../../../src/server/app/app';
import ComponentState from '../../../src/types/ComponentState';
import createDefaultMockSystem from '../mocks/defaultSystem';

const createPackage = (name: string) =>
  JSON.stringify({
    dependencies: {
      'bbc-morph-page-assembler': '^1.0.0',
    },
    name,
    version: '1.2.3',
  });

const createMockSystem = () => {
  const { systemBuilder } = createDefaultMockSystem();
  return systemBuilder
    .withGetPackageDirectories('/test/components', ['foo', 'page'])
    .withReadFile('/test/components/page/package.json', createPackage('bbc-morph-page'))
    .withGetResponse(
      'http://localhost:8083/data/bbc-morph-foo/closeEnvelope/true/path/%2Fhello%2Fworld',
      'hello',
      200,
      { custom: 'header' },
    )
    .withGetResponse('http://localhost:8084/data/bbc-morph-page/closeEnvelope/true/path/%2Fstatus', 'ok', 200, {
      custom: 'header',
    })
    .build();
};

test('page server is not started when non page component is started', async () => {
  const { system } = createDefaultMockSystem();
  const startServer = jest.fn();
  const { api } = await createApp(system, jest.fn(), jest.fn(), jest.fn(), startServer, '1.2.3');

  await request(api)
    .post('/api/component/bbc-morph-bar/start')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(startServer).toHaveBeenCalledTimes(0);
});

test('page server is started when page component is started', async () => {
  const system = createMockSystem();
  const startServer = jest.fn();
  const { api } = await createApp(system, jest.fn(), jest.fn(), jest.fn(), startServer, '1.2.3');

  await request(api)
    .post('/api/component/bbc-morph-foo/start')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(startServer).toHaveBeenCalledTimes(1);
  expect(startServer).toHaveBeenCalledWith(expect.anything(), 4001);

  return request(startServer.mock.calls[0][0])
    .get('/hello/world')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe('hello');
    });
});

test('restarting a page component does not create a new server', async () => {
  const system = createMockSystem();
  const startServer = jest.fn();
  const { api } = await createApp(system, jest.fn(), jest.fn(), jest.fn(), startServer, '1.2.3');

  await request(api)
    .post('/api/component/bbc-morph-foo/start')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  await request(api)
    .post('/api/component/bbc-morph-foo/stop')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  await request(api)
    .post('/api/component/bbc-morph-foo/start')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(startServer).toHaveBeenCalledTimes(1);
  expect(startServer).toHaveBeenCalledWith(expect.anything(), 4001);

  return request(startServer.mock.calls[0][0])
    .get('/hello/world')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe('hello');
    });
});

test('page server is started on next available port', async () => {
  const system = createMockSystem();
  const onComponentUpdate = jest.fn();
  const startServer = jest.fn();
  const { api } = await createApp(system, onComponentUpdate, jest.fn(), jest.fn(), startServer, '1.2.3');

  await request(api)
    .post('/api/component/bbc-morph-foo/start')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  await request(api)
    .post('/api/component/bbc-morph-page/start')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(startServer).toHaveBeenCalledTimes(2);
  expect(startServer).toHaveBeenCalledWith(expect.anything(), 4001);
  expect(startServer).toHaveBeenCalledWith(expect.anything(), 4002);

  await request(startServer.mock.calls[0][0])
    .get('/hello/world')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe('hello');
    });

  await request(startServer.mock.calls[1][0])
    .get('/status')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .expect('custom', 'header')
    .then(response => {
      expect(response.text).toBe('ok');
    });

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Running,
      url: 'http://localhost:4001',
    }),
  );

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-page',
      state: ComponentState.Running,
      url: 'http://localhost:4002',
    }),
  );
});
