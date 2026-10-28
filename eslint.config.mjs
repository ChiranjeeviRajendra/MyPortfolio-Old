import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from 'angular-eslint';

export default tseslint.config(
  { ignores: ['node_modules/**', 'tmp/**', 'dist/**', 'out-tsc/**', '.angular/**', 'coverage/**', 'playwright-report/**', 'test-results/**'] },
  {
    files: ['**/*.ts'],
    extends: [eslint.configs.recommended, ...tseslint.configs.recommended, ...angular.configs.tsRecommended],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/component-class-suffix': ['error', { suffixes: ['Component'] }]
    }
  },
  {
    files: ['**/*.html'],
    extends: [...angular.configs.templateRecommended]
  }
);
