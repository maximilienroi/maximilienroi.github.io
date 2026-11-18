// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import autolink from './integrations/autolink.mjs';

// SITE and BASE are set by the GitHub Pages workflow (from the repository
// settings), so the site works whatever the repository or domain is called.
// For a custom domain such as maxro.co.uk, BASE becomes "/".
const site = process.env.SITE || 'http://localhost:4321';
const base = process.env.BASE || '/';

export default defineConfig({
  site,
  base,
  trailingSlash: 'always',
  integrations: [sitemap(), autolink()],
  build: { inlineStylesheets: 'always' },
  image: { layout: 'constrained', responsiveStyles: true },
});
