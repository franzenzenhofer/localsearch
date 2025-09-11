import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts', 'src/**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        project: './tsconfig.json',
      },
      globals: {
        console: 'readonly',
        document: 'readonly',
        window: 'readonly',
        localStorage: 'readonly',
        alert: 'readonly',
        crypto: 'readonly',
        File: 'readonly',
        HTMLInputElement: 'readonly',
        HTMLElement: 'readonly',
        DOMParser: 'readonly',
        TextDecoder: 'readonly',
        BufferSource: 'readonly',
        Blob: 'readonly',
        WritableStream: 'readonly',
        FileSystemHandle: 'readonly',
        FileSystemDirectoryHandle: 'readonly',
        FileSystemFileHandle: 'readonly',
        FileSystemWritableFileStream: 'readonly',
        performance: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
    },
    rules: {
      'max-lines': ['error', { max: 75, skipBlankLines: true, skipComments: true }],
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unused-vars': 'off',
      'prefer-const': 'error',
      'no-var': 'error',
      'max-lines-per-function': 'warn',
      'max-statements': 'warn',
      'max-depth': 'warn',
      'max-params': 'warn',
      'complexity': 'warn',
      'max-nested-callbacks': 'warn',
    },
  },
  {
    files: ['extensions/**/*.js', '*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        document: 'readonly',
        window: 'readonly',
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
      },
    },
    rules: {
      'max-lines': 'off',
      'max-lines-per-function': 'off',
      'max-statements': 'off',
    },
  },
  {
    files: ['**/*.d.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
    },
  },
  {
    ignores: ['dist/**', 'node_modules/**', 'coverage/**', '.wrangler/**', 'tests/**', '*.config.*', 'cli.ts', 'build-extensions.js', 'extensions/shared/extension-core.ts', 'src/main.tsx'],
  },
];