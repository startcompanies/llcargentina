import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://www.llcargentina.com',
  output: 'server',
  adapter: vercel(),
  trailingSlash: 'never',
  integrations: [sitemap({
    filter: (page) => page !== 'https://www.llcargentina.com/call/calendario',
  })],
  compressHTML: true,
});
