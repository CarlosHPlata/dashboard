// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';

import vercel from '@astrojs/vercel';

import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  output: 'static',

  build: {
    format: 'file'
  },

  vite: {
    plugins: [tailwindcss()]
  },

  adapter: vercel(),
  integrations: [react()]
});