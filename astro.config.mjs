import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { siteOrigin } from './site-origin.mjs';

// User site (PrasadGanesh.github.io): pages are served from "/".
// SITE overrides the origin for a one-off build. See docs/DEPLOY.md.
const site = (process.env.SITE ?? siteOrigin ?? 'https://prasadganesh.github.io').replace(/\/$/, '');

export default defineConfig({
  site,
  trailingSlash: 'always',
  integrations: [sitemap()],
  build: {
    format: 'directory',
    inlineStylesheets: 'always',
  },
  compressHTML: true,
});
