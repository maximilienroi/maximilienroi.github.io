// Pulls the "Portfolio — site" database from Notion into src/content/.
//
// Only rows with "Publish" ticked are used. Words are copied exactly as
// written in Notion. Photos are downloaded into src/assets/notion/ (Astro
// then optimises them); videos and audio go to public/media/notion/.
//
// Run locally:  NOTION_TOKEN=secret_xxx npm run sync
// On GitHub it runs every hour, before each build (see .github/workflows).

import { Client, collectPaginatedAPI } from '@notionhq/client';
import { mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

const DATA_SOURCE_ID = process.env.NOTION_DATA_SOURCE_ID || '767ff203-cdf9-4b00-b134-1b52bb92444a';
const LANG = 'en';

const root = path.resolve(import.meta.dirname, '..');
const dirs = {
  entries: path.join(root, 'src/content/entries', LANG),
  log: path.join(root, 'src/content/log', LANG),
  images: path.join(root, 'src/assets/notion'),
  media: path.join(root, 'public/media/notion'),
};

const SECTIONS = {
  Production: 'production',
  'Piano & teaching': 'piano',
  'Social media': 'social',
  Also: 'also',
  Education: 'education',
  'Music Society log': 'log',
};

// For testing without Notion: NOTION_FIXTURE=path/to/pages.json npm run sync
const fixture = process.env.NOTION_FIXTURE;

if (!process.env.NOTION_TOKEN && !fixture) {
  console.log('NOTION_TOKEN is not set: skipping the Notion sync, the site uses the files already in the repository.');
  process.exit(0);
}


// ---------- helpers ----------

const props = (page) => page.properties;
const plain = (rich = []) => rich.map((t) => t.plain_text).join('').trim();

// Notion rich text to Markdown, keeping italics, bold and links.
function markdown(rich = []) {
  return rich
    .map((t) => {
      let s = t.plain_text;
      if (!s) return '';
      const a = t.annotations ?? {};
      const [lead, core, trail] = s.match(/^(\s*)([\s\S]*?)(\s*)$/).slice(1);
      s = core;
      if (s && a.code) s = `\`${s}\``;
      if (s && a.bold) s = `**${s}**`;
      if (s && a.italic) s = `*${s}*`;
      if (s && t.href) s = `[${s}](${t.href})`;
      return lead + s + trail;
    })
    .join('')
    .trim();
}

// "Links" column: each piece of text that has a link becomes one link.
function links(rich = []) {
  const out = [];
  for (const t of rich) {
    if (!t.href) continue;
    const label = t.plain_text.trim();
    const last = out.at(-1);
    // Notion can split one linked word into several pieces.
    if (last && last.url === t.href) last.label = `${last.label}${t.plain_text}`.trim();
    else if (label) out.push({ label, url: t.href });
  }
  return out;
}

const slugify = (s) =>
  s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ø/gi, 'o')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 48)
    .replace(/^-+|-+$/g, '') || 'entry';

const yaml = (value) => JSON.stringify(value); // JSON strings are valid YAML.

function frontmatter(fields) {
  const lines = ['---'];
  for (const [key, value] of Object.entries(fields)) {
    if (value === undefined || value === null || value === '' || (Array.isArray(value) && !value.length)) continue;
    if (Array.isArray(value)) {
      lines.push(`${key}:`);
      for (const item of value) lines.push(`  - { label: ${yaml(item.label)}, url: ${yaml(item.url)} }`);
    } else if (typeof value === 'boolean' || typeof value === 'number') {
      lines.push(`${key}: ${value}`);
    } else {
      lines.push(`${key}: ${yaml(value)}`);
    }
  }
  lines.push('---');
  return lines.join('\n');
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const monthYear = (iso) => `${MONTHS[Number(iso.slice(5, 7)) - 1]} ${iso.slice(0, 4)}`;

const EXT = { 'image/jpeg': '.jpg', 'image/png': '.png', 'image/webp': '.webp', 'image/avif': '.avif', 'video/mp4': '.mp4', 'video/webm': '.webm', 'audio/mpeg': '.mp3', 'audio/mp4': '.m4a', 'audio/wav': '.wav' };

const kept = new Set();

// Downloads the first file of a Files column. Writes only if it changed.
async function download(fileProp, dir, baseName) {
  const f = fileProp?.files?.[0];
  if (!f) return null;
  const url = f.type === 'external' ? f.external.url : f.file.url;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Could not download ${f.name}: HTTP ${res.status}`);
  const type = (res.headers.get('content-type') || '').split(';')[0];
  const ext = EXT[type] || path.extname(new URL(url).pathname).toLowerCase() || '.bin';
  const buf = Buffer.from(await res.arrayBuffer());
  const file = path.join(dir, baseName + ext);
  const old = existsSync(file) ? await readFile(file) : null;
  if (!old || !old.equals(buf)) await writeFile(file, buf);
  kept.add(file);
  return file;
}

const relFrom = (fromDir, file) => path.relative(fromDir, file).split(path.sep).join('/');

// ---------- main ----------

const pages = fixture
  ? JSON.parse(await readFile(fixture, 'utf8')).filter((pg) => pg.properties.Publish?.checkbox)
  : await collectPaginatedAPI(new Client({ auth: process.env.NOTION_TOKEN }).dataSources.query, {
      data_source_id: DATA_SOURCE_ID,
      filter: { property: 'Publish', checkbox: { equals: true } },
    });

if (pages.length === 0) {
  // Safety net: never wipe the live site because of a sharing or token problem.
  console.error('No published rows found in Notion. Nothing was changed.');
  console.error('Check that the database is shared with the integration and that some rows have Publish ticked.');
  process.exit(1);
}

for (const d of Object.values(dirs)) await mkdir(d, { recursive: true });

const written = new Set();
const problems = [];

for (const page of pages) {
  const p = props(page);
  const title = plain(p.Title?.title);
  const section = SECTIONS[p.Section?.select?.name];
  const date = p.Date?.date?.start?.slice(0, 10);
  const id8 = page.id.replace(/-/g, '').slice(0, 8);

  if (!title || !section || !date) {
    problems.push(`"${title || '(no title)'}": needs a Title, a Section and a Date.`);
    continue;
  }

  const name = `${slugify(title)}-${id8}`;
  const photo = await download(p.Photo, dirs.images, `${name}-photo`);
  const photoAlt = plain(p['Photo description']?.rich_text);
  if (photo && !photoAlt) problems.push(`"${title}": the photo has no description (it is still published).`);

  if (section === 'log') {
    const file = path.join(dirs.log, `${date}-${name}.md`);
    const fm = frontmatter({
      title,
      order: typeof p.Order?.number === 'number' ? p.Order.number : undefined,
      date,
      dateLabel: plain(p['Dates shown']?.rich_text),
      image: photo && relFrom(dirs.log, photo),
      imageAlt: photo ? photoAlt : undefined,
    });
    // The Text column is the row's story; older rows only had a title.
    const body = markdown(p.Text?.rich_text) || markdown(p.Title.title);
    await writeFile(file, `${fm}\n${body}\n`);
    written.add(file);
    continue;
  }

  const video = await download(p.Video, dirs.media, `${name}-video`);
  const audio = await download(p.Audio, dirs.media, `${name}-audio`);
  const file = path.join(dirs.entries, `${name}.md`);
  const fm = frontmatter({
    section,
    title,
    where: plain(p.Where?.rich_text),
    dates: plain(p['Dates shown']?.rich_text) || monthYear(date),
    sortDate: date,
    order: typeof p.Order?.number === 'number' ? p.Order.number : undefined,
    university: p['University project']?.checkbox || undefined,
    image: photo && relFrom(dirs.entries, photo),
    imageAlt: photo ? photoAlt : undefined,
    video: video && relFrom(path.join(root, 'public'), video),
    audio: audio && relFrom(path.join(root, 'public'), audio),
    spotifyEmbed: p['Spotify player']?.url || undefined,
    links: links(p.Links?.rich_text),
  });
  const body = markdown(p.Text?.rich_text);
  await writeFile(file, `${fm}\n${body}${body ? '\n' : ''}`);
  written.add(file);
}

// Remove what is no longer published in Notion.
let removed = 0;
for (const [dir, keep] of [
  [dirs.entries, written],
  [dirs.log, written],
  [dirs.images, kept],
  [dirs.media, kept],
]) {
  for (const f of await readdir(dir)) {
    const full = path.join(dir, f);
    if (f.startsWith('.') || keep.has(full)) continue;
    await rm(full);
    removed++;
  }
}

console.log(`Synced ${written.size} published rows from Notion (${removed} old files removed).`);
if (problems.length) {
  console.log('\nTo check in Notion:');
  for (const p of problems) console.log(`  - ${p}`);
}
