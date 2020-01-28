// tslint:disable object-literal-sort-keys

import packageHash from '../../../src/server/service/helpers/packageHash';

test('hash for same package is the same', () => {
  const packageContents = {
    dependencies: {
      bar: '^6.5.3',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '^4.0.0',
      react: '^16.0.0',
    },
    version: '1.2.3',
  };

  expect(packageHash(packageContents)).toBe(packageHash(packageContents));
});

test('hash for reordered package is the same', () => {
  const packageContents1 = {
    dependencies: {
      bar: '^6.5.3',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '^4.0.0',
      react: '^16.0.0',
    },
    version: '1.2.3',
  };

  const packageContents2 = {
    devDependencies: {
      react: '^16.0.0',
      lodash: '^4.0.0',
    },
    version: '1.2.3',
    dependencies: {
      foo: '^2.3.0',
      baz: '7.9.9',
      bar: '^6.5.3',
    },
  };

  expect(packageHash(packageContents1)).toBe(packageHash(packageContents2));
});

test('hash for extra properties in package is the same', () => {
  const packageContents1 = {
    dependencies: {
      bar: '^6.5.3',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '^4.0.0',
      react: '^16.0.0',
    },
    version: '1.2.3',
  };

  const packageContents2 = {
    dependencies: {
      bar: '^6.5.3',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '^4.0.0',
      react: '^16.0.0',
    },
    foo: 123,
    version: '1.2.3',
  };

  expect(packageHash(packageContents1)).toBe(packageHash(packageContents2));
});

test('hash for changed version is different', () => {
  const packageContents1 = {
    dependencies: {
      bar: '^6.5.3',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '^4.0.0',
      react: '^16.0.0',
    },
    version: '1.2.3',
  };

  const packageContents2 = {
    dependencies: {
      bar: '^6.5.3',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '^4.0.0',
      react: '^16.0.0',
    },
    version: '1.2.4',
  };

  expect(packageHash(packageContents1) === packageHash(packageContents2)).toBe(false);
});

test('hash for changed dependency is different', () => {
  const packageContents1 = {
    dependencies: {
      bar: '^6.5.3',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '^4.0.0',
      react: '^16.0.0',
    },
    version: '1.2.3',
  };

  const packageContents2 = {
    dependencies: {
      bar: '^6.5.4',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '^4.0.0',
      react: '^16.0.0',
    },
    version: '1.2.3',
  };

  expect(packageHash(packageContents1) === packageHash(packageContents2)).toBe(false);
});

test('hash for changed dev dependency is different', () => {
  const packageContents1 = {
    dependencies: {
      bar: '^6.5.3',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '^4.0.0',
      react: '^16.0.0',
    },
    version: '1.2.3',
  };

  const packageContents2 = {
    dependencies: {
      bar: '^6.5.3',
      baz: '7.9.9',
      foo: '^2.3.0',
    },
    devDependencies: {
      lodash: '4.0.0',
      react: '^16.0.0',
    },
    version: '1.2.3',
  };

  expect(packageHash(packageContents1) === packageHash(packageContents2)).toBe(false);
});
