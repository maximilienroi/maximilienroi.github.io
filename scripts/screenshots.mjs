// Full-page screenshots for review: desktop 1440 and mobile 390, light and dark.
// Run `npm run build && npx astro preview` first, then: node scripts/screenshots.mjs
import { chromium } from '@playwright/test';
import { mkdirSync } from 'node:fs';

const url = process.env.URL || 'http://localhost:4321/';
mkdirSync('screenshots', { recursive: true });
const browser = await chromium.launch({ executablePath: process.env.CHROMIUM_PATH || undefined });
for (const [name, width, height] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  for (const scheme of ['light', 'dark']) {
    const page = await browser.newPage({ viewport: { width, height }, colorScheme: scheme, deviceScaleFactor: name === 'mobile' ? 2 : 1 });
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1600);
    await page.screenshot({ path: `screenshots/${name}-${scheme}.png`, fullPage: true });
    await page.screenshot({ path: `screenshots/${name}-${scheme}-fold.png` });
    await page.close();
  }
}
await browser.close();
console.log('Saved to screenshots/');
