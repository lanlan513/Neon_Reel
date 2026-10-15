/**
 * Domain model for Neon Reel.
 *
 * These are the API-facing shapes. Persistence shapes (raw SQLite rows) live in
 * `repositories/movieRepository.ts` so the HTTP layer never leaks storage details.
 */

/** A real Hong Kong filming location — reserved for the future "film map" feature. */
export interface MovieLocation {
  name: string;
  district: string;
  lat: number;
  lng: number;
}

/** Full movie record returned by `GET /api/movies/:id`. */
export interface Movie {
  id: string;
  title: string;
  titleEn: string;
  year: number;
  /** Bucket decade, e.g. `1990` for a film released in 1994. Powers era browsing. */
  decade: number;
  director: string;
  cast: string[];
  genres: string[];
  /** Runtime in minutes. */
  runtime: number;
  /** Editorial score, 0–10, one decimal. */
  rating: number;
  language: string;
  tagline: string;
  synopsis: string;
  /** Neon accent colour (hex) driving the card glow and the generated poster artwork. */
  accent: string;
  /** Reserved for the future genre-filter & mood-mapping features. */
  moods: string[];
  /** Reserved for the future film map feature. */
  locations: MovieLocation[];
  featured: boolean;
}

/** List projection returned by `GET /api/movies` — cheaper than the full record. */
export type MovieSummary = Omit<Movie, 'locations' | 'moods' | 'synopsis' | 'cast'> & {
  cast: string[];
  synopsis: string;
};

/** Query parameters accepted by the movie list endpoint. */
export interface MovieQuery {
  search?: string;
  genre?: string;
  decade?: number;
  sort?: 'year' | 'rating' | 'title';
  order?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

/** Paginated envelope for the list endpoint. */
export interface Paginated<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  hasMore: boolean;
}

/** Facets surfaced on the home page — the seed of future era / genre sections. */
export interface MovieMeta {
  genres: Array<{ name: string; count: number }>;
  decades: Array<{ decade: number; label: string; count: number }>;
  total: number;
}
