var buildUrlForViewProxy = require('../../src/morph-cli/service-url');
var fs = require('fs-extra');

const routingFilePath = __dirname + '/../../.routing.json';

describe('Service proxy URL', async () => {
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

    var result = buildUrlForViewProxy({
      path: '/view/mock-module',
    });

    expect(result).toEqual(undefined);
  });

  it('should build a URL for a view proxy', async () => {
    await fs.writeJson(routingFilePath, {
      'mock-module': 8080,
    });

    var result = buildUrlForViewProxy({
      path: '/view/mock-module',
    });

    expect(result).toEqual('http://localhost:2001/proxy/mock-module');
  });
});
