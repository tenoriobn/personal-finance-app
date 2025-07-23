// @ts-check
import withNuxt from './.nuxt/eslint.config.mjs';

export default withNuxt(
  {
    files: ['**/*.mjs', '**/*.js', '**/*.ts', '**/*.vue'],
    rules: {
      'no-console': 'warn',
      'no-debugger': 'warn',
      'prefer-const': 'error',
      'eqeqeq': ['error', 'always'],
      'no-var': 'error',
      'curly': ['error', 'all'],

      // === Stylistic Rules ===
      '@stylistic/semi': ['error', 'always'],
      '@stylistic/quotes': ['error', 'single'],
      '@stylistic/indent': ['error', 2],
      '@stylistic/comma-dangle': ['error', 'always-multiline'],
      '@stylistic/object-curly-spacing': ['error', 'always'],
      '@stylistic/array-bracket-spacing': ['error', 'never'],
      '@stylistic/space-before-blocks': ['error', 'always'],
      '@stylistic/no-trailing-spaces': 'error',
      '@stylistic/eol-last': ['error', 'always'],

      // === Vue Specific Rules ===
      'vue/html-indent': ['error', 2],
      'vue/multi-word-component-names': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/no-mutating-props': 'error',
      'vue/no-unused-components': 'warn',
      'vue/require-default-prop': 'off',
    },
  },
);
