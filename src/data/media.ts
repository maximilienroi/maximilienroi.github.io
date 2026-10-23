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
const stealPoster = img('steal-these-chords-17-poster.jpg');
const nardisPoster = img('nardis-poster.jpg');
const perdu1Poster = img('perdu-animation-1-poster.jpg');
const perdu2Poster = img('perdu-animation-2-poster.jpg');
const fltCover = img('felt-like-home-cover.jpg');
const btfCover = img('behind-the-fence-cover-v1.jpg');
const mamanCover = img('maman-je-saigne-cover.jpg');
const chezLui = img('chez-lui.jpg');
const brainGraph = img('external-brain-graph.jpg');

export type Media =
  | { kind: 'image'; image: ImageMetadata | undefined; alt: string; caption?: string }
  | { kind: 'video'; src: string; poster?: ImageMetadata; alt: string; caption?: string; silent?: boolean };
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
      caption: 'MAXRØ',
    },
  ],
  piano: [
    {
      kind: 'image',
      image: atThePiano,
      alt: 'Maximilien playing a grand piano in a studio',
    },
    {
      kind: 'video',
      src: 'media/piano-video.mp4',
      poster: pianoVideoPoster,
      alt: 'Maximilien playing a grand piano, filmed from the side',
      caption: 'Patterns in C minor.',
    },
  ],
  social: [
    {
      kind: 'video',
      src: 'media/steal-these-chords-17.mp4',
      poster: stealPoster,
      alt: 'A Steal These Chords video: chords shown as falling notes above a keyboard, with hands playing',
      caption: 'Steal These Chords, part 17.',
    },
    {
      kind: 'video',
      src: 'media/nardis.mp4',
      poster: nardisPoster,
      alt: 'Maximilien playing Nardis on a grand piano for a video series on famous pieces',
      caption: 'Famous pieces, part 3: Nardis.',
    },
  ],
  society: [
    {
      kind: 'video',
      src: 'media/session-band.mp4',
      poster: sessionBandPoster,
      alt: 'A band performing on stage at The Session, with Maximilien on keys',
      caption: 'Live at The Session, with me on keys.',
    },
    {
      kind: 'video',
      src: 'media/session-poison.mp4',
      poster: sessionPoisonPoster,
      alt: 'Poison performed on stage at The Session, with Maximilien on keys, a singer and a drummer',
      caption: 'Poison, live at The Session, with me on keys.',
    },
  ],
  also: [],
  education: [],
};

// Shown next to a single entry or log row, matched by title.
const entryMediaAll: Record<string, Media[]> = {
  'MAXRØ': [
    {
      kind: 'image',
      image: mamanCover,
      alt: 'Cover of Maman, je saigne: a painting in red, grey and black',
      caption: 'Cover of Maman, je saigne.',
    },
  ],
  'Behind the fence': [
    {
      kind: 'image',
      image: btfCover,
      alt: 'First version of the Behind the fence cover: a colourful painting of plants in red, green and yellow',
      caption: 'First version of the cover.',
    },
  ],
  perdu: [
    {
      kind: 'video',
      src: 'media/perdu-animation-1.mp4',
      poster: perdu1Poster,
      alt: 'Frame-by-frame animation of MAXRØ, a head with a black cross over the face',
      silent: true,
    },
    {
      kind: 'video',
      src: 'media/perdu-animation-2.mp4',
      poster: perdu2Poster,
      alt: 'Frame-by-frame animation of a hooded face drawn in black ink',
      caption: 'Animations drawn frame by frame in Procreate, for perdu and the MAXRØ identity.',
      silent: true,
    },
  ],
  'Felt Like Home EP': [
    {
      kind: 'image',
      image: fltCover,
      alt: 'Felt Like Home cover: childhood photos of the members around a crayon drawing of a house',
    },
  ],
  'My external brain': [
    {
      kind: 'image',
      image: brainGraph,
      alt: "My external brain shown as a graph in Obsidian, with people's names blurred",
      caption: 'The graph view in Obsidian.',
    },
  ],
  'Runner and waiter': [
    {
      kind: 'image',
      image: chezLui,
      alt: 'The front of Chez Lui in Notting Hill, with red chairs under a white awning',
    },
  ],
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
    },
  ],
};

// Videos need their poster in the repo too; anything missing is left out.
const present = (list: Media[] = []) => list.filter((m) => (m.kind === 'image' ? Boolean(m.image) : Boolean(m.poster)));

export const railMedia: Record<string, Media[]> = Object.fromEntries(
  Object.entries(railMediaAll).map(([k, v]) => [k, present(v)]),
);
export const mediaFor = (title: string) => present(entryMediaAll[title.trim()]);
