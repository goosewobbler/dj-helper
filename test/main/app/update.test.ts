import Updater from '../../../src/server/app/Updater';
import createMockSystem from '../mocks/system';

test('can get status when failed to fetch version', async () => {
  const system = createMockSystem().build();

  const updater = Updater(system, '1.0.0');

  const status = await updater.getStatus();

  expect(status).toEqual({
    currentVersion: '1.0.0',
    updateAvailable: null,
    updated: false,
    updating: false,
  });
});

test('can get status when behind latest version', async () => {
  const systemBuilder = createMockSystem().withProcessOutputs(
    'npm install git+ssh://git@github.com:bbc/morph-developer-console.git#version --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt',
    '/tmp/morph-developer-console-version',
    ['some random output', 'installed 1 pacakge morph-developer-console@2.3.4 (sdkhdfjkhsdf)'],
    ['some random error'],
  );

  const system = systemBuilder.build();
  const updater = Updater(system, '1.0.0');
  const status = await updater.getStatus();

  expect(systemBuilder.getDeletedDirectories()).toEqual(['/tmp/morph-developer-console-version']);

  expect(status).toEqual({
    currentVersion: '1.0.0',
    updateAvailable: '2.3.4',
    updated: false,
    updating: false,
  });
});

test('can get status when already on latest version', async () => {
  const system = createMockSystem()
    .withProcessOutputs(
      'npm install git+ssh://git@github.com:bbc/morph-developer-console.git#version --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt',
      '/tmp/morph-developer-console-version',
      ['some random output', 'installed 1 pacakge morph-developer-console@2.3.4 (sdkhdfjkhsdf)'],
      ['some random error'],
    )
    .build();

  const updater = Updater(system, '2.3.4');
  const status = await updater.getStatus();

  expect(status).toEqual({
    currentVersion: '2.3.4',
    updateAvailable: null,
    updated: false,
    updating: false,
  });
});

test('can get status when ahead of latest version', async () => {
  const system = createMockSystem()
    .withProcessOutputs(
      'npm install git+ssh://git@github.com:bbc/morph-developer-console.git#version --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt',
      '/tmp/morph-developer-console-version',
      ['some random output', 'installed 1 pacakge morph-developer-console@2.3.4 (sdkhdfjkhsdf)'],
      ['some random error'],
    )
    .build();

  const updater = Updater(system, '4.0.0');
  const status = await updater.getStatus();

  expect(status).toEqual({
    currentVersion: '4.0.0',
    updateAvailable: null,
    updated: false,
    updating: false,
  });
});

test('should fetch version on every status request', async () => {
  const systemBuilder = createMockSystem();
  const system = systemBuilder.build();
  const updater = Updater(system, '1.0.0');

  await updater.getStatus();
  await updater.getStatus();

  expect(systemBuilder.getRunCommands().length).toBe(2);
});

test('can update', async () => {
  const systemBuilder = createMockSystem().withCurrentWorkingDirectory('/test/components');

  const system = systemBuilder.build();
  const updater = Updater(system, '1.0.0');

  await updater.update();

  expect(systemBuilder.getRunCommands()).toEqual(
    expect.arrayContaining([
      {
        command:
          'npm install git+ssh://git@github.com:bbc/morph-developer-console.git --global --production --registry https://npm.morph.int.tools.bbc.co.uk --cert="$(cat /etc/pki/certificate.pem)" --key="$(cat /etc/pki/certificate.pem)" --cafile=/etc/pki/tls/certs/ca-bundle.crt',
        directory: '/test/components',
      },
    ]),
  );

  expect(await updater.getStatus()).toEqual({
    currentVersion: '1.0.0',
    updateAvailable: null,
    updated: true,
    updating: false,
  });

  expect(systemBuilder.getLogs()).toEqual([
    '[console] Updating Morph Developer Console...',
    '[console] Morph Developer Console updated sucessfully. Restart to apply updates.',
  ]);
});
