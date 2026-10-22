// Photos and videos that live in the repository, not in Notion.
// Entries and log rows are matched by their title, so the hourly Notion
// sync can rewrite the text without losing the pictures.
import type { ImageMetadata } from 'astro';

// Images are looked up by file name, so a missing file is skipped instead of
// breaking the build.
const images = import.meta.glob<{ default: ImageMetadata }>('../assets/media/*.{jpg,jpeg,png,webp}', {
  eager: true,
});
const img = (name: string) => images[`../assets/media/${name}`]?.default;

const mask = img('maxro-mask.jpg');
const drawing = img('maxro-drawing.jpg');
const atThePiano = img('max-at-the-piano.jpg');
const childStage = img('max-piano-child-stage.jpg');
const childShowroom = img('max-piano-child-showroom.jpg');
const directory = img('musician-directory-blurred.jpg');
const sessionBandPoster = img('session-band-poster.jpg');
const sessionPoisonPoster = img('session-poison-poster.jpg');
const pianoVideoPoster = img('piano-video-poster.jpg');

export type Media =
  | { kind: 'image'; image: ImageMetadata | undefined; alt: string; caption?: string }
  | { kind: 'video'; src: string; poster?: ImageMetadata; alt: string; caption?: string };
// (A video is shown only when its poster image is in the repo, which is
// uploaded together with the video file.)

export const heroPhoto: { image: ImageMetadata | undefined; alt: string } = {
  image: mask,
  alt: 'Maximilien Roi as MAXRØ, wearing his mask, in front of a painted wall',
};

// Shown under each section's title, in the left column.
const railMediaAll: Record<string, Media[]> = {
  production: [
    {
      kind: 'image',
      image: drawing,
      alt: 'The MAXRØ drawing: a head crossed out with a black X, drawn in ink',
      caption: 'The MAXRØ artwork.',
    },
  ],
  piano: [
    {
      kind: 'image',
      image: atThePiano,
      alt: 'Maximilien playing a grand piano in a studio',
    },
  ],
  social: [
    {
      kind: 'video',
      src: 'media/piano-video.mp4',
      poster: pianoVideoPoster,
      alt: 'Maximilien playing a grand piano, filmed from the side',
      caption: 'From one of my piano videos.',
    },
  ],
  society: [
    {
      kind: 'video',
      src: 'media/session-band.mp4',
      poster: sessionBandPoster,
      alt: 'A band performing on stage at The Session',
      caption: 'Live at The Session.',
    },
    {
      kind: 'video',
      src: 'media/session-poison.mp4',
      poster: sessionPoisonPoster,
      alt: 'A singer, a keyboard player and a drummer performing Poison on stage at The Session',
      caption: 'Poison, live at The Session.',
    },
  ],
  also: [],
  education: [],
};

// Shown next to a single entry or log row, matched by title.
const entryMediaAll: Record<string, Media[]> = {
  'Playing the piano': [
    {
      kind: 'image',
      image: childStage,
      alt: 'Maximilien as a child, playing a grand piano on a concert stage',
    },
    {
      kind: 'image',
      image: childShowroom,
      alt: 'Maximilien as a child, playing a grand piano in a piano showroom',
    },
  ],
  'The Musician Directory': [
    {
      kind: 'image',
      image: directory,
      alt: "The Musician Directory search page, with members' details blurred",
      caption: "Members' details are blurred.",
    },
  ],
};

// Videos need their poster in the repo too; anything missing is left out.
const present = (list: Media[] = []) => list.filter((m) => (m.kind === 'image' ? Boolean(m.image) : Boolean(m.poster)));

export const railMedia: Record<string, Media[]> = Object.fromEntries(
  Object.entries(railMediaAll).map(([k, v]) => [k, present(v)]),
);
export const mediaFor = (title: string) => present(entryMediaAll[title.trim()]);
