// Anchor for an entry, so the skill pages can link to its full text on /projects/.
// Titles made only of symbols (like "??¿") get a fallback built from their characters.
export const slug = (title: string) => {
  const s = title
    .normalize('NFKD')
    .replace(/[^\w\s-]/g, '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-');
  return s || `project-${[...title].map((c) => c.codePointAt(0)!.toString(36)).join('')}`;
};
