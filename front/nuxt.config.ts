import svgLoader from 'vite-svg-loader';
import { resolve } from 'pathe';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: ['@nuxt/eslint', '@nuxtjs/tailwindcss', 'motion-v/nuxt', '@nuxt/test-utils/module'],
  plugins: ['~/plugins/vcalendar.ts'],
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
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
