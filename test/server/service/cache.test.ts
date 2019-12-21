import { join } from 'path';
import ComponentState from '../../../src/types/ComponentState';
import createMockService from '../mocks/service';

const nodeModulesPath = join(__dirname, '../../../node_modules');

test('can get and set cache option', async () => {
  const { service, onComponentUpdate } = await createMockService();

  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: 'bbc-morph-foo',
        useCache: false,
      }),
    ]),
  );

  await service.setUseCache('bbc-morph-foo', true);

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      useCache: true,
    }),
  );
  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: 'bbc-morph-foo',
        useCache: true,
      }),
    ]),
  );

  await service.setUseCache('bbc-morph-foo', false);

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      useCache: false,
    }),
  );
  expect((await service.getComponentsData()).components).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        name: 'bbc-morph-foo',
        useCache: false,
      }),
    ]),
  );
});

test('enabling and disabling the cache option will restart the component', async () => {
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

  await service.setUseCache('bbc-morph-foo', true);
  await service.setUseCache('bbc-morph-foo', false);

  expect(systemBuilder.getLogs()).toEqual([
    '[foo] Installing...',
    '[foo] Dependencies are up to date.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
    '[foo] Stopping...',
    `[foo] Stopping ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    '[foo] Stopped.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --cache --port 8083 run in /test/components/foo`,
    `[foo] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --cache --port 8083 run in /test/components/foo`,
    '[foo] Running with cache enabled.',
    '[foo] Stopping...',
    `[foo] Stopping ${nodeModulesPath}/morph-cli/bin/morph.js develop --cache --port 8083 run in /test/components/foo`,
    '[foo] Stopped.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    `[foo] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    '[foo] Running.',
  ]);
});
