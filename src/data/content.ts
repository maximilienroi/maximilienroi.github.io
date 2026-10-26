// Shared queries over the Notion-synced collections, used by every page.
import { getCollection, type CollectionEntry } from 'astro:content';
import site from '../content/site/en.json';

const lang = 'en';
const inLang = (id: string) => id.startsWith(`${lang}/`);

export async function getEntries() {
  return (await getCollection('entries', (e) => inLang(e.id) && !e.data.draft)).sort(
    (a, b) => a.data.order - b.data.order || b.data.sortDate.valueOf() - a.data.sortDate.valueOf(),
  );
}

// The society log reads like a story: oldest first, Notion's Order breaks ties.
export async function getLog() {
  return (await getCollection('log', (e) => inLang(e.id) && !e.data.draft)).sort(
    (a, b) => a.data.order - b.data.order || a.data.date.valueOf() - b.data.date.valueOf(),
  );
}

type Group = { title: string; items: string[] };
type Entry = CollectionEntry<'entries'>;

// Optional sub-categories per section, set in en.json ("groups").
// An entry not listed falls into the last group, so new Notion rows always show.
export function grouped(entries: Entry[], key: string) {
  const items = entries.filter((e) => e.data.section === key);
  const groups: Group[] = (site.sections as Record<string, { groups?: Group[] }>)[key]?.groups ?? [];
  if (!groups.length) return [{ title: '', items }];
  const listed = new Set(groups.flatMap((g) => g.items));
  return groups
    .map((g, i) => ({
      title: g.title,
      items: items
        .filter((e) => (i === groups.length - 1 && !listed.has(e.data.title)) || g.items.includes(e.data.title))
        .sort((a, b) => {
          const ia = g.items.indexOf(a.data.title);
          const ib = g.items.indexOf(b.data.title);
          return (ia < 0 ? 999 : ia) - (ib < 0 ? 999 : ib);
        }),
    }))
    .filter((g) => g.items.length > 0);
}

// Entries picked by title, in the order given; titles missing from Notion are skipped.
// Any entry of the given sections not listed is added at the end, so new rows still show.
export function pick(entries: Entry[], titles: string[], sections: string[]) {
  const chosen = titles.map((t) => entries.find((e) => e.data.title === t)).filter(Boolean) as Entry[];
  const rest = entries.filter((e) => sections.includes(e.data.section) && !titles.includes(e.data.title));
  return [...chosen, ...rest];
}
