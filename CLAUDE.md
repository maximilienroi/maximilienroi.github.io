# Notes for Claude

Portfolio site for Maximilien Roi (artist name MAXRØ, always uppercase with Ø). Astro static site, GitHub Pages.

## Updating content
- Source of truth is the Notion database "Portfolio — site" (data source `collection://767ff203-cdf9-4b00-b134-1b52bb92444a`, inside "Cerveau externe — Maximilien"). Add/edit rows there and tick Publish; the hourly workflow syncs into `src/content/` and republishes. Files in `src/content/entries/en/` and `src/content/log/en/` are overwritten by the sync.
- `src/content/site/en.json` (hero sentence, contact, section titles) is edited in the repo, not Notion.
- Photos: Notion "Photo" column, or `src/assets/media/` + `image:`/`imageAlt:` frontmatter. Video/audio: `public/media/`.

## Writing rules (from Maximilien)
- Never invent facts. Ask, or leave it out.
- Modest, short, natural sentences; numbers small and inside a sentence. Label university work "(university project)".
- English only on the site for now.
- Never use "thekingchamallow" in anything public; only "Maximilien Roi" and maximilienroi@icloud.com.

## Design rules
- Banned: identical rounded cards with shadows, all-caps tracked eyebrow labels, monospace labels, "A · B · C" meta strings, arrows on links, 01/02/03 numbering, one coloured word in a headline, big stat tiles, gradient blobs, emoji icons, stock copy.
- An entry without media must show no empty box.
- Motion only in response to the visitor, plus the single hero arrival. Respect prefers-reduced-motion.

## Checks before pushing
`npm run build`, then `npx astro preview` and `node scripts/screenshots.mjs` (set CHROMIUM_PATH if needed), `npx impeccable detect http://localhost:4321/`.
