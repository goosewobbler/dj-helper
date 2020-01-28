import { join } from 'path';
import CreateType from '../../../src/server/types/CreateType';
import createMockService from '../mocks/service';

test('can create a new data component', async () => {
  const { service, system, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder.withReadFile(
        '/test/components/new-data/package.json',
        JSON.stringify({
          hello: 123,
        }),
      );
    },
  });

  await service.create('new-data', CreateType.Data, { description: 'A new data component.' });

  expect(systemBuilder.getCopiedDirectories()).toEqual([
    {
      filter: false,
      from: join(__dirname, '../../../templates/data'),
      to: '/test/components/new-data',
    },
  ]);

  const packageJson = JSON.parse(await system.file.readFile('/test/components/new-data/package.json'));
  const readme = await system.file.readFile('/test/components/new-data/README.md');

  expect(packageJson).toEqual({
    description: 'A new data component.',
    hello: 123,
    homepage: 'http://github.com/bbc/morph-modules/tree/master/new-data',
    name: 'bbc-morph-new-data',
  });

  expect(readme).toBe(`# new-data\n\nA new data component.\n`);

  let caughtError: any;
  try {
    await system.file.readFile('/test/components/new-data/test/multi-tier/index.feature');
  } catch (error) {
    caughtError = error;
  }
  expect(caughtError).toBe('No such file /test/components/new-data/test/multi-tier/index.feature');

  expect(system.file.moveDirectory).toHaveBeenCalledTimes(1);
  expect(system.file.moveDirectory).toHaveBeenCalledWith(
    '/test/components/new-data/.npmignore',
    '/test/components/new-data/.gitignore',
  );
});

test('can create a new view component', async () => {
  const { service, system, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder.withReadFile(
        '/test/components/new-view/package.json',
        JSON.stringify({
          hello: 123,
        }),
      );
      builder.withReadFile(
        '/test/components/new-view/test/multi-tier/index.feature',
        'A feature file for requesting the bbc-morph-example component',
      );
    },
  });

  await service.create('new-view', CreateType.View, { description: 'A new view component.' });

  expect(systemBuilder.getCopiedDirectories()).toEqual([
    {
      filter: false,
      from: join(__dirname, '../../../templates/view'),
      to: '/test/components/new-view',
    },
  ]);

  const packageJson = JSON.parse(await system.file.readFile('/test/components/new-view/package.json'));
  const readme = await system.file.readFile('/test/components/new-view/README.md');
  const featureFile = await system.file.readFile('/test/components/new-view/test/multi-tier/index.feature');

  expect(packageJson).toEqual({
    description: 'A new view component.',
    hello: 123,
    homepage: 'http://github.com/bbc/morph-modules/tree/master/new-view',
    name: 'bbc-morph-new-view',
  });

  expect(readme).toBe(`# new-view\n\nA new view component.\n`);

  expect(featureFile).toBe('A feature file for requesting the bbc-morph-new-view component');

  expect(system.file.moveDirectory).toHaveBeenCalledTimes(1);
  expect(system.file.moveDirectory).toHaveBeenCalledWith(
    '/test/components/new-view/.npmignore',
    '/test/components/new-view/.gitignore',
  );
});

test('can create a new viewcss component', async () => {
  const { service, system, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder.withReadFile(
        '/test/components/new-viewcss/package.json',
        JSON.stringify({
          hello: 123,
        }),
      );
      builder.withReadFile(
        '/test/components/new-viewcss/test/multi-tier/index.feature',
        'A feature file for requesting the bbc-morph-example component',
      );
    },
  });

  await service.create('new-viewcss', CreateType.ViewCSS, { description: 'A new viewcss component.' });

  expect(systemBuilder.getCopiedDirectories()).toEqual([
    {
      filter: false,
      from: join(__dirname, '../../../templates/viewcss'),
      to: '/test/components/new-viewcss',
    },
  ]);

  const packageJson = JSON.parse(await system.file.readFile('/test/components/new-viewcss/package.json'));
  const readme = await system.file.readFile('/test/components/new-viewcss/README.md');
  const featureFile = await system.file.readFile('/test/components/new-viewcss/test/multi-tier/index.feature');

  expect(packageJson).toEqual({
    description: 'A new viewcss component.',
    hello: 123,
    homepage: 'http://github.com/bbc/morph-modules/tree/master/new-viewcss',
    name: 'bbc-morph-new-viewcss',
  });

  expect(readme).toBe(`# new-viewcss\n\nA new viewcss component.\n`);

  expect(featureFile).toBe('A feature file for requesting the bbc-morph-new-viewcss component');

  expect(system.file.moveDirectory).toHaveBeenCalledTimes(1);
  expect(system.file.moveDirectory).toHaveBeenCalledWith(
    '/test/components/new-viewcss/.npmignore',
    '/test/components/new-viewcss/.gitignore',
  );
});

test('component is started after creation', async () => {
  const { service } = await createMockService({
    systemModifier: builder => {
      builder.withReadFile(
        '/test/components/new-data/package.json',
        JSON.stringify({
          hello: 123,
        }),
      );
    },
  });

  await service.create('new-data', CreateType.Data, { description: 'A new data component.' });

  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: 'bbc-morph-new-data',
      }),
    ]),
  );
});
