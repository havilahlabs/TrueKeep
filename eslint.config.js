const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  ...expoConfig,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './tsconfig.json'
      }
    },
    rules: {
      '@typescript-eslint/consistent-type-definitions': ['error', 'type']
    }
  },
  {
    // Node.js CJS scripts and Expo config plugins run in Node, not the RN bundle
    files: ['scripts/**/*.js', 'plugins/**/*.js'],
    languageOptions: {
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        Buffer: 'readonly',
        process: 'readonly',
        console: 'readonly'
      }
    }
  }
]);
