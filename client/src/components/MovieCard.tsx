import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import type { MovieSummary } from '../types/movie.ts';
import { FilmPoster } from './FilmPoster.tsx';

interface Props {
  movie: MovieSummary;
  /** Stagger index for the entrance animation. */
  index?: number;
  /** Renders the wide 16:10 crop used in horizontal rails. */
  wide?: boolean;
}

/** Poster card used by both the archive grid and the home rails. */
export function MovieCard({ movie, index = 0, wide = false }: Props) {
  const style = {
    '--accent': movie.accent,
    '--i': Math.min(index, 12),
  } as CSSProperties;

  return (
    <Link
      to={`/movies/${movie.id}`}
      className={`card rise${wide ? ' card--wide' : ''}`}
      style={style}
      aria-label={`${movie.title} ${movie.titleEn}，${movie.year} 年`}
    >
      <div className="card__frame">
        <div className="card__poster">
          <FilmPoster movie={movie} decorative />
          <div className="card__grain" />
          <div className="card__scrim" />
          <span className="card__rank">{movie.year}</span>
          {movie.tagline && <p className="card__tagline">{movie.tagline}</p>}
        </div>
      </div>

      <div className="card__body">
        <h3 className="card__title">{movie.title}</h3>
        <span className="card__title-en">{movie.titleEn}</span>
        <div className="card__meta">
          <span>{movie.genres.slice(0, 2).join(' · ')}</span>
          <span className="card__score">{movie.rating.toFixed(1)}</span>
        </div>
      </div>
    </Link>
  );
}
