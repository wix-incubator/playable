import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';
import { defineConfig } from 'vitest/config';

const require = createRequire(import.meta.url);
const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { DOTJS_OPTIONS } = require('./dev-env/constants.js');
const doT = require('dot');

/** Vite plugin: compile .dot files with doT, stub .css/.scss and media */
function vitestAssetPlugin() {
  return {
    name: 'vitest-assets',
    transform(raw: string, id: string) {
      if (id.endsWith('.dot')) {
        const settings = { ...doT.templateSettings, ...DOTJS_OPTIONS };
        const fn = doT.template(raw, settings);
        return { code: `export default ${fn.toString()}`, map: null };
      }
      if (/\.(css|scss)$/.test(id)) {
        return { code: 'export default {}', map: null };
      }
      if (/\.(png|svg|jpg|jpeg|gif|wav|mp3)$/.test(id)) {
        const basename = path.basename(id);
        return {
          code: `export default ${JSON.stringify(basename)}`,
          map: null,
        };
      }
      return null;
    },
  };
}

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['dev-env/vitest-setup.ts'],
    include: ['src/**/*.spec.ts'],
    exclude: ['node_modules', 'dist', 'e2e', '**/stories/**'],
    testTimeout: 30000,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  plugins: [vitestAssetPlugin()],
});
