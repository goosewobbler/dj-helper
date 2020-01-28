import * as request from 'supertest';

import createApiServer from '../../../src/server/app/ApiServer';
import CreateType from '../../../src/server/types/CreateType';
import IService from '../../../src/server/types/IService';

const createMockService = (): IService => ({
  build: jest.fn().mockReturnValue(Promise.resolve()),
  bump: jest.fn().mockReturnValue(Promise.resolve('http://github.com/abc')),
  clone: jest.fn().mockReturnValue(Promise.resolve()),
  create: jest.fn().mockReturnValue(Promise.resolve()),
  fetchDetails: jest.fn().mockReturnValue(Promise.resolve()),
  getComponentsData: jest.fn().mockReturnValue([4, 5, 6]),
  getComponentsSummaryData: jest.fn().mockReturnValue([1, 2, 3]),
  getDependantGraph: jest.fn().mockReturnValue({ edges: [1], nodes: [2] }),
  getDependencyGraph: jest.fn().mockReturnValue({ edges: [3], nodes: [4] }),
  getTheme: jest.fn().mockReturnValue({}),
  link: jest.fn().mockReturnValue(Promise.resolve()),
  openInEditor: jest.fn().mockReturnValue(Promise.resolve()),
  promote: jest.fn().mockReturnValue(Promise.resolve()),
  reinstall: jest.fn().mockReturnValue(Promise.resolve()),
  request: jest.fn().mockReturnValue(Promise.resolve()),
  setFavorite: jest.fn().mockReturnValue(Promise.resolve()),
  setUseCache: jest.fn().mockReturnValue(Promise.resolve()),
  start: jest.fn().mockReturnValue(Promise.resolve()),
  stop: jest.fn().mockReturnValue(Promise.resolve()),
  unlink: jest.fn().mockReturnValue(Promise.resolve()),
});

test('stack trace is logged and returned for thrown Error objects', async () => {
  const originalConsoleError = console.error;
  console.error = jest.fn();

  const service = createMockService();
  const error = new Error(`failed to build`);

  service.build = () =>
    new Promise(() => {
      throw error;
    });

  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/build')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(console.error).toHaveBeenCalledTimes(1);
  expect(console.error).toHaveBeenCalledWith(error.stack);

  console.error = originalConsoleError;
});

test('can request /api/component/', () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  return request(server)
    .get('/api/component/')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.body).toEqual([1, 2, 3]);
    });
});

test('can request /api/component/:name/versions', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/versions')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.fetchDetails).toHaveBeenCalledTimes(1);
  expect(service.fetchDetails).toHaveBeenCalledWith('bbc-morph-foo');
});

test('can request /api/component/:name/start', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/start')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.start).toHaveBeenCalledTimes(1);
  expect(service.start).toHaveBeenCalledWith('bbc-morph-foo');
});

test('can request /api/component/:name/stop', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/stop')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.stop).toHaveBeenCalledTimes(1);
  expect(service.stop).toHaveBeenCalledWith('bbc-morph-foo');
});

test('can request /api/component/:name/install', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/install')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.reinstall).toHaveBeenCalledTimes(1);
  expect(service.reinstall).toHaveBeenCalledWith('bbc-morph-foo');
});

test('can request /api/component/:name/build', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/build')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.build).toHaveBeenCalledTimes(1);
  expect(service.build).toHaveBeenCalledWith('bbc-morph-foo');
});

test('can request /api/component/:name/link/:dependency', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/link/bbc-morph-bar')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.link).toHaveBeenCalledTimes(1);
  expect(service.link).toHaveBeenCalledWith('bbc-morph-foo', 'bbc-morph-bar');
});

test('can request /api/component/:name/unlink/:dependency', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/unlink/bbc-morph-bar')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.unlink).toHaveBeenCalledTimes(1);
  expect(service.unlink).toHaveBeenCalledWith('bbc-morph-foo', 'bbc-morph-bar');
});

test('can request /api/component/:name/favorite/true', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/favorite/true')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.setFavorite).toHaveBeenCalledTimes(1);
  expect(service.setFavorite).toHaveBeenCalledWith('bbc-morph-foo', true);
});

test('can request /api/component/:name/favorite/false', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/favorite/false')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.setFavorite).toHaveBeenCalledTimes(1);
  expect(service.setFavorite).toHaveBeenCalledWith('bbc-morph-foo', false);
});

test('can request /api/component/:name/cache/true', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/cache/true')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.setUseCache).toHaveBeenCalledTimes(1);
  expect(service.setUseCache).toHaveBeenCalledWith('bbc-morph-foo', true);
});

test('can request /api/component/:name/cache/false', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/cache/false')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.setUseCache).toHaveBeenCalledTimes(1);
  expect(service.setUseCache).toHaveBeenCalledWith('bbc-morph-foo', false);
});

test('can request /api/component/:name/promote/foo', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/promote/foo')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.promote).toHaveBeenCalledTimes(1);
  expect(service.promote).toHaveBeenCalledWith('bbc-morph-foo', 'foo');
});

test('can request /api/component/:name/edit', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/edit')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('🤔');
    });

  expect(service.openInEditor).toHaveBeenCalledTimes(1);
  expect(service.openInEditor).toHaveBeenCalledWith('bbc-morph-foo');
});

test('can request /api/component/:name/bump/patch', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/bump/patch')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.body).toEqual({ url: 'http://github.com/abc' });
    });

  expect(service.bump).toHaveBeenCalledTimes(1);
  expect(service.bump).toHaveBeenCalledWith('bbc-morph-foo', 'patch');
});

test('can request /api/component/:name/bump/minor', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  await request(server)
    .post('/api/component/bbc-morph-foo/bump/minor')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.body).toEqual({ url: 'http://github.com/abc' });
    });

  expect(service.bump).toHaveBeenCalledTimes(1);
  expect(service.bump).toHaveBeenCalledWith('bbc-morph-foo', 'minor');
});

test('can request /api/component/bbc-morph-foo/clone', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());
  const description = 'A cloned foo';

  await request(server)
    .post('/api/component/bbc-morph-foo/clone')
    .send({ name: 'cloned-foo', description })
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('👍');
    });

  expect(service.clone).toHaveBeenCalledTimes(1);
  expect(service.clone).toHaveBeenCalledWith('bbc-morph-foo', 'cloned-foo', { description });
});

test('can request /api/component/create/view', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());
  const description = '"I wish we had more components", said no one ever.';

  await request(server)
    .post('/api/component/create/view')
    .send({ name: 'bbc-morph-new', description })
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('👍');
    });

  expect(service.create).toHaveBeenCalledTimes(1);
  expect(service.create).toHaveBeenCalledWith('bbc-morph-new', CreateType.View, { description });
});

test('can request /api/component/create/viewcss', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());
  const description = '"I wish we had more components", said no one ever.';

  await request(server)
    .post('/api/component/create/viewcss')
    .send({ name: 'bbc-morph-new', description })
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('👍');
    });

  expect(service.create).toHaveBeenCalledTimes(1);
  expect(service.create).toHaveBeenCalledWith('bbc-morph-new', CreateType.ViewCSS, { description });
});

test('can request /api/component/create/data', async () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());
  const description = '"I wish we had more components", said no one ever.';

  await request(server)
    .post('/api/component/create/data')
    .send({ name: 'bbc-morph-new', description })
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.text).toBe('👍');
    });

  expect(service.create).toHaveBeenCalledTimes(1);
  expect(service.create).toHaveBeenCalledWith('bbc-morph-new', CreateType.Data, { description });
});

test('can request /api/component/:name/dependency-graph', () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  return request(server)
    .get('/api/component/bbc-morph-foo/dependency-graph')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.body).toEqual({ edges: [3], nodes: [4] });
    });
});

test('can request /api/component/:name/dependant-graph', () => {
  const service = createMockService();
  const server = createApiServer(service, null, null, jest.fn());

  return request(server)
    .get('/api/component/bbc-morph-foo/dependant-graph')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .then(response => {
      expect(response.body).toEqual({ edges: [1], nodes: [2] });
    });
});
