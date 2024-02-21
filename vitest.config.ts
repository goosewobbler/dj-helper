import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/features/**/*.spec.ts'],
    exclude: [...configDefaults.exclude],
    environment: 'jsdom',
    setupFiles: ['test/setup.ts'],
    coverage: {
      enabled: true,
      include: ['src/**/*'],
      exclude: [],
      thresholds: {
        lines: 85,
        functions: 85,
        branches: 85,
        statements: 85,
      },
    },
  },
});
