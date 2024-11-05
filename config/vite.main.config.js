import { defineConfig } from 'vite';
import { node } from '../.electron-vendors.cache.json';
import { join } from 'node:path';

const PACKAGE_ROOT = join(__dirname, '../');
const PROJECT_ROOT = PACKAGE_ROOT;

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config
 */
export default defineConfig({
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  envDir: PROJECT_ROOT,
  resolve: {
    // Some libs that can run in both Web and Node.js, such as `axios`, we need to tell Vite to build them in Node.js.
    browserField: false,
    // List of fields in package.json to try when resolving a package's entry point. 
    mainFields: ['module', 'jsnext:main', 'jsnext'],
  },
  build: {
    ssr: true,
    sourcemap: 'inline',
    target: `node${node}`,
    outDir: 'dist/main',
    assetsDir: '.',
    minify: process.env.MODE !== 'development',
    lib: {
      entry: join(PACKAGE_ROOT, 'src', 'main.ts'),
      formats: ['cjs'],
    },
    rollupOptions: {
      output: {
        entryFileNames: '[name].cjs',
      },
    },
    emptyOutDir: true,
    reportCompressedSize: false,
  },
});
