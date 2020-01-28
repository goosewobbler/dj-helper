import { join } from 'path';
import ComponentState from '../../../src/types/ComponentState';
import createMockService from '../mocks/service';

const nodeModulesPath = join(__dirname, '../../../node_modules');

test('component is installed and built when starting with out of date dependencies', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder.withReadFile(join('/test/components/foo/node_modules/.mdc.json'), JSON.stringify({ hash: 'old' }));
    },
  });
  await service.start('bbc-morph-foo');
  await service.stop('bbc-morph-foo');
  await service.start('bbc-morph-foo');
  const command = join(__dirname, '../../../node_modules/morph-cli/bin/morph.js develop --port 8083');

  expect(onComponentUpdate).toHaveBeenCalledTimes(7);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Installing,
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
      name: 'bbc-morph-foo',
      state: ComponentState.Stopped,
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
    '[foo] Installing...',
    '[foo] Dependencies need installing.',
    '[foo] Running npm install...',
    '[foo] [npm install] Output log from running npm install --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt in /test/components/foo',
    '[foo] [npm install] Error log from running npm install --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt in /test/components/foo',
    '[foo] [bower install] Output log from running node node_modules/bower/bin/bower install in /test/components/foo',
    '[foo] [bower install] Error log from running node node_modules/bower/bin/bower install in /test/components/foo',
    '[foo] Installed.',
    '[foo] Running grunt build...',
    `[foo] [grunt build] Output log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    `[foo] [grunt build] Error log from running ${nodeModulesPath}/.bin/grunt build in /test/components/foo`,
    '[foo] Built.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
    '[foo] Stopping...',
    `[foo] Stopping ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    '[foo] Stopped.',
    '[foo] Installing...',
    '[foo] Dependencies are up to date.',
    '[foo] Starting...',
    `[foo] Output log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    `[foo] Error log from ongoing ${nodeModulesPath}/morph-cli/bin/morph.js develop --port 8083 run in /test/components/foo`,
    '[foo] Running.',
  ]);
});

test('can reinstall a component', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder.withVersionOnEnvironment('bbc-morph-bar', 'int', '2.9.9');
      builder.withVersionOnEnvironment('bbc-morph-baz', 'int', '2.8.8');
    },
  });
  await service.reinstall('bbc-morph-foo');

  expect(onComponentUpdate).toHaveBeenCalledTimes(9);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-foo',
      state: ComponentState.Installing,
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
      dependencies: [],
      name: 'bbc-morph-foo',
      state: ComponentState.Running,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      dependencies: [
        {
          displayName: 'bar',
          has: '',
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
          linked: false,
          name: 'bbc-morph-baz',
          outdated: false,
          version: '^2.0.1',
        },
        {
          displayName: 'page-assembler',
          has: '',
          latest: null,
          linked: false,
          name: 'bbc-morph-page-assembler',
          outdated: false,
          version: '^1.0.0',
        },
      ],
      name: 'bbc-morph-foo',
      state: ComponentState.Running,
    }),
  );
  expect(systemBuilder.getDeletedDirectories()).toEqual(['/test/components/foo/node_modules']);
  expect(systemBuilder.getLogs()).toEqual([
    '[foo] Deleting node_modules.',
    '[foo] Running npm install...',
    '[foo] [npm install] Output log from running npm install --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt in /test/components/foo',
    '[foo] [npm install] Error log from running npm install --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt in /test/components/foo',
    '[foo] [bower install] Output log from running node node_modules/bower/bin/bower install in /test/components/foo',
    '[foo] [bower install] Error log from running node node_modules/bower/bin/bower install in /test/components/foo',
    '[foo] Installed.',
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

test('should only attempt bower and grunt steps if they are used in project', async () => {
  const { service, onComponentUpdate, systemBuilder } = await createMockService({
    systemModifier: builder => {
      builder.withReadFile(join('/test/components/bar/node_modules/.mdc.json'), JSON.stringify({ hash: 'old' }));
    },
  });
  await service.start('bbc-morph-bar');
  const command = join(__dirname, '../../../node_modules/morph-cli/bin/morph.js develop --port 8083');

  expect(onComponentUpdate).toHaveBeenCalledTimes(4);
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      state: ComponentState.Installing,
    }),
  );
  expect(onComponentUpdate).toHaveBeenCalledWith(
    expect.objectContaining({
      name: 'bbc-morph-bar',
      state: ComponentState.Building,
    }),
  );
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
  expect(systemBuilder.getLogs()).toEqual([
    '[bar] Installing...',
    '[bar] Dependencies need installing.',
    '[bar] Running npm install...',
    '[bar] [npm install] Output log from running npm install --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt in /test/components/bar',
    '[bar] [npm install] Error log from running npm install --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt in /test/components/bar',
    '[bar] Installed.',
    '[bar] Starting...',
    `[bar] Output log from ongoing ${command} run in /test/components/bar`,
    `[bar] Error log from ongoing ${command} run in /test/components/bar`,
    '[bar] Running.',
  ]);
});

test('package hash is written to node_modules after install', async () => {
  const { service, system } = await createMockService();
  await service.start('bbc-morph-foo');
  const mdcInfo = JSON.parse(await system.file.readFile('/test/components/foo/node_modules/.mdc.json'));

  expect(mdcInfo).toEqual({
    hash: '2fa927daa679b5bee86524bb65b77211e78c15ca8905cf0064ce94c1a09a7db1',
  });
});

test('component is not installed and built when starting if disabled through config', async () => {
  const { service, onComponentUpdate, systemBuilder, config } = await createMockService({
    systemModifier: builder => {
      builder.withReadFile(join('/test/components/foo/node_modules/.mdc.json'), JSON.stringify({ hash: 'old' }));
    },
  });
  await config.setValue('installOnStart', false);
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
    '[foo] Starting...',
    `[foo] Output log from ongoing ${command} run in /test/components/foo`,
    `[foo] Error log from ongoing ${command} run in /test/components/foo`,
    '[foo] Running.',
  ]);
});
