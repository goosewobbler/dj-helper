import { join } from 'path';
import ComponentState from '../../../src/types/ComponentState';
import createMockService from '../mocks/service';

test('can start and stop a component', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService();
  await service.start('bbc-morph-foo');
  const command = join(__dirname, '../../../node_modules/morph-cli/bin/morph.js develop --port 8083');

  expect(onComponentUpdate).toHaveBeenCalledTimes(2);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Starting,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Running,
    }),
  );
  expect(systemBuilder.getLogs()).toEqual([
    '[foo] Installing...',
    '[foo] Dependencies are up to date.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
  ]);

  await service.stop('bbc-morph-foo');

  expect(onComponentUpdate).toHaveBeenCalledTimes(3);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Stopped,
    }),
  );
  expect(systemBuilder.getLogs()).toEqual([
    '[foo] Installing...',
    '[foo] Dependencies are up to date.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
    '[foo] Stopping...',
    `[foo] Stopping ${command} run in /test/components/foo`,
    '[foo] Stopped.',
  ]);
});

test('component will use next available port when started', async () => {
  const { service, systemBuilder } = await createMockService();
  await service.start('bbc-morph-foo');
  await service.start('bbc-morph-baz');
  const command1 = join(__dirname, '../../../node_modules/morph-cli/bin/morph.js develop --port 8083');
  const command2 = join(__dirname, '../../../node_modules/morph-cli/bin/morph.js develop --port 8084');

  expect(systemBuilder.getLogs()).toEqual([
    '[foo] Installing...',
    '[foo] Dependencies are up to date.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command1} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command1} run in /test/components/foo`,
    '[foo] Running.',
    '[baz] Installing...',
    '[baz] Dependencies are up to date.',
    '[baz] Starting...',
    `[baz] Output log from ongoing ${command2} run in /test/components/baz`,
    `[baz] Error log from ongoing ${command2} run in /test/components/baz`,
    '[baz] Running.',
  ]);
});

test('component will reuse old port when restarted', async () => {
  const { service, systemBuilder } = await createMockService();
  const command = join(__dirname, '../../../node_modules/morph-cli/bin/morph.js develop --port 8083');
  await service.start('bbc-morph-foo');
  await service.stop('bbc-morph-foo');
  await service.start('bbc-morph-foo');

  expect(systemBuilder.getLogs()).toEqual([
    '[foo] Installing...',
    '[foo] Dependencies are up to date.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
    '[foo] Stopping...',
    `[foo] Stopping ${command} run in /test/components/foo`,
    '[foo] Stopped.',
    '[foo] Installing...',
    '[foo] Dependencies are up to date.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
  ]);
});

test('routing is updated when component is started and stopped', async () => {
  const { service, system } = await createMockService();

  const routing1 = JSON.parse(await system.file.readFile('/tmp/routing.json'));
  expect(routing1).toEqual({});

  await service.start('bbc-morph-foo');

  const routing2 = JSON.parse(await system.file.readFile('/tmp/routing.json'));
  expect(routing2).toEqual({
    'bbc-morph-foo': 8083,
  });

  await service.stop('bbc-morph-foo');

  const routing3 = JSON.parse(await system.file.readFile('/tmp/routing.json'));
  expect(routing3).toEqual({});
});

test('components are reloaded when started', async () => {
  const { service, onReload } = await createMockService();

  expect(onReload).toHaveBeenCalledTimes(0);

  await service.start('bbc-morph-foo');

  expect(onReload).toHaveBeenCalledTimes(1);

  await service.stop('bbc-morph-foo');
  await service.start('bbc-morph-foo');

  expect(onReload).toHaveBeenCalledTimes(2);
});

test('full data is returned for running components in summary request', async () => {
  const { service } = await createMockService();

  await service.start('bbc-morph-foo');
  const data = await service.getComponentsSummaryData();

  expect(data.components).toEqual([
    expect.objectContaining({
      history: [],
      name: 'bbc-morph-foo',
    }),
    expect.objectContaining({
      name: 'bbc-morph-bar',
    }),
    expect.objectContaining({
      name: 'bbc-morph-baz',
    }),
  ]);
});
