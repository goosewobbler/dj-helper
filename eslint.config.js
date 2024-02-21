import eslint from '@eslint/js';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettier from 'eslint-config-prettier';
import vitest from 'eslint-plugin-vitest';
import react from 'eslint-plugin-react';
import node from 'eslint-plugin-n';
import * as wdio from 'eslint-plugin-wdio';
import globals from 'globals';

export default [
  // Ignored dirs
  {
    ignores: ['**/dist/**/*', '**/bundle/**/*', '**/static/**/*', '.vscode'],
  },
  // Ignored files
  {
    ignores: ['vitest.config.ts', 'eslint.config.js', 'test/features/lists/*.spec.tsx'],
  },
  // All files
  {
    files: ['**/*.{js,mjs,ts}'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: {
        ...globals.es2021,
      },
    },
    rules: {
      ...eslint.configs.recommended.rules,
    },
  },
  // Node & Electron main process files and scripts
  {
    files: ['**/*.{js,mjs,ts,tsx}'],
    ignores: ['src/renderer/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      n: node,
    },
    rules: {
      ...node.configs['flat/recommended-script'].rules,
      'n/no-unpublished-require': 'off',
      'n/no-unpublished-import': 'off',
      'n/no-missing-import': 'off',
    },
  },
  // Electron renderer process files
  {
    files: ['src/renderer/*.{ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
    },
  },
  // TS files
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
        project: './tsconfig.json',
      },
    },
    plugins: {
      '@typescript-eslint': ts,
    },
    rules: {
      ...ts.configs['eslint-recommended'].rules,
      ...ts.configs.recommended.rules,
      'no-undef': 'off', // redundant - TS will fail to compile with undefined vars
      'no-redeclare': 'off', // redundant - TS will fail to compile with duplicate declarations
      '@typescript-eslint/no-empty-interface': [
        'error',
        {
          allowSingleExtends: true,
        },
      ],
      '@typescript-eslint/no-namespace': [
        'error',
        {
          allowDeclarations: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
          ignoreRestSiblings: true,
          argsIgnorePattern: '^_',
          destructuredArrayIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-explicit-any': ['warn'],
    },
  },
  // TSX files
  {
    files: ['**/*.tsx'],
    plugins: {
      react,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
  },
  // Script files
  {
    files: ['scripts/*.{mjs,js}'],
    rules: {
      'no-console': 'off',
    },
  },
  // E2E files
  {
    files: ['test/e2e/*.spec.ts'],
    languageOptions: {
      globals: {
        ...wdio.configs.recommended.globals,
      },
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
        project: './test/e2e/tsconfig.json',
      },
    },
    plugins: {
      wdio,
    },
    rules: {
      ...wdio.configs.recommended.rules,
      '@typescript-eslint/no-var-requires': 'off',
    },
  },
  // Unit Test files
  {
    files: ['test/features/**/*.spec.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: { modules: true },
        ecmaVersion: 'latest',
        project: './test/tsconfig.json',
      },
    },
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules,
    },
  },
  // ensure all rules work with prettier
  prettier,
];
