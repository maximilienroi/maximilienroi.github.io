// Regenerates public/og.png and the PNG icons from the HTML/SVG sources.
// Run: node scripts/brand/make-images.mjs
import { chromium } from '@playwright/test';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = (p) => fileURLToPath(new URL(p, import.meta.url));
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
await page.goto('file://' + here('./og.html'));
await page.evaluate(() => document.fonts.ready);
await page.screenshot({ path: here('../../public/og.png') });
await browser.close();

const svg = here('../../public/favicon.svg');
await sharp(svg, { density: 600 }).resize(180, 180).png().toFile(here('../../public/apple-touch-icon.png'));
await sharp(svg, { density: 300 }).resize(32, 32).png().toFile(here('../../public/favicon-32.png'));
console.log('Images written to public/');
