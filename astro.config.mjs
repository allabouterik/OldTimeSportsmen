// @ts-check
import { defineConfig } from 'astro/config';
import netlify from '@astrojs/netlify';
import vue from '@astrojs/vue';
import tailwindcss from '@tailwindcss/vite';

// https://astro.build/config
export default defineConfig({
  integrations: [vue()],
  server: { port: 8080 },

  vite: {
    plugins: [tailwindcss()],
  },

  adapter: netlify(),
});
