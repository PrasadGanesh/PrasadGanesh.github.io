import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Static build. GitHub Pages should publish the `dist/` directory as the site root.
// Deploy is intentionally not wired here.
export default defineConfig({
  site: 'https://ganeshprasad.com',
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  compressHTML: true,
});
