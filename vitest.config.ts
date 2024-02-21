import { configDefaults, defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    include: ['test/features/**/*.spec.{ts,tsx}'],
    exclude: [...configDefaults.exclude],
    environment: 'jsdom',
    setupFiles: ['test/setup.ts'],
    coverage: {
      enabled: true,
      include: ['src/**/*'],
      exclude: [],
      thresholds: {
        lines: 10,
        functions: 10,
        branches: 10,
        statements: 10,
      },
    },
  },
});
