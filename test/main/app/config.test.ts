import Config from '../../../src/server/app/Config';
import createMockSystem from '../mocks/system';

test('feature toggles are read from command line args', async () => {
  const configFileContents = JSON.stringify({
    foo: 'hello',
  });

  const system = createMockSystem()
    .withReadFile('/c/mdcc.json', configFileContents)
    .withCommandLineArg('--feature=foo')
    .withCommandLineArg('--feature=bar')
    .withCommandLineArg('--hello=baz')
    .build();

  const config = await Config('/c/mdcc.json', system);

  expect(config.isFeatureEnabled('foo')).toBe(true);
  expect(config.isFeatureEnabled('bar')).toBe(true);
  expect(config.isFeatureEnabled('baz')).toBe(false);
  expect(config.getValue('foo')).toBe('hello');
});

test('config values are read from file', async () => {
  const configFileContents = JSON.stringify({
    bar: 456,
    foo: 'hello',
  });

  const system = createMockSystem().withReadFile('/c/mdcc.json', configFileContents).build();

  const config = await Config('/c/mdcc.json', system);

  expect(config.getValue('foo')).toBe('hello');
  expect(config.getValue('bar')).toBe(456);
  expect(config.getValue('baz')).toBe(null);
});

test('can override config file features with command line', async () => {
  const configFileContents = JSON.stringify({
    features: {
      bar: true,
      baz: true,
      foo: false,
    },
    foo: 'hello',
  });

  const system = createMockSystem()
    .withCommandLineArg('--feature=foo')
    .withCommandLineArg('--feature=bar')
    .withCommandLineArg('--hello=baz')
    .withReadFile('/c/mdcc.json', configFileContents)
    .build();

  const config = await Config('/c/mdcc.json', system);

  expect(config.isFeatureEnabled('foo')).toBe(true);
  expect(config.isFeatureEnabled('bar')).toBe(true);
  expect(config.isFeatureEnabled('baz')).toBe(true);
});

test('can set config values', async () => {
  const system = createMockSystem().build();

  const config = await Config('/c/mdcc.json', system);

  await config.setValue('foo', 'world');
  await config.setValue('bar', 789);
  await config.setValue('baz', false);

  expect(config.getValue('foo')).toBe('world');
  expect(config.getValue('bar')).toBe(789);
  expect(config.getValue('baz')).toBe(false);

  const updatedConfigFileContents = JSON.parse(await system.file.readFile('/c/mdcc.json'));

  expect(updatedConfigFileContents).toEqual({
    bar: 789,
    baz: false,
    foo: 'world',
  });
});
