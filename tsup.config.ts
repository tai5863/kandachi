import { defineConfig } from 'tsup';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    dts: true,
    clean: true,
    minify: true,
    treeshake: true,
  },
  {
    entry: { webcomponent: 'src/webcomponents/kandachi-ja.ts' },
    format: ['esm'],
    dts: true,
    minify: true,
    treeshake: true,
  },
  {
    entry: { cli: 'src/cli.ts' },
    format: ['esm'],
    banner: { js: '#!/usr/bin/env node' },
    minify: true,
  },
]);
