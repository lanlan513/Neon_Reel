import { Router } from 'express';
import { movieService } from '../services/movieService.ts';
import type { MovieQuery } from '../types/movie.ts';

/** Normalises Express' `ParsedQs` into a single primitive value. */
function first(value: unknown): string | undefined {
  if (typeof value === 'string') return value.trim() || undefined;
  if (Array.isArray(value) && typeof value[0] === 'string') return value[0].trim() || undefined;
  return undefined;
}

const SORTS = new Set(['year', 'rating', 'title']);

/** Translates raw query params into the typed `MovieQuery` contract. */
export function parseMovieQuery(params: Record<string, unknown>): MovieQuery {
  const search = first(params.search) ?? first(params.q);
  const genre = first(params.genre);
  const sort = first(params.sort);
  const order = first(params.order);
  const decadeRaw = first(params.decade);
  const limitRaw = first(params.limit);
  const offsetRaw = first(params.offset);

  const decade = decadeRaw ? Number.parseInt(decadeRaw, 10) : Number.NaN;
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : Number.NaN;
  const offset = offsetRaw ? Number.parseInt(offsetRaw, 10) : Number.NaN;

  const query: MovieQuery = {
    search: search ? search.slice(0, 80) : undefined,
    genre: genre ? genre.slice(0, 40) : undefined,
    sort: sort && SORTS.has(sort) ? (sort as MovieQuery['sort']) : 'year',
    order: order === 'asc' ? 'asc' : 'desc',
    limit: Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 100) : undefined,
    offset: Number.isFinite(offset) ? Math.max(offset, 0) : undefined,
    decade: Number.isFinite(decade) ? decade : undefined,
  };

  return query;
}

export const moviesRouter = Router();

/** Curated home-page picks. Declared before `/:id` so it isn't captured as an id. */
moviesRouter.get('/featured', (req, res) => {
  const limitRaw = first(req.query.limit);
  const limit = limitRaw ? Number.parseInt(limitRaw, 10) : 6;
  res.json({ items: movieService.listFeatured(Number.isFinite(limit) ? Math.min(Math.max(limit, 1), 24) : 6) });
});

/** Searchable, filterable, paginated list. */
moviesRouter.get('/', (req, res) => {
  res.json(movieService.listMovies(parseMovieQuery(req.query as Record<string, unknown>)));
});

/** Single movie. */
moviesRouter.get('/:id', (req, res) => {
  const movie = movieService.getMovie(req.params.id);
  if (!movie) {
    res.status(404).json({
      error: { code: 'MOVIE_NOT_FOUND', message: `找不到电影「${req.params.id}」。` },
    });
    return;
  }
  res.json({ movie });
});
