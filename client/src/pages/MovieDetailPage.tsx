import { useParams } from 'react-router-dom';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { fetchMovie, fetchMovies } from '../api/movies.ts';
import { MovieCard } from '../components/MovieCard.tsx';
import { FilmPoster } from '../components/FilmPoster.tsx';
import { Rating } from '../components/Rating.tsx';
import { StateMessage } from '../components/StateMessage.tsx';
import { TicketStub, formatRuntime } from '../components/TicketStub.tsx';
import { useApi } from '../hooks/useApi.ts';
import type { MovieSummary } from '../types/movie.ts';

export function MovieDetailPage() {
  const { id = '' } = useParams<{ id: string }>();

  const movie = useApi(() => fetchMovie(id), [id]);

  const related = useApi(() => {
    const current = movie.data;
    if (!current) return Promise.resolve<MovieSummary[]>([]);
    return fetchMovies({ decade: current.decade, limit: 8 }).then((page) =>
      page.items.filter((item) => item.id !== current.id).slice(0, 4),
    );
  }, [movie.data?.id, movie.data?.decade]);

  if (movie.loading) {
    return (
      <section className="section shell">
        <StateMessage glyph="放映中" title="正在裝片…" text="正在從片庫調取這部電影的資料。" />
      </section>
    );
  }

  if (movie.errorStatus === 404 || (movie.error && !movie.data)) {
    const notFound = movie.errorStatus === 404;

    return (
      <section className="section shell">
        <StateMessage
          glyph={notFound ? '404' : '訊號中斷'}
          title={notFound ? '片庫裡沒有這部電影' : '無法讀取電影資料'}
          text={movie.error ?? '請確認網址是否正確，或回到片庫重新挑選。'}
        >
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <Link className="btn btn--solid" to="/movies">
              回到片庫
            </Link>
            {!notFound && (
              <button type="button" className="btn" onClick={movie.reload}>
                重試
              </button>
            )}
          </div>
        </StateMessage>
      </section>
    );
  }

  const data = movie.data;
  if (!data) return null;

  return (
    <article style={{ '--accent': data.accent } as CSSProperties}>
      <nav className="shell" style={{ paddingBlock: '1.4rem 0' }}>
        <Link className="btn btn--quiet" to="/movies" style={{ paddingLeft: 0 }}>
          ← 返回片庫
        </Link>
      </nav>

      {/* ------------------------------------------------------------ hero */}
      <section className="detail-hero">
        <div className="detail-hero__bg" aria-hidden="true" />
        <div className="detail-hero__veil" aria-hidden="true" />

        <div className="shell detail-hero__inner">
          <div className="poster-frame rise">
            <FilmPoster movie={data} />
            <div className="poster-frame__grain" aria-hidden="true" />
          </div>

          <div className="detail-head">
            <p className="u-eyebrow rise" style={{ '--i': 0 } as CSSProperties}>
              {data.genres.join(' · ')} &nbsp;|&nbsp; {data.year} &nbsp;|&nbsp; {data.language}
            </p>
            <h1 className="detail-title rise" style={{ '--i': 1 } as CSSProperties}>
              {data.title}
            </h1>
            <p className="detail-title-en rise" style={{ '--i': 2 } as CSSProperties}>
              {data.titleEn}
            </p>
            <p className="detail-tagline rise" style={{ '--i': 3 } as CSSProperties}>
              {data.tagline}
            </p>
            <div className="rise" style={{ '--i': 4 } as CSSProperties}>
              <Rating value={data.rating} />
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------ body */}
      <section className="section shell detail-body">
        <div className="stack" style={{ gap: '2.4rem' }}>
          <div>
            <p className="u-eyebrow">Synopsis · 故事</p>
            <p className="prose" style={{ marginTop: '0.9rem' }}>
              {data.synopsis}
            </p>
          </div>

          <div>
            <p className="u-eyebrow">Credits · 幕後與演員</p>
            <div className="field-grid" style={{ marginTop: '1rem' }}>
              <div className="field">
                <span className="field__label">Director</span>
                <span className="field__value">{data.director}</span>
              </div>
              <div className="field">
                <span className="field__label">Runtime</span>
                <span className="field__value">{formatRuntime(data.runtime)}</span>
              </div>
              <div className="field" style={{ gridColumn: '1 / -1' }}>
                <span className="field__label">Cast</span>
                <ul className="cast-list" style={{ marginTop: '0.5rem' }}>
                  {data.cast.map((person) => (
                    <li key={person}>{person}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {data.locations.length > 0 && (
            <div>
              <p className="u-eyebrow">Locations · 取景地</p>
              <div className="location-list" style={{ marginTop: '1rem' }}>
                {data.locations.map((location) => (
                  <div className="location-item" key={`${location.name}-${location.district}`}>
                    <span>{location.name}</span>
                    <span>{location.district}</span>
                  </div>
                ))}
              </div>
              <p className="u-mono" style={{ marginTop: '0.7rem', color: 'var(--muted-deep)' }}>
                電影地圖即將推出 · Coming soon
              </p>
            </div>
          )}
        </div>

        <aside className="stack" style={{ gap: '1.6rem' }}>
          <TicketStub movie={data} />

          <div className="stack" style={{ gap: '0.7rem' }}>
            <p className="u-eyebrow">Tags · 類型標籤</p>
            <div className="chip-row">
              {data.genres.map((genre) => (
                <span className="chip chip--accent" key={genre}>
                  {genre}
                </span>
              ))}
              {data.moods.map((mood) => (
                <span className="chip" key={mood}>
                  {mood}
                </span>
              ))}
            </div>
          </div>
        </aside>
      </section>

      {/* --------------------------------------------------------- related */}
      {related.data && related.data.length > 0 && (
        <section className="section shell" style={{ paddingTop: 0 }}>
          <div className="section__head">
            <div>
              <p className="u-eyebrow">Same Era · 同年代</p>
              <h2 className="section__title">{data.decade}s 的其他電影</h2>
            </div>
            <Link className="btn" to={`/movies?decade=${data.decade}`}>
              查看該年代
            </Link>
          </div>
          <div className="movie-grid">
            {related.data.map((item, index) => (
              <MovieCard key={item.id} movie={item} index={index} />
            ))}
          </div>
        </section>
      )}
    </article>
  );
}
