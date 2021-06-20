import createMockService from '../mocks/service';

test('dependencies are initially empty', async () => {
  const { service } = await createMockService({
    systemModifier: (builder) => {
      builder.withSymbolicLink('/test/components/foo/node_modules/bbc-morph-baz');
    },
  });

  const data = await service.getComponentsData();

  expect(data.components).toEqual([
    expect.objectContaining({
      dependencies: [],
    }),
    expect.objectContaining({
      dependencies: [],
    }),
    expect.objectContaining({
      dependencies: [],
    }),
  ]);
});

test('can get a list of a components dependencies when details are fetched', async () => {
  const { service, system } = await createMockService({
    systemModifier: (builder) => {
      builder.withSymbolicLink('/test/components/foo/node_modules/bbc-morph-baz');
      builder.withVersionOnEnvironment('bbc-morph-bar', 'int', '2.9.9');
      builder.withVersionOnEnvironment('bbc-morph-baz', 'int', '2.8.8');
    },
  });

  system.morph.getShrinkwrapped = jest.fn().mockReturnValue({
    'bbc-morph-bar': '8.9.0',
    'bbc-morph-page-assembler': '1.2.3',
  });

  await service.fetchDetails('bbc-morph-foo');
  const data = await service.getComponentsData();

  expect(data.components).toEqual([
    expect.objectContaining({
      dependencies: [
        {
          displayName: 'bar',
          has: '8.9.0',
          latest: '2.9.9',
          linked: false,
          name: 'bbc-morph-bar',
          outdated: true,
          version: '^1.2.3',
        },
        {
          displayName: 'baz',
          has: '',
          latest: '2.8.8',
          linked: true,
          name: 'bbc-morph-baz',
          outdated: false,
          version: '^2.0.1',
        },
        {
          displayName: 'page-assembler',
          has: '1.2.3',
          latest: null,
          linked: false,
          name: 'bbc-morph-page-assembler',
          outdated: false,
          version: '^1.0.0',
        },
      ],
    }),
    expect.objectContaining({
      dependencies: [],
    }),
    expect.objectContaining({
      dependencies: [],
    }),
  ]);
});

test('should cache the has version on subsequent updates', async () => {
  const { service, system, onComponentUpdate } = await createMockService();

  system.morph.getShrinkwrapped = jest.fn().mockReturnValue({
    'bbc-morph-bar': '8.9.0',
    'bbc-morph-page-assembler': '1.2.3',
  });

  await service.fetchDetails('bbc-morph-foo');
  await service.fetchDetails('bbc-morph-foo');

  let updatesWithoutHasVersion = 0;

  onComponentUpdate.mock.calls.forEach((call) => {
    if (call[0].dependencies.length && call[0].dependencies[0].has === null) {
      updatesWithoutHasVersion++;
    }
  });

  expect(updatesWithoutHasVersion).toBe(0);
});
