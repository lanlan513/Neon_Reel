import type { DatabaseSync } from 'node:sqlite';
import type { Movie, MovieQuery, MovieSummary } from '../types/movie.ts';

/** Raw SQLite row shape — kept private to this module. */
interface MovieRow {
  id: string;
  title: string;
  title_en: string;
  year: number;
  decade: number;
  director: string;
  cast_json: string;
  genres_json: string;
  runtime: number;
  rating: number;
  language: string;
  tagline: string;
  synopsis: string;
  accent: string;
  moods_json: string;
  locations_json: string;
  featured: number;
}

/** Projection for list responses. `moods` / `locations` are detail-only fields. */
type MovieSummaryRow = Omit<MovieRow, 'moods_json' | 'locations_json'>;

function parseJson<T>(raw: string, fallback: T): T {
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as T) : fallback;
  } catch {
    return fallback;
  }
}

function toSummary(row: MovieSummaryRow): MovieSummary {
  return {
    id: row.id,
    title: row.title,
    titleEn: row.title_en,
    year: row.year,
    decade: row.decade,
    director: row.director,
    cast: parseJson<string[]>(row.cast_json, []),
    genres: parseJson<string[]>(row.genres_json, []),
    runtime: row.runtime,
    rating: row.rating,
    language: row.language,
    tagline: row.tagline,
    synopsis: row.synopsis,
    accent: row.accent,
    featured: row.featured === 1,
  };
}

function toMovie(row: MovieRow): Movie {
  return {
    ...toSummary(row),
    moods: parseJson<string[]>(row.moods_json, []),
    locations: parseJson<Movie['locations']>(row.locations_json, []),
  };
}

const SUMMARY_COLUMNS = `
  id, title, title_en, year, decade, director,
  cast_json, genres_json, runtime, rating, language,
  tagline, synopsis, accent, featured
`;

const FULL_COLUMNS = `${SUMMARY_COLUMNS}, moods_json, locations_json`;

const SORTABLE = {
  year: 'year',
  rating: 'rating',
  title: 'title',
} as const;

/**
 * Data-access layer. Knows only SQL and rows — no HTTP concerns, no business rules.
 */
export const movieRepository = {
  /**
   * Lists movies matching the query together with the unpaginated match count, so the
   * caller can build a paginated envelope.
   */
  findMany(db: DatabaseSync, query: MovieQuery): { items: MovieSummary[]; total: number } {
    const conditions: string[] = [];
    const params: Record<string, string | number> = {};

    if (query.search) {
      conditions.push('(title LIKE $search OR title_en LIKE $search OR director LIKE $search)');
      params.search = `%${query.search}%`;
    }
    if (query.genre) {
      conditions.push('genres_json LIKE $genre');
      params.genre = `%"${query.genre}"%`;
    }
    if (typeof query.decade === 'number' && Number.isFinite(query.decade)) {
      conditions.push('decade = $decade');
      params.decade = query.decade;
    }

    const where = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    const sortColumn = SORTABLE[query.sort ?? 'year'];
    const direction = (query.order ?? 'desc') === 'asc' ? 'ASC' : 'DESC';

    const totalRow = db
      .prepare(`SELECT COUNT(*) AS total FROM movies ${where}`)
      .get(params) as { total: number };

    const rows = db
      .prepare(
        `SELECT ${SUMMARY_COLUMNS} FROM movies ${where}
         ORDER BY ${sortColumn} ${direction}, title ASC
         LIMIT $limit OFFSET $offset`,
      )
      .all({
        ...params,
        limit: Math.max(1, query.limit ?? 60),
        offset: Math.max(0, query.offset ?? 0),
      }) as unknown as MovieSummaryRow[];

    return { items: rows.map(toSummary), total: totalRow.total };
  },

  findById(db: DatabaseSync, id: string): Movie | null {
    const row = db
      .prepare(`SELECT ${FULL_COLUMNS} FROM movies WHERE id = $id`)
      .get({ id }) as unknown as MovieRow | undefined;
    return row ? toMovie(row) : null;
  },

  /** Curated picks for the home page hero rail. */
  findFeatured(db: DatabaseSync, limit: number): Movie[] {
    const rows = db
      .prepare(`SELECT ${FULL_COLUMNS} FROM movies WHERE featured = 1 ORDER BY rating DESC LIMIT $limit`)
      .all({ limit }) as unknown as MovieRow[];
    return rows.map(toMovie);
  },

  /** Every movie, used to derive genre / decade facets (cheap at this dataset size). */
  findAll(db: DatabaseSync): Movie[] {
    const rows = db
      .prepare(`SELECT ${FULL_COLUMNS} FROM movies ORDER BY year ASC`)
      .all() as unknown as MovieRow[];
    return rows.map(toMovie);
  },

  count(db: DatabaseSync): number {
    return (db.prepare('SELECT COUNT(*) AS total FROM movies').get() as { total: number }).total;
  },
};
