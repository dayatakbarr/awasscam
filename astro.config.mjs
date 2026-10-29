import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://awasscam.id',
  output: 'static',
  adapter: undefined,
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