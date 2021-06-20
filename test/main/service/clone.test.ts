import createMockService from '../mocks/service';

test('can clone a component', async () => {
  const { service, system, systemBuilder } = await createMockService({
    systemModifier: (builder) => {
      builder.withCurrentWorkingDirectory('/cwd');
      builder.withReadFile(
        '/test/components/cloned-foo/package.json',
        JSON.stringify({
          hello: 123,
        }),
      );
    },
  });

  await service.clone('bbc-morph-foo', 'cloned-foo', { description: 'A cloned data component.' });

  expect(systemBuilder.getCopiedDirectories()).toEqual([
    {
      filter: true,
      from: '/test/components/foo',
      to: '/test/components/cloned-foo',
    },
  ]);

  const packageJson = JSON.parse(await system.file.readFile('/test/components/cloned-foo/package.json'));
  const readme = await system.file.readFile('/test/components/cloned-foo/README.md');

  expect(packageJson).toEqual({
    description: 'A cloned data component.',
    hello: 123,
    homepage: 'http://github.com/bbc/morph-modules/tree/master/cloned-foo',
    name: 'bbc-morph-cloned-foo',
  });

  expect(readme).toBe(`# cloned-foo\n\nA cloned data component.\n`);
});

test('component is started after clone', async () => {
  const { service } = await createMockService({
    systemModifier: (builder) => {
      builder.withCurrentWorkingDirectory('/cwd');
      builder.withReadFile(
        '/test/components/cloned-foo/package.json',
        JSON.stringify({
          hello: 123,
        }),
      );
    },
  });

  await service.clone('bbc-morph-foo', 'cloned-foo', { description: 'A cloned data component.' });

  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: 'bbc-morph-cloned-foo',
      }),
    ]),
  );
});
