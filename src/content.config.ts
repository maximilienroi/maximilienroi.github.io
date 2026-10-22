import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Every file lives in a language folder (en/, later fr/), so a French
// version can be added without touching this file.

const link = z.object({ label: z.string(), url: z.string().url() });

// One file per project, job or experience.
const entries = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/entries' }),
  schema: ({ image }) =>
    z.object({
      section: z.enum(['production', 'piano', 'social', 'also', 'education']),
      title: z.string(),
      where: z.string().optional(),
      // Shown as written, e.g. "Mar 2025 – now".
      dates: z.coerce.string(),
      // Used for ordering (newest first). YYYY-MM or YYYY-MM-DD.
      sortDate: z.coerce.date(),
      // Optional: lower numbers come first within a section.
      order: z.number().default(100),
      university: z.boolean().default(false),
      image: image().optional(),
      imageAlt: z.string().optional(),
      video: z.string().optional(),
      videoPoster: image().optional(),
      audio: z.string().optional(),
      spotifyEmbed: z.string().url().optional(),
      links: z.array(link).default([]),
      draft: z.boolean().default(false),
    }),
});

// Music Society log: one file per thing done.
const log = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/log' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().optional(),
      order: z.number().default(100),
      date: z.coerce.date(),
      // Optional wording for the date, e.g. "Mid-Oct 2026".
      dateLabel: z.string().optional(),
      image: image().optional(),
      imageAlt: z.string().optional(),
      link: link.optional(),
      draft: z.boolean().default(false),
    }),
});

export const collections = { entries, log };
