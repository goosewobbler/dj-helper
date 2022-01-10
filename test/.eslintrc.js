module.exports = {
  root: true,
  overrides: [
    {
      files: '**/*.ts{,x}',
      extends: [
        'airbnb-typescript',
        'airbnb/hooks',
        'prettier',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:@typescript-eslint/recommended-requiring-type-checking',
        'plugin:import/recommended',
        'plugin:import/typescript',
        'plugin:jest-dom/recommended',
        'plugin:react/recommended',
        'plugin:testing-library/react',
      ],
      plugins: ['jest', 'jest-dom', 'testing-library', 'import', '@typescript-eslint', 'react', 'react-hooks'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: { jsx: true },
        ecmaVersion: 2021,
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        project: 'tsconfig.json',
      },
      env: {
        node: true,
        es6: true,
        jest: true,
      },
      rules: {
        'react/require-default-props': 'off',
        'react/jsx-filename-extension': 'off',
        'testing-library/no-await-sync-query': 'off',
        '@typescript-eslint/no-namespace': ['error', { allowDeclarations: true }],
        '@typescript-eslint/no-empty-interface': ['error', { allowSingleExtends: true }],
      },
      settings: {
        'node': {
          tryExtensions: ['.js', '.json', '.node', '.ts', '.tsx'],
        },
        'import/extensions': ['.ts', '.tsx'],
        'import/parsers': {
          '@typescript-eslint/parser': ['.ts', '.tsx'],
        },
        'import/resolver': {
          node: {},
          typescript: {
            alwaysTryTypes: true,
          },
        },
        'react': { version: 'detect' },
      },
    },
  ],
};
