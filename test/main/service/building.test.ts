import { join } from 'path';
import ComponentState from '../../../src/types/ComponentState';
import createMockService from '../mocks/service';

const nodeModulesPath = join(__dirname, '../../../node_modules');

test('can build a component', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService();
  await service.build('bbc-morph-foo');

  expect(onComponentUpdate).toHaveBeenCalledTimes(3);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Building,
    }),
  );
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
    '[foo] Running grunt build...',
    `[foo] [grunt build] Output log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    `[foo] [grunt build] Error log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    '[foo] Built.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    `[foo] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    '[foo] Running.',
  ]);
});

test('should use npm build script if available', async () => {
  const { service, systemBuilder } = await createMockService();
  await service.build('bbc-morph-baz');

  expect(systemBuilder.getLogs()).toEqual([
    '[baz] Running npm run build...',
    '[baz] [npm run build] Output log from running npm run build in /test/components/baz',
    '[baz] [npm run build] Error log from running npm run build in /test/components/baz',
    '[baz] Built.',
    '[baz] Starting...',
    `[baz] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/baz`,
    `[baz] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/baz`,
    '[baz] Running.',
  ]);
});

test('other running components will restart after build', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService();
  await service.start('bbc-morph-bar');
  await service.build('bbc-morph-foo');

  expect(onComponentUpdate).toHaveBeenCalledTimes(8);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      state: ComponentState.Starting,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      state: ComponentState.Running,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Building,
    }),
  );
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
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      state: ComponentState.Stopped,
    }),
  );

  expect(systemBuilder.getLogs()).toEqual([
    '[bar] Installing...',
    '[bar] Dependencies are up to date.',
    '[bar] Starting...',
    `[bar] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/bar`,
    `[bar] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/bar`,
    '[bar] Running.',
    '[foo] Running grunt build...',
    `[foo] [grunt build] Output log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    `[foo] [grunt build] Error log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    '[foo] Built.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8084 run in /test/components/foo`,
    `[foo] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8084 run in /test/components/foo`,
    '[bar] Stopping...',
    `[bar] Stopping ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/bar`,
    '[bar] Stopped.',
    '[bar] Installing...',
    '[bar] Dependencies are up to date.',
    '[bar] Starting...',
    `[bar] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/bar`,
    `[bar] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/bar`,
    '[bar] Running.',
    '[foo] Running.',
  ]);
});
