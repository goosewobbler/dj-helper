import * as request from 'supertest';

import createApp from '../../../src/server/app/app';
import ComponentState from '../../../src/types/ComponentState';
import createDefaultMockSystem from '../mocks/defaultSystem';

const expectedDefaultComponentData: any = [
  {
    displayName: 'foo',
    favorite: false,
    name: 'bbc-morph-foo',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
  },
  {
    displayName: 'bar',
    favorite: false,
    name: 'bbc-morph-bar',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
  },
  {
    displayName: 'baz',
    favorite: false,
    name: 'bbc-morph-baz',
    rendererType: '0.12',
    state: ComponentState.Stopped,
    useCache: false,
  },
];

test('welcome and current version is logged on start', async () => {
  const { system, systemBuilder } = createDefaultMockSystem();
  await createApp(system, jest.fn(), jest.fn(), jest.fn(), jest.fn(), '1.2.3');

  expect(systemBuilder.getLogs()).toEqual(['Morph Developer Console v1.2.3 is starting...']);
});

test('can create app and request /api/components', async () => {
  const { system } = createDefaultMockSystem();
  const { api, devMode } = await createApp(system, jest.fn(), jest.fn(), jest.fn(), jest.fn(), '1.2.3');

  expect(devMode).toBe(false);

  return request(api)
    .get('/api/component')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({
        components: expectedDefaultComponentData,
        editors: ['code'],
        theme: expect.objectContaining({
          font: 'Roboto',
        }),
      });
    });
});

test('can create app and request /local-push.js', async () => {
  const { system } = createDefaultMockSystem();
  const { api, devMode } = await createApp(system, jest.fn(), jest.fn(), jest.fn(), jest.fn(), '1.2.3');

  expect(devMode).toBe(false);

  return request(api)
    .get('/local-push.js')
    .expect('Content-Type', 'application/javascript; charset=utf-8')
    .expect(200)
    .then((response) => {
      expect(response.text).toContain('intervals[topic] = setInterval(poll, 10000);');
    });
});

test('can create app and request /data/bbc-morph-baz', async () => {
  const { system } = createDefaultMockSystem();
  const { component } = await createApp(system, jest.fn(), jest.fn(), jest.fn(), jest.fn(), '1.2.3');

  return request(component)
    .get('/data/bbc-morph-baz')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(500)
    .then((response) => {
      expect(response.text).toBe('Component is not running');
    });
});

test('running in dev mode will use relative path for components directory', async () => {
  const { systemBuilder } = createDefaultMockSystem('/hello/morph-modules');

  const system = systemBuilder.withCurrentWorkingDirectory('/hello/world').withCommandLineArg('-D').build();

  const { api, devMode } = await createApp(system, jest.fn(), jest.fn(), jest.fn(), jest.fn(), '1.2.3');

  expect(devMode).toBe(true);

  return request(api)
    .get('/api/component')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({
        components: expectedDefaultComponentData,
        editors: ['code'],
        theme: expect.objectContaining({
          font: 'Roboto',
        }),
      });
    });
});

test('config is loaded from components directory', async () => {
  const configFileContents = JSON.stringify({
    bar: 456,
    foo: 'hello',
  });

  const { systemBuilder } = createDefaultMockSystem();
  const system = systemBuilder
    .withReadFile('/test/components/morph-developer-console-config.json', configFileContents)
    .build();
  const { config } = await createApp(system, jest.fn(), jest.fn(), jest.fn(), jest.fn(), '1.2.3');

  expect(config.getValue('foo')).toBe('hello');
  expect(config.getValue('bar')).toBe(456);
  expect(config.getValue('baz')).toBe(null);
});
