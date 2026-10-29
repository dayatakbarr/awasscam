import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';

export default defineConfig({
  site: 'https://awasscam.id',
  output: 'server',
  adapter: vercel({
    webAnalytics: {
      enabled: true,
    },
    runtime: 'nodejs20.x',
  }),
  build: {
    inlineStylesheets: 'auto',
  },
  vite: {
    build: {
      minify: 'terser',
      cssMinify: true,
    },
  },
});