import { defineConfig, externalizeDepsPlugin } from 'electron-vite';
import react from '@vitejs/plugin-react-swc';
import { nodeResolve } from '@rollup/plugin-node-resolve';
// import commonjs from '@rollup/plugin-commonjs';

export default defineConfig(({ mode }) => {
  const isProd = mode === 'production';
  const isTest = process.env.TEST === 'true';

  return {
    main: {
      build: {
        clean: true,
        entry: { main: isTest ? 'src/main/main.test.ts' : 'src/main/main.ts' },
        target: 'node18',
        // The requested module 'electron-updater' is a CommonJS module, which may not support all module.exports as named exports.
        noExternal: isProd ? [/(.*)/] : ['electron-updater', 'electron', 'electron-store'],
        minify: isProd,
        watch: isProd ? null : { include: '' },
        rollupOptions: {
          output: {
            format: 'es',
          },
        },
      },
    },
    preload: {
      plugins: [externalizeDepsPlugin({ exclude: ['electron-store'] })],
      build: {
        clean: true,
        entry: { preload: isTest ? 'src/preload/preload.test.ts' : 'src/preload/index.ts' },
        minify: isProd,
        format: 'esm',
        watch: isProd ? null : { include: '' },
        rollupOptions: {
          output: {
            format: 'es',
            inlineDynamicImports: true,
            entryFileNames: '[name].mjs',
          },
          plugins: [nodeResolve()],
          external: ['electron', 'electron-store'],
        },
      },
    },
    renderer: {
      build: {
        clean: true,
        entry: ['src/renderer/index.tsx'],
        minify: true,
        rollupOptions: {
          output: {
            format: 'es',
          },
          external: ['electron', 'electron-store'],
          plugins: [nodeResolve()],
        },
      },
      plugins: [react(), externalizeDepsPlugin({ exclude: ['electron-store'] })],
    },
  };
});
