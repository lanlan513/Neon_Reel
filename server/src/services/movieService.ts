import { getDb } from '../db/connection.ts';
import { movieRepository } from '../repositories/movieRepository.ts';
import type { Movie, MovieMeta, MovieQuery, MovieSummary, Paginated } from '../types/movie.ts';

/**
 * Business layer: turns raw query objects into validated, paginated domain results.
 * Nothing here touches `req` / `res`, so it is directly unit-testable.
 */
export const movieService = {
  listMovies(query: MovieQuery): Paginated<MovieSummary> {
    const limit = query.limit ?? 60;
    const offset = query.offset ?? 0;
    const { items, total } = movieRepository.findMany(getDb(), { ...query, limit, offset });

    return {
      items,
      total,
      limit,
      offset,
      hasMore: offset + items.length < total,
    };
  },

  getMovie(id: string): Movie | null {
    return movieRepository.findById(getDb(), id);
  },

  listFeatured(limit = 6): Movie[] {
    return movieRepository.findFeatured(getDb(), limit);
  },

  /** Facets for the home page era / genre rails — the seed of future filter pages. */
  getMeta(): MovieMeta {
    const movies = movieRepository.findAll(getDb());

    const genreCounts = new Map<string, number>();
    const decadeCounts = new Map<number, number>();

    for (const movie of movies) {
      for (const genre of movie.genres) {
        genreCounts.set(genre, (genreCounts.get(genre) ?? 0) + 1);
      }
      decadeCounts.set(movie.decade, (decadeCounts.get(movie.decade) ?? 0) + 1);
    }

    return {
      total: movies.length,
      genres: [...genreCounts.entries()]
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name)),
      decades: [...decadeCounts.entries()]
        .map(([decade, count]) => ({ decade, label: `${decade}s`, count }))
        .sort((a, b) => a.decade - b.decade),
    };
  },
};
