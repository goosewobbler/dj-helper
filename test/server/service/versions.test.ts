import createMockService from '../mocks/service';

test('versions are initially null', async () => {
  const { service } = await createMockService();

  const data = await service.getComponentsData();

  expect(data.components).toEqual([
    expect.objectContaining({
      versions: {
        int: null,
        live: null,
        local: null,
        test: null,
      },
    }),
    expect.objectContaining({
      versions: {
        int: null,
        live: null,
        local: null,
        test: null,
      },
    }),
    expect.objectContaining({
      versions: {
        int: null,
        live: null,
        local: null,
        test: null,
      },
    }),
  ]);
});

test('can versions are updated when details are fetched', async () => {
  const { service, onComponentUpdate } = await createMockService({
    systemModifier: builder => {
      builder
        .withVersionOnEnvironment('bbc-morph-foo', 'int', '1.1.0')
        .withVersionOnEnvironment('bbc-morph-foo', 'test', '1.0.1')
        .withVersionOnEnvironment('bbc-morph-foo', 'live', '1.0.0');
    },
  });

  await service.fetchDetails('bbc-morph-foo');
  const data = await service.getComponentsData();

  expect(onComponentUpdate).toHaveBeenCalledTimes(9);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      versions: {
        int: null,
        live: null,
        local: '1.2.3',
        test: null,
      },
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      versions: {
        int: '1.1.0',
        live: null,
        local: '1.2.3',
        test: null,
      },
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      versions: {
        int: '1.1.0',
        live: '1.0.0',
        local: '1.2.3',
        test: '1.0.1',
      },
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      versions: {
        int: '1.1.0',
        live: '1.0.0',
        local: '1.2.3',
        test: '1.0.1',
      },
    }),
  );
  expect(data.components).toEqual([
    expect.objectContaining({
      versions: {
        int: '1.1.0',
        live: '1.0.0',
        local: '1.2.3',
        test: '1.0.1',
      },
    }),
    expect.objectContaining({
      versions: {
        int: null,
        live: null,
        local: null,
        test: null,
      },
    }),
    expect.objectContaining({
      versions: {
        int: null,
        live: null,
        local: null,
        test: null,
      },
    }),
  ]);
});
