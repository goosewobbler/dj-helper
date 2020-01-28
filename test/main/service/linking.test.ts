import { join } from 'path';
import ComponentState from '../../../src/types/ComponentState';
import createMockService from '../mocks/service';

const nodeModulesPath = join(__dirname, '../../../node_modules');

test('can link a component dependency', async () => {
  const { service, onComponentUpdate, system, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder.withReadFile(join('/test/components/baz/node_modules/.mdc.json'), JSON.stringify({ hash: 'old' }));
      builder.withSymbolicLink('/test/components/foo/node_modules/bbc-morph-baz');
      builder.withVersionOnEnvironment('bbc-morph-baz', 'int', '2.8.8');
    },
  });

  await service.link('bbc-morph-foo', 'bbc-morph-baz');

  expect(onComponentUpdate).toHaveBeenCalledTimes(12);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: ['bbc-morph-baz'],
      name: 'bbc-morph-foo',
      state: ComponentState.Linking,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: [],
      name: 'bbc-morph-baz',
      state: ComponentState.Installing,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: [],
      name: 'bbc-morph-baz',
      state: ComponentState.Building,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: [],
      name: 'bbc-morph-baz',
      state: ComponentState.Stopped,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: ['bbc-morph-baz'],
      name: 'bbc-morph-foo',
      state: ComponentState.Building,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: ['bbc-morph-baz'],
      name: 'bbc-morph-foo',
      state: ComponentState.Starting,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: ['bbc-morph-baz'],
      name: 'bbc-morph-foo',
      state: ComponentState.Running,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      dependencies: expect.arrayContaining([
        {
          displayName: 'baz',
          has: '',
          latest: '2.8.8',
          linked: true,
          name: 'bbc-morph-baz',
          outdated: false,
          version: '^2.0.1',
        },
      ]),
      linking: [],
      name: 'bbc-morph-foo',
      state: ComponentState.Running,
    }),
  );

  expect(systemBuilder.getLogs()).toEqual([
    '[baz] Installing...',
    '[baz] Dependencies need installing.',
    '[baz] Running npm install...',
    '[baz] [npm install] Output log from running npm install --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt in /test/components/baz',
    '[baz] [npm install] Error log from running npm install --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt in /test/components/baz',
    '[baz] Installed.',
    '[baz] Running npm run build...',
    `[baz] [npm run build] Output log from running npm run build in /test/components/baz`,
    `[baz] [npm run build] Error log from running npm run build in /test/components/baz`,
    '[baz] Built.',
    '[foo] Linking bbc-morph-baz...',
    '[foo] Linked bbc-morph-baz.',
    '[foo] Running grunt build...',
    `[foo] [grunt build] Output log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    `[foo] [grunt build] Error log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    '[foo] Built.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    `[foo] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    '[foo] Running.',
  ]);

  expect(system.file.moveDirectory).toHaveBeenCalledTimes(1);
  expect(system.file.moveDirectory).toHaveBeenCalledWith(
    '/test/components/foo/node_modules/bbc-morph-baz',
    '/test/components/foo/node_modules/bbc-morph-baz.old',
  );

  expect(system.file.createSymlink).toHaveBeenCalledTimes(1);
  expect(system.file.createSymlink).toHaveBeenCalledWith(
    '/test/components/baz',
    '/test/components/foo/node_modules/bbc-morph-baz',
  );
});

test('can unlink a component dependency', async () => {
  const { service, onComponentUpdate, systemBuilder, system } = await createMockService({
    systemModifier: builder => {
      builder.withVersionOnEnvironment('bbc-morph-baz', 'int', '2.8.8');
    },
  });
  await service.unlink('bbc-morph-foo', 'bbc-morph-baz');

  expect(onComponentUpdate).toHaveBeenCalledTimes(9);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: ['bbc-morph-baz'],
      name: 'bbc-morph-foo',
      state: ComponentState.Linking,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: ['bbc-morph-baz'],
      name: 'bbc-morph-foo',
      state: ComponentState.Building,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: ['bbc-morph-baz'],
      name: 'bbc-morph-foo',
      state: ComponentState.Starting,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      linking: ['bbc-morph-baz'],
      name: 'bbc-morph-foo',
      state: ComponentState.Running,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      dependencies: expect.arrayContaining([
        {
          displayName: 'baz',
          has: '',
          latest: '2.8.8',
          linked: false,
          name: 'bbc-morph-baz',
          outdated: false,
          version: '^2.0.1',
        },
      ]),
      linking: [],
      name: 'bbc-morph-foo',
      state: ComponentState.Running,
    }),
  );

  expect(systemBuilder.getLogs()).toEqual([
    '[foo] Unlinking bbc-morph-baz...',
    '[foo] Unlinked bbc-morph-baz.',
    '[foo] Running grunt build...',
    `[foo] [grunt build] Output log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    `[foo] [grunt build] Error log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    '[foo] Built.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    `[foo] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    '[foo] Running.',
  ]);

  expect(system.file.removeSymlink).toHaveBeenCalledTimes(1);
  expect(system.file.removeSymlink).toHaveBeenCalledWith('/test/components/foo/node_modules/bbc-morph-baz');

  expect(system.file.moveDirectory).toHaveBeenCalledTimes(1);
  expect(system.file.moveDirectory).toHaveBeenCalledWith(
    '/test/components/foo/node_modules/bbc-morph-baz.old',
    '/test/components/foo/node_modules/bbc-morph-baz',
  );
});
