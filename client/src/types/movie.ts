/**
 * Client-side mirror of the API contract.
 *
 * Deliberately duplicated rather than shared through a workspace package: the MVP has
 * one consumer and no build-shared step, so a copy keeps the two halves decoupled and
 * cheap to run. If a second consumer appears, this is the file to promote into a
 * shared `@neon-reel/types` package.
 */

export interface MovieLocation {
  name: string;
  district: string;
  lat: number;
  lng: number;
}

export interface Movie {
  id: string;
  title: string;
  titleEn: string;
  year: number;
  decade: number;
  director: string;
  cast: string[];
  genres: string[];
  runtime: number;
  rating: number;
  language: string;
  tagline: string;
  synopsis: string;
  accent: string;
  moods: string[];
  locations: MovieLocation[];
  featured: boolean;
}

export type MovieSummary = Omit<Movie, 'locations' | 'moods'>;

export interface MovieQuery {
  search?: string;
  genre?: string;
  decade?: number;
  sort?: 'year' | 'rating' | 'title';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

export interface MovieMeta {
  genres: Array<{ name: string; count: number }>;
  decades: Array<{ decade: number; label: string; count: number }>;
  total: number;
}
