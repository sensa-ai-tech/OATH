import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@oath/shared': path.resolve(__dirname, '../shared/src'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
  },
});
