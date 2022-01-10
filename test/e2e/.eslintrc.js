module.exports = {
  root: true,
  overrides: [
    {
      files: '**/*.ts',
      extends: [
        'airbnb-typescript/base',
        'prettier',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:testing-library/dom',
      ],
      plugins: ['testing-library', 'import', '@typescript-eslint', 'webdriverio'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        tsconfigRootDir: __dirname,
        project: 'tsconfig.json',
      },
      env: {
        node: true,
        es6: true,
      },
      rules: {
        'testing-library/no-await-sync-query': 'off',
        '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
        '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
      },
      settings: {
        'node': {
          tryExtensions: ['.js', '.json', '.node', '.ts'],
        },
        'import/extensions': ['.ts'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts'],
        },
        'import/resolver': {
          node: {},
          typescript: {
            alwaysTryTypes: true,
          },
        },
      },
    },
  ],
};
