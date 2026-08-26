import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://www.llcargentina.com',
  output: 'static',
  trailingSlash: 'never',
  integrations: [sitemap({
    filter: (page) => page !== 'https://www.llcargentina.com/call/calendario',
  })],
  compressHTML: true,
});
