import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
      include: ['src/**/*.ts'],
      exclude: ['src/cli.ts'],
      thresholds: {
        statements: 95,
        branches: 90,
      },
    },
  },
});
