import { join } from 'path';

import packageHash from '../../../src/server/service/helpers/packageHash';
import createMockSystem from './system';

const fooPackage = {
  dependencies: {
    'bbc-morph-bar': '^1.2.3',
    'bbc-morph-baz': '^2.0.1',
    'bbc-morph-page-assembler': '^1.0.0',
    lodash: '^4.0.0',
  },
  name: 'bbc-morph-foo',
  version: '1.2.3',
};

const barPackage = {
  dependencies: {
    react: '^16.0.0',
  },
  name: 'bbc-morph-bar',
  version: '2.0.0',
};

const bazPackage = {
  name: 'bbc-morph-baz',
  scripts: {
    build: '123',
  },
  version: '2.2.0',
};

const createDefaultMockSystem = (componentsDirectory = '/test/components') => {
  const systemBuilder = createMockSystem()
    .withCurrentWorkingDirectory(componentsDirectory)
    .withGetPackageDirectories(componentsDirectory, ['foo', 'bar', 'baz'])
    .withReadFile(join(componentsDirectory, 'foo/package.json'), JSON.stringify(fooPackage))
    .withReadFile(join(componentsDirectory, 'bar/package.json'), JSON.stringify(barPackage))
    .withReadFile(join(componentsDirectory, 'baz/package.json'), JSON.stringify(bazPackage))
    .withReadFile(
      join(componentsDirectory, 'foo/node_modules/.mdc.json'),
      JSON.stringify({ hash: packageHash(fooPackage) }),
    )
    .withReadFile(
      join(componentsDirectory, 'bar/node_modules/.mdc.json'),
      JSON.stringify({ hash: packageHash(barPackage) }),
    )
    .withReadFile(
      join(componentsDirectory, 'baz/node_modules/.mdc.json'),
      JSON.stringify({ hash: packageHash(bazPackage) }),
    )
    .withExists(join(componentsDirectory, 'foo/bower.json'))
    .withExists(join(componentsDirectory, 'foo/Gruntfile.js'));

  return { system: systemBuilder.build(), systemBuilder };
};

export default createDefaultMockSystem;
