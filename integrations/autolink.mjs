// Post-build: turns social handles and platform names that appear as plain
// text (often from Notion content) into links, so every mention is clickable.
// Text already inside a link, a heading's own link, a button, script or style is left alone.
import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import site from '../src/content/site/en.json' with { type: 'json' };

const social = Object.fromEntries(site.socials.map((s) => [s.label, s.url]));

function rules(base) {
  return [
    [/@maxro_piano\b/g, `${base}links/`],
    [/@uow_musicsociety\b/g, 'https://www.instagram.com/uow_musicsociety/'],
    [/@felt_like_h0me\b/g, 'https://www.instagram.com/felt_like_h0me/'],
    // Platform names, except "Instagram API" and "its Instagram account" (the society's).
    [/\bSoundCloud\b/g, social.SoundCloud],
    [/\bSpotify\b(?! API)/g, social.Spotify],
    [/\bTikTok\b(?! API| Studio| Shop)/g, social.TikTok],
    [/\bYouTube\b(?! API| Studio)/g, social.YouTube],
    [/\bFacebook\b(?! API| Page token)/g, social.Facebook],
    [/(?<!its )\bInstagram\b(?! API| account)/g, social.Instagram],
  ].filter(([, url]) => url);
}

const SKIP = new Set(['a', 'script', 'style', 'title', 'head', 'button', 'textarea', 'svg', 'dt']);

function linkify(html, base) {
  const parts = html.split(/(<[^>]+>)/);
  const stack = [];
  const R = rules(base);
  for (let i = 0; i < parts.length; i++) {
    const p = parts[i];
    if (p.startsWith('<')) {
      const m = p.match(/^<\/?\s*([a-zA-Z0-9-]+)/);
      if (!m) continue;
      const tag = m[1].toLowerCase();
      if (p.startsWith('</')) {
        const idx = stack.lastIndexOf(tag);
        if (idx >= 0) stack.splice(idx);
      } else if (!p.endsWith('/>') && SKIP.has(tag)) {
        stack.push(tag);
      }
      continue;
    }
    if (stack.length || !p.trim()) continue;
    let text = p;
    // Platform names only point to Max's own accounts when the sentence is about them
    // (e.g. not "the podcast's TikTok and Instagram").
    const own = /maxro_piano|TikTok, Instagram, YouTube and Facebook/.test(p);
    for (const [re, url] of R) {
      if (!own && /TikTok|YouTube|Facebook|Instagram/.test(re.source) && !re.source.startsWith('@')) continue;
      text = text.replace(re, (m) => `\u0000${url}\u0001${m}\u0002`);
    }
    // Avoid nested replacements, then turn markers into anchors.
    parts[i] = text.replace(/\u0000([^\u0001]*)\u0001([^\u0002]*)\u0002/g, (_, url, label) => {
      const ext = url.startsWith('http');
      return `<a class="autolink" href="${url}"${ext ? ' rel="noopener"' : ''}>${label}</a>`;
    });
  }
  return parts.join('');
}

async function walk(dir) {
  const out = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...(await walk(p)));
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

export default function autolink() {
  let base = '/';
  return {
    name: 'autolink',
    hooks: {
      'astro:config:done': ({ config }) => {
        base = config.base.replace(/\/?$/, '/');
      },
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        for (const f of await walk(root)) {
          if (f.endsWith(join('links', 'index.html'))) continue;
          const html = await readFile(f, 'utf8');
          const body = html.indexOf('<body');
          if (body < 0) continue;
          const out = html.slice(0, body) + linkify(html.slice(body), base);
          if (out !== html) await writeFile(f, out);
        }
      },
    },
  };
}
