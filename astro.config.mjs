// @ts-check
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://unscripted-ui.example',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
