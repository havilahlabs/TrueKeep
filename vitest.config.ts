import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  resolve: {
    alias: {
      'react-native': path.resolve(__dirname, 'tests/__mocks__/react-native.ts'),
      'react-native-iap': path.resolve(__dirname, 'tests/__mocks__/react-native-iap.ts'),
    },
  },
  test: {
    include: ['tests/**/*.test.ts'],
  },
});
