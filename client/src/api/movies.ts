import { apiFetch } from './client.ts';
import type { Movie, MovieMeta, MovieQuery, MovieSummary, Paginated } from '../types/movie.ts';

/** Builds a query string from the typed movie query, skipping empty values. */
function toQueryString(query: MovieQuery): string {
  const params = new URLSearchParams();
  if (query.search) params.set('search', query.search);
  if (query.genre) params.set('genre', query.genre);
  if (typeof query.decade === 'number') params.set('decade', String(query.decade));
  if (query.sort) params.set('sort', query.sort);
  if (query.order) params.set('order', query.order);
  if (typeof query.limit === 'number') params.set('limit', String(query.limit));
  if (typeof query.offset === 'number') params.set('offset', String(query.offset));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

/** `GET /api/movies` — searchable, filterable list. */
export function fetchMovies(query: MovieQuery = {}): Promise<Paginated<MovieSummary>> {
  return apiFetch<Paginated<MovieSummary>>(`/movies${toQueryString(query)}`);
}

/** `GET /api/movies/:id` */
export function fetchMovie(id: string): Promise<Movie> {
  return apiFetch<{ movie: Movie }>(`/movies/${encodeURIComponent(id)}`).then((r) => r.movie);
}

/** `GET /api/movies/featured` */
export function fetchFeatured(limit = 6): Promise<Movie[]> {
  return apiFetch<{ items: Movie[] }>(`/movies/featured?limit=${limit}`).then((r) => r.items);
}

/** `GET /api/meta` */
export function fetchMeta(): Promise<MovieMeta> {
  return apiFetch<MovieMeta>('/meta');
}
