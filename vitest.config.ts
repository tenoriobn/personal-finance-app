import { defineConfig } from 'vitest/config';
import { defineVitestProject } from '@nuxt/test-utils/config';

export default defineConfig({
  test: {
    projects: [
      await defineVitestProject({
        test: {
          name: 'nuxt',
          include: [
            'test/{e2e,unit}/*.{test,spec}.ts',
            'app/**/*.spec.ts',
            'app/**/*.test.ts',
          ],
          environment: 'nuxt',
          globals: true,
        },
      }),
    ],
  },
});
