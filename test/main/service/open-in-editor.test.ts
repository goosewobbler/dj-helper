import createMockService from '../mocks/service';

test('can open component in editor', async () => {
  const { service, systemBuilder } = await createMockService();

  await service.openInEditor('bbc-morph-foo');

  expect(systemBuilder.getRunCommands()).toEqual(
    expect.arrayContaining([{ command: 'code /test/components/foo', directory: '/test/components' }]),
  );
});

test('can open component in editor on Windows Subsystem for Linux', async () => {
  const { service, systemBuilder } = await createMockService({ componentsDirectory: '/mnt/c/test/components' });

  await service.openInEditor('bbc-morph-foo');

  expect(systemBuilder.getRunCommands()).toEqual(
    expect.arrayContaining([{ command: 'code /test/components/foo', directory: '/mnt/c/test/components' }]),
  );
});

test('should add to current workspace if enabled through config', async () => {
  const { service, systemBuilder, config } = await createMockService();

  config.setValue('addToVSCodeWorkspace', true);

  await service.openInEditor('bbc-morph-foo');

  expect(systemBuilder.getRunCommands()).toEqual(
    expect.arrayContaining([{ command: 'code --add /test/components/foo', directory: '/test/components' }]),
  );
});
