import svgLoader from 'vite-svg-loader';
import { resolve } from 'pathe';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss'],
  devtools: { enabled: true },
  alias: {
    '@': resolve(__dirname),
  },
  compatibilityDate: '2025-07-15',
  vite: {
    plugins: [svgLoader()],
  },
  eslint: {
    config: {
      stylistic: true,
    },
  },
});
