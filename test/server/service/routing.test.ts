import Routing from '../../../src/server/service/Routing';
import createMockSystem from '../mocks/system';

test('creates an empty routing file if it does not exist.', async () => {
  const routingFilePath = '/file/routing.json';

  const system = createMockSystem().build();

  await Routing(routingFilePath, system);

  const routingFileContents = JSON.parse(await system.file.readFile(routingFilePath));

  expect(routingFileContents).toEqual({});
});

test('clears the routing file if it exists.', async () => {
  const routingFilePath = '/file/routing.json';

  const system = createMockSystem()
    .withReadFile(routingFilePath, '{"bbc-morph-bar": 2222}')
    .build();

  await Routing(routingFilePath, system);

  const routingFileContents = JSON.parse(await system.file.readFile(routingFilePath));

  expect(routingFileContents).toEqual({});
});

test('can add routes.', async () => {
  const routingFilePath = '/file/routing.json';

  const system = createMockSystem().build();

  const routing = await Routing(routingFilePath, system);

  await routing.updateRoute('bbc-morph-foo', 1234);
  await routing.updateRoute('bbc-morph-bar', 2222);

  const routingFileContents = JSON.parse(await system.file.readFile(routingFilePath));

  expect(routingFileContents).toEqual({
    'bbc-morph-bar': 2222,
    'bbc-morph-foo': 1234,
  });
});

test('can remove routes.', async () => {
  const routingFilePath = '/file/routing.json';

  const system = createMockSystem().build();

  const routing = await Routing(routingFilePath, system);

  await routing.updateRoute('bbc-morph-foo', 1234);
  await routing.updateRoute('bbc-morph-bar', 2222);
  await routing.updateRoute('bbc-morph-foo', null);

  const routingFileContents = JSON.parse(await system.file.readFile(routingFilePath));

  expect(routingFileContents).toEqual({
    'bbc-morph-bar': 2222,
  });
});
