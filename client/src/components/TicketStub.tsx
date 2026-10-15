import type { Movie } from '../types/movie.ts';

interface Props {
  movie: Movie;
}

export function formatRuntime(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return hours > 0 ? `${hours} 小時 ${rest} 分` : `${rest} 分鐘`;
}

/** Old-cinema admission ticket summarising the hard facts of a film. */
export function TicketStub({ movie }: Props) {
  const rows: Array<[string, string]> = [
    ['Decade 年代', `${movie.decade}s`],
    ['Year 上映', String(movie.year)],
    ['Runtime 片長', formatRuntime(movie.runtime)],
    ['Language 語言', movie.language],
    ['Genre 類型', movie.genres.join(' / ')],
    ['Director 導演', movie.director],
  ];

  return (
    <div className="ticket">
      <div className="ticket__stub">
        <span>Admit One</span>
      </div>
      <span className="ticket__perf" aria-hidden="true" />

      <div className="ticket__body">
        <div className="ticket__head">
          <strong>《{movie.title}》</strong>
          <span>No. {String(movie.year).slice(2)}-{movie.id.slice(0, 3).toUpperCase()}</span>
        </div>
        <dl className="ticket__rows">
          {rows.map(([label, value]) => (
            <div className="ticket__row" key={label}>
              <dt>{label}</dt>
              <dd>{value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
