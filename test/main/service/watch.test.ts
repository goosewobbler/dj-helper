import { join } from 'path';
import ComponentState from '../../../src/types/ComponentState';
import createMockService from '../mocks/service';

const nodeModulesPath = join(__dirname, '../../../node_modules');

test('component will build on change', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService();
  await service.start('bbc-morph-foo');
  const command = join(__dirname, '../../../node_modules/morph-cli/bin/morph.js develop --port 8083');
  await systemBuilder.simulateFileChanged('/test/components/foo/index.js');

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Building,
    }),
  );
  expect(systemBuilder.getLogs()).toEqual([
    '[foo] Installing...',
    '[foo] Dependencies are up to date.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
    '[foo] Rebuilding due to change in index.js',
    '[foo] Stopping...',
    `[foo] Stopping ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    '[foo] Stopped.',
    '[foo] Running grunt build...',
    `[foo] [grunt build] Output log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    `[foo] [grunt build] Error log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    '[foo] Built.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
  ]);
});

test('component will build only sass on sass change', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService();
  await service.start('bbc-morph-foo');
  const command = join(__dirname, '../../../node_modules/morph-cli/bin/morph.js develop --port 8083');
  await systemBuilder.simulateFileChanged('/test/components/foo/sass/main.scss');

  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Building,
    }),
  );
  expect(systemBuilder.getLogs()).toEqual([
    '[foo] Installing...',
    '[foo] Dependencies are up to date.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
    '[foo] Rebuilding due to change in sass/main.scss',
    '[foo] Stopping...',
    `[foo] Stopping ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    '[foo] Stopped.',
    '[foo] Running grunt sass...',
    `[foo] [grunt sass] Output log from running ${nodeModulesPath}/.bin/grunt sass in /test/components/foo`,
    `[foo] [grunt sass] Error log from running ${nodeModulesPath}/.bin/grunt sass in /test/components/foo`,
    '[foo] Built.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
  ]);
});

test('component will not build on change if not started', async () => {
  const { systemBuilder } = await createMockService();
  await systemBuilder.simulateFileChanged('/test/components/foo/index.js');

  expect(systemBuilder.getLogs()).toEqual([]);
});

test('ignore random file change that does not belong to a component', async () => {
  const { systemBuilder } = await createMockService();
  await systemBuilder.simulateFileChanged('/test/components/blah.txt');

  expect(systemBuilder.getLogs()).toEqual([]);
});
