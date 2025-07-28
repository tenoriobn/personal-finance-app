import { defineConfig } from 'cypress';

export default defineConfig({
  component: {
    devServer: {
      framework: 'vue',
      bundler: 'vite',
    },
  },
  e2e: {
    supportFile: 'cypress/support/e2e.ts',
    baseUrl: 'http://localhost:3000',
  },
});
