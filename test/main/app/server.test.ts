import { readFileSync } from 'fs';
import { join } from 'path';
import * as request from 'supertest';

import createApiServer from '../../../src/server/app/ApiServer';
import Config from '../../../src/server/app/Config';
import Updater from '../../../src/server/app/Updater';
import IService from '../../../src/server/types/IService';
import createDefaultMockService from '../mocks/service';
import createMockSystem from '../mocks/system';

const createMockService = (): IService => ({
  build: jest.fn(),
  bump: jest.fn(),
  clone: jest.fn(),
  create: jest.fn(),
  fetchDetails: jest.fn(),
  getComponentsData: jest.fn().mockReturnValue([4, 5, 6]),
  getComponentsSummaryData: jest.fn().mockReturnValue([1, 2, 3]),
  getDependantGraph: jest.fn(),
  getDependencyGraph: jest.fn(),
  getTheme: jest.fn().mockReturnValue({}),
  link: jest.fn(),
  openInEditor: jest.fn(),
  promote: jest.fn(),
  reinstall: jest.fn(),
  request: jest.fn(),
  setFavorite: jest.fn(),
  setUseCache: jest.fn(),
  start: jest.fn(),
  stop: jest.fn(),
  unlink: jest.fn(),
});

test('can request /api/status', async () => {
  const service = createMockService();
  const system = createMockSystem().build();
  const updater = await Updater(system, '1.2.3');
  const server = createApiServer(service, null, updater, jest.fn());

  await request(server)
    .get('/api/status')
    .expect('Content-Type', 'application/json; charset=utf-8')
    .expect(200)
    .then((response) => {
      expect(response.body).toEqual({
        currentVersion: '1.2.3',
        updateAvailable: null,
        updated: false,
        updating: false,
      });
    });
});

test('can request /api/update', async () => {
  const service = createMockService();
  const systemBuilder = createMockSystem().withCurrentWorkingDirectory('/test/components');
  const system = systemBuilder.build();
  const updater = await Updater(system, '1.2.3');
  const onUpdated = jest.fn();
  const server = createApiServer(service, null, updater, onUpdated);

  await request(server)
    .post('/api/update')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then((response) => {
      expect(response.text).toBe('🤔');
    });

  expect(systemBuilder.getRunCommands()).toEqual(
    expect.arrayContaining([
      {
        command:
          'npm install git+ssh://git@github.com:bbc/morph-developer-console.git --global --production --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt',
        directory: '/test/components',
      },
    ]),
  );

  expect(onUpdated).toHaveBeenCalledTimes(1);
});

test('can request /', async () => {
  const { service, system } = await createDefaultMockService();
  const updater = await Updater(system, '1.2.3');
  const server = createApiServer(service, null, updater, jest.fn());

  await request(server)
    .get('/')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then((response) => {
      expect(response.text).not.toContain('CSS_PLACEHOLDER');
      expect(response.text).toContain('>Morph Developer Console</h1>');
      expect(response.text).toContain(
        'window.__PRELOADED_STATE__ = {"components":[{"displayName":"bar","favorite":false,"name":"bbc-morph-bar","rendererType":"0.12","state":1,"useCache":false},{"displayName":"baz","favorite":false,"name":"bbc-morph-baz","rendererType":"0.12","state":1,"useCache":false},{"displayName":"foo","favorite":false,"name":"bbc-morph-foo","rendererType":"0.12","state":1,"useCache":false}],"ui":{"editors":["code"],',
      );
      expect(response.text).toContain('"theme":');
      expect(response.text).toContain('mark{background-color:rgb(106, 196, 230);}');
    });
});

test('can request /component/:name', async () => {
  const { service, system } = await createDefaultMockService();
  const updater = await Updater(system, '1.2.3');
  const server = createApiServer(service, null, updater, jest.fn());

  await request(server)
    .get('/component/bbc-morph-foo')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(200)
    .then((response) => {
      expect(response.text).not.toContain('CSS_PLACEHOLDER');
      expect(response.text).toContain('>Morph Developer Console</h1>');
      expect(response.text).toContain(
        'window.__PRELOADED_STATE__ = {"components":[{"displayName":"bar","favorite":false,"name":"bbc-morph-bar","rendererType":"0.12","state":1,"useCache":false},{"displayName":"baz","favorite":false,"name":"bbc-morph-baz","rendererType":"0.12","state":1,"useCache":false},{"displayName":"foo","favorite":false,"name":"bbc-morph-foo","rendererType":"0.12","state":1,"useCache":false}],"ui":{"editors":["code"],',
      );
      expect(response.text).toContain('"selectedComponent":"bbc-morph-foo"');
      expect(response.text).toContain('"theme":');
    });
});

test('can request /local-push.js', async () => {
  const service = createMockService();
  const system = createMockSystem().build();
  const updater = await Updater(system, '1.2.3');
  const config = await Config('/config.json', system);
  const server = createApiServer(service, config, updater, jest.fn());

  await request(server)
    .get('/local-push.js')
    .expect('Content-Type', 'application/javascript; charset=utf-8')
    .expect(200)
    .then((response) => {
      expect(response.text).toBe(
        readFileSync(join(__dirname, '../../../public/local-push.js'))
          .toString()
          .replace('POLL_INTERVAL_FROM_CONFIG', '10000'),
      );
      expect(response.text).toContain('intervals[topic] = setInterval(poll, 10000);');
    });
});

test('can configure poll interval of /local-push.js in config', async () => {
  const configFileContents = JSON.stringify({
    livePushPollInterval: 1234,
  });

  const service = createMockService();
  const system = createMockSystem().withReadFile('/config.json', configFileContents).build();
  const updater = await Updater(system, '1.2.3');
  const config = await Config('/config.json', system);
  const server = createApiServer(service, config, updater, jest.fn());

  await request(server)
    .get('/local-push.js')
    .expect('Content-Type', 'application/javascript; charset=utf-8')
    .expect(200)
    .then((response) => {
      expect(response.text).toContain('intervals[topic] = setInterval(poll, 1234);');
    });
});
