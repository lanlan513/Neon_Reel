import { useMemo } from 'react';
import type { CSSProperties } from 'react';
import { Link } from 'react-router-dom';
import { fetchFeatured, fetchMeta, fetchMovies } from '../api/movies.ts';
import { MovieCard } from '../components/MovieCard.tsx';
import { MovieGridSkeleton } from '../components/MovieGridSkeleton.tsx';
import { Marquee } from '../components/Marquee.tsx';
import { FilmPoster } from '../components/FilmPoster.tsx';
import { RandomMovieButton } from '../components/RandomMovieButton.tsx';
import { useApi } from '../hooks/useApi.ts';
import type { MovieSummary } from '../types/movie.ts';

export function HomePage() {
  const featured = useApi(() => fetchFeatured(6), []);
  const meta = useApi(() => fetchMeta(), []);
  const archive = useApi(() => fetchMovies({ limit: 100 }), []);

  const all = useMemo<MovieSummary[]>(() => archive.data?.items ?? [], [archive.data]);

  /** Films grouped by decade, used by the era corridor. */
  const byDecade = useMemo(() => {
    const map = new Map<number, MovieSummary[]>();
    for (const movie of all) {
      const bucket = map.get(movie.decade);
      if (bucket) bucket.push(movie);
      else map.set(movie.decade, [movie]);
    }
    return map;
  }, [all]);

  const hero = featured.data?.[0] ?? all[0];
  const years = all.map((movie) => movie.year);
  const yearRange = years.length > 0 ? `${Math.min(...years)} – ${Math.max(...years)}` : '1966 – 2016';
  const decades = meta.data?.decades ?? [];
  const genres = meta.data?.genres ?? [];

  return (
    <>
      {/* ---------------------------------------------------------------- hero */}
      <section
        className="hero"
        style={{ '--accent': hero?.accent ?? '#ff2e88' } as CSSProperties}
      >
        {hero && <div className="hero__backdrop" aria-hidden="true" />}
        <div className="hero__veil" aria-hidden="true" />

        <div className="shell hero__inner">
          <p className="hero__eyebrow u-mono rise" style={{ '--i': 0 } as CSSProperties}>
            Hong Kong Cinema · 霓虹光影
          </p>

          <div className="signboard rise" style={{ '--i': 1 } as CSSProperties}>
            <h1 className="hero__wordmark u-neon u-neon-flicker">Neon Reel</h1>
            <p className="hero__zh">霓虹光影裡的香港電影</p>
          </div>

          <p className="hero__lede rise" style={{ '--i': 2 } as CSSProperties}>
            走進一間想像中的舊戲院：霓虹招牌在雨裡發亮，膠片在放映機裡沙沙作響。
            從武俠的刀光到九七前的街頭，挑一部電影，讓那個年代重新亮起來。
          </p>

          <div className="hero__stats rise" style={{ '--i': 3 } as CSSProperties}>
            <span className="hero__stat">
              <b>{meta.data?.total ?? all.length}</b> 部精選港片
            </span>
            <span className="hero__stat">
              <b>{decades.length}</b> 個年代
            </span>
            <span className="hero__stat">
              <b>{yearRange}</b>
            </span>
          </div>

          <div className="hero__actions rise" style={{ '--i': 4 } as CSSProperties}>
            <Link className="btn btn--solid" to="/movies">
              開始探索
            </Link>
            <RandomMovieButton className="btn">隨機抽一部</RandomMovieButton>
          </div>
        </div>
      </section>

      <Marquee items={all.slice(0, 14).map((movie) => `${movie.titleEn} ${movie.year}`)} />

      {/* ------------------------------------------------------------ featured */}
      <section className="section shell">
        <div className="section__head">
          <div>
            <p className="u-eyebrow">Featured &nbsp;·&nbsp; 本週精選</p>
            <h2 className="section__title">戲院正場</h2>
          </div>
          <Link className="btn" to="/movies">
            查看全部
          </Link>
        </div>

        {featured.loading && all.length === 0 ? (
          <MovieGridSkeleton count={6} />
        ) : (
          <div className="rail">
            {(featured.data ?? all.filter((movie) => movie.featured)).map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}

        {featured.error && (
          <p className="state__text" style={{ marginTop: '1rem' }}>
            {featured.error}
          </p>
        )}
      </section>

      {/* ---------------------------------------------------------- era corridor */}
      <section className="section shell">
        <div className="section__head">
          <div>
            <p className="u-eyebrow">Eras &nbsp;·&nbsp; 年代走廊</p>
            <h2 className="section__title">六個十年，六種香港</h2>
          </div>
          <p className="count-line">
            由武俠片的刀光，走到回歸前夕的街頭霓虹 —— 選一個年代開始。
          </p>
        </div>

        {meta.loading ? (
          <MovieGridSkeleton count={4} />
        ) : (
          <div className="era-grid">
            {decades.map((item, index) => {
              const films = byDecade.get(item.decade) ?? [];
              const accent = films[0]?.accent ?? '#ff2e88';

              return (
                <Link
                  key={item.decade}
                  to={`/movies?decade=${item.decade}`}
                  className="era-card rise"
                  style={{ '--accent': accent, '--i': index } as CSSProperties}
                >
                  <div className="era-card__num" aria-hidden="true">
                    {item.label}
                  </div>
                  <div className="era-card__label">
                    <span>{item.decade}s</span>
                    <span>{item.count} 部</span>
                  </div>
                  <div className="era-card__strip">
                    {films.slice(0, 3).map((film) => (
                      <span key={film.id}>
                        <FilmPoster movie={film} variant="mini" decorative />
                      </span>
                    ))}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* --------------------------------------------------------- genre index */}
      {genres.length > 0 && (
        <section className="section shell">
          <div className="section__head">
            <div>
              <p className="u-eyebrow">Genres &nbsp;·&nbsp; 類型索引</p>
              <h2 className="section__title">片庫裡的類型版圖</h2>
            </div>
          </div>
          <div className="chip-row">
            {genres.map((genre) => (
              <span className="chip" key={genre.name}>
                {genre.name}
                <b style={{ color: 'var(--muted-deep)' }}>{genre.count}</b>
              </span>
            ))}
          </div>
        </section>
      )}
    </>
  );
}
