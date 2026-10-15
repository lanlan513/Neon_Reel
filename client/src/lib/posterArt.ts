/**
 * Deterministic poster artwork.
 *
 * Each film gets a hand-composed but code-generated artwork: a seeded Hong Kong
 * skyline, a neon disc, a genre-specific motif and the film's own typography, all
 * tinted by the accent colour carried in the seed data.
 *
 * Everything here is pure and seeded from the movie id, so a given film always renders
 * the same poster — no network call, no randomness at runtime, no missing images.
 */

/** FNV-1a — small, fast, and stable across runs (unlike `Math.random`). */
export function hashString(input: string): number {
  let hash = 2166136261;
  for (let index = 0; index < input.length; index += 1) {
    hash ^= input.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

/** Mulberry32 seeded PRNG, so skyline silhouettes are reproducible. */
export function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export interface Building {
  x: number;
  y: number;
  width: number;
  height: number;
  /** Rooftop antenna, mahjong-tile style — some towers get one, some don't. */
  antenna: boolean;
}

/** Lays out a dense skyline across the poster width by walking left to right. */
export function buildSkyline(seed: number, viewWidth: number, baseline: number): Building[] {
  const rng = createRng(seed);
  const buildings: Building[] = [];
  let x = -12;

  while (x < viewWidth + 12 && buildings.length < 26) {
    const width = 30 + Math.round(rng() * 44);
    const height = 110 + Math.round(rng() * 320);
    buildings.push({
      x,
      y: baseline - height,
      width,
      height,
      antenna: rng() > 0.72,
    });
    x += width + 2 + Math.round(rng() * 8);
  }

  return buildings;
}

export type PosterMotif = 'blades' | 'bars' | 'orbs' | 'rings' | 'blocks';

/** Maps a film's genres to the abstract motif layered over its skyline. */
export function pickMotif(genres: string[]): PosterMotif {
  const has = (name: string) => genres.some((genre) => genre.includes(name));

  if (has('武侠') || has('动作')) return 'blades';
  if (has('犯罪') || has('惊悚')) return 'bars';
  if (has('爱情')) return 'orbs';
  if (has('奇幻')) return 'rings';
  if (has('喜剧')) return 'blocks';
  return 'rings';
}

/** Shrinks the headline so 2–8 character Cantonese titles all fit the same band. */
export function titleFontSize(title: string): number {
  const length = [...title].length;
  if (length <= 2) return 104;
  if (length === 3) return 88;
  if (length === 4) return 72;
  if (length === 5) return 60;
  if (length === 6) return 52;
  return 44;
}
