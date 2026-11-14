// @ts-check

import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import icon from 'astro-icon';

// TODO: reemplazar por el dominio real de la empresa
const SITE_URL = 'https://example.com';

export default defineConfig({
  site: SITE_URL,
  output: 'static',
  integrations: [react(), sitemap(), icon()],
  vite: {
    plugins: [tailwindcss()],
  },
  prefetch: true,
});
