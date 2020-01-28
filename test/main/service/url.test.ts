import Config from '../../../src/server/app/Config';
import State from '../../../src/server/app/State';
import Service from '../../../src/server/service/Service';
import ComponentType from '../../../src/server/service/types/ComponentType';
import createMockService from '../mocks/service';
import createMockSystem from '../mocks/system';

test('can get component URL', async () => {
  const { service, startServer } = await createMockService();
  startServer.mockReturnValue(Promise.resolve(1234));
  await service.start('bbc-morph-foo');
  await service.fetchDetails('bbc-morph-bar');
  await service.fetchDetails('bbc-morph-baz');
  const data = await service.getComponentsData();

  expect(data.components).toEqual([
    expect.objectContaining({
      url: 'http://localhost:1234',
    }),
    expect.objectContaining({
      url: 'http://localhost:2001/view/bbc-morph-bar',
    }),
    expect.objectContaining({
      url: 'http://localhost:2001/data/bbc-morph-baz',
    }),
  ]);
});

test('can override localhost in component URL', async () => {
  const { service, config, startServer } = await createMockService();
  await config.setValue('localhost', 'foo.local.com');
  startServer.mockReturnValue(Promise.resolve(1234));
  await service.start('bbc-morph-foo');
  await service.fetchDetails('bbc-morph-bar');
  await service.fetchDetails('bbc-morph-baz');
  const data = await service.getComponentsData();

  expect(data.components).toEqual([
    expect.objectContaining({
      url: 'http://foo.local.com:1234',
    }),
    expect.objectContaining({
      url: 'http://foo.local.com:2001/view/bbc-morph-bar',
    }),
    expect.objectContaining({
      url: 'http://foo.local.com:2001/data/bbc-morph-baz',
    }),
  ]);
});

test('can override component type with config', async () => {
  const { service, startServer } = await createMockService({
    systemModifier: builder => {
      builder.withReadFile(
        '/mdc-config.json',
        JSON.stringify({
          'typeOverrides.bbc-morph-bar': 'page',
          'typeOverrides.bbc-morph-baz': 'view',
          'typeOverrides.bbc-morph-foo': 'data',
        }),
      );
    },
  });

  startServer.mockReturnValue(Promise.resolve(1234));
  await service.fetchDetails('bbc-morph-foo');
  await service.start('bbc-morph-bar');
  await service.fetchDetails('bbc-morph-baz');
  const data = await service.getComponentsData();

  expect(data.components).toEqual([
    expect.objectContaining({
      url: 'http://localhost:2001/data/bbc-morph-foo',
    }),
    expect.objectContaining({
      url: 'http://localhost:1234',
    }),
    expect.objectContaining({
      url: 'http://localhost:2001/view/bbc-morph-baz',
    }),
  ]);
});

test('component type override defaults', async () => {
  const system = createMockSystem()
    .withGetPackageDirectories('/test/components', ['sport-media-asset-data'])
    .withReadFile(
      '/test/components/sport-media-asset-data/package.json',
      JSON.stringify({
        dependencies: {
          react: '^16.0.0',
        },
        name: 'bbc-morph-sport-media-asset-data',
        version: '2.0.0',
      }),
    )
    .build();

  const config = await Config('/mdc-config.json', system);
  const service = await Service(system, config, await State('', system), jest.fn(), jest.fn(), jest.fn(), {
    componentsDirectory: '/test/components',
    routingFilePath: '',
  });
  await service.fetchDetails('bbc-morph-sport-media-asset-data');
  const data = await service.getComponentsData();

  expect(data.components).toEqual([
    expect.objectContaining({
      name: 'bbc-morph-sport-media-asset-data',
      url: 'http://localhost:2001/data/bbc-morph-sport-media-asset-data',
    }),
  ]);
});

test('can get component type', async () => {
  const { service, startServer } = await createMockService();
  startServer.mockReturnValue(Promise.resolve(1234));
  await service.start('bbc-morph-foo');
  await service.fetchDetails('bbc-morph-bar');
  await service.fetchDetails('bbc-morph-baz');
  const data = await service.getComponentsData();

  expect(data.components).toEqual([
    expect.objectContaining({
      type: ComponentType.Page,
    }),
    expect.objectContaining({
      type: ComponentType.View,
    }),
    expect.objectContaining({
      type: ComponentType.Data,
    }),
  ]);
});
