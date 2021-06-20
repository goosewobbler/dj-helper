import createMockService from '../mocks/service';

test('can promote to Test environment', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService({
    systemModifier: (builder) => {
      builder
        .withVersionOnEnvironment('bbc-morph-foo', 'int', '1.1.0')
        .withVersionOnEnvironment('bbc-morph-foo', 'test', '1.0.1')
        .withVersionOnEnvironment('bbc-morph-foo', 'live', '1.0.0');
    },
  });

  expect(systemBuilder.getPromoted()).toEqual({
    live: [],
    test: [],
  });

  await service.fetchDetails('bbc-morph-foo');
  await service.promote('bbc-morph-foo', 'test');

  expect(onComponentUpdate).toHaveBeenCalledTimes(14);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      promoting: null,
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
      promoting: 'test',
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
      promoting: null,
      versions: {
        int: '1.1.0',
        live: '1.0.0',
        local: '1.2.3',
        test: '9.9.9',
      },
    }),
  );
  expect(systemBuilder.getPromoted()).toEqual({
    live: [],
    test: ['bbc-morph-foo'],
  });
});

test('can promote to Live environment', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService({
    systemModifier: (builder) => {
      builder
        .withVersionOnEnvironment('bbc-morph-foo', 'int', '1.1.0')
        .withVersionOnEnvironment('bbc-morph-foo', 'test', '1.0.1')
        .withVersionOnEnvironment('bbc-morph-foo', 'live', '1.0.0');
    },
  });

  expect(systemBuilder.getPromoted()).toEqual({
    live: [],
    test: [],
  });

  await service.fetchDetails('bbc-morph-foo');
  await service.promote('bbc-morph-foo', 'live');

  expect(onComponentUpdate).toHaveBeenCalledTimes(14);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      promoting: null,
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
      promoting: 'live',
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
      promoting: null,
      versions: {
        int: '1.1.0',
        live: '9.9.9',
        local: '1.2.3',
        test: '1.0.1',
      },
    }),
  );
  expect(systemBuilder.getPromoted()).toEqual({
    live: ['bbc-morph-foo'],
    test: [],
  });
});

test('cannot promote to invalid environment', async () => {
  const { service, onComponentUpdate } = await createMockService();

  try {
    await service.promote('bbc-morph-foo', 'foo');
  } catch (error) {
    expect(onComponentUpdate).toHaveBeenCalledTimes(0);
    expect(error.message).toBe('Invalid environment');
  }
});

test('can get promotion failure', async () => {
  const { service, onComponentUpdate } = await createMockService({
    systemModifier: (builder) => {
      builder.withPromotionFailure('bbc-morph-bar', 'test', 'http://failure.example.com');
    },
  });

  await service.promote('bbc-morph-bar', 'test');

  expect(onComponentUpdate).toHaveBeenCalledTimes(2);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: 'test',
      promotionFailure: null,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: null,
      promotionFailure: 'http://failure.example.com',
    }),
  );
});

test('can retry a failure promotion', async () => {
  const { service, onComponentUpdate } = await createMockService({
    systemModifier: (builder) => {
      builder.withPromotionFailure('bbc-morph-bar', 'test', 'http://failure.example.com');
    },
  });

  await service.promote('bbc-morph-bar', 'test');

  expect(onComponentUpdate).toHaveBeenCalledTimes(2);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: 'test',
      promotionFailure: null,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: null,
      promotionFailure: 'http://failure.example.com',
    }),
  );

  await service.promote('bbc-morph-bar', 'test');

  expect(onComponentUpdate).toHaveBeenCalledTimes(7);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: 'test',
      promotionFailure: null,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      promoting: null,
      promotionFailure: null,
    }),
  );
});
