var fs = require('fs-extra');

var buildUrlForDataProxy;
const routingFilePath = __dirname + '/../../.routing.json';

describe('Data URL', () => {
  beforeAll(() => {
    global.window.define = jest.fn();
    global.window.requirejs = jest.fn();

    buildUrlForDataProxy = require('../../src/morph-cli/data-url');
  });

  beforeEach(async () => {
    await fs.ensureFile(routingFilePath);
  });

  afterEach(async () => {
    await fs.remove(routingFilePath);
  });

  it('should return nothing if no routing match is found', async () => {
    await fs.writeJson(routingFilePath, {
      'other-module': 8080,
    });

    var result = buildUrlForDataProxy(
      {
        uri: {
          data: 'mock-module',
          version: '1.0.0',
        },
      },
      {
        data: 'mock-module',
      },
    );

    expect(result).toEqual(null);
  });

  it('should build a URL for a given URI', async () => {
    await fs.writeJson(routingFilePath, {
      'mock-module': 8080,
    });

    var result = buildUrlForDataProxy(
      {
        uri: {
          data: 'mock-module',
          version: '1.0.0',
        },
      },
      {
        data: 'mock-module',
      },
    );

    expect(result).toEqual('http://localhost:4000/data/mock-module/version/1.0.0');
  });

  it('should build a URL for a generated component name', async () => {
    await fs.writeJson(routingFilePath, {
      'bbc-morph-mock-module': 8080,
    });

    global.process.cwd = jest.fn(() => {
      return '/workspace/mock-module';
    });

    var result = buildUrlForDataProxy(
      {
        uri: {
          data: 'mock-module',
          version: '1.0.0',
        },
      },
      {
        data: 'mock-module',
      },
    );

    expect(result).toEqual('http://localhost:8080/data/mock-module/version/1.0.0');
  });
});
