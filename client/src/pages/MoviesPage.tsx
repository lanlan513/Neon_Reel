import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { fetchMovies } from '../api/movies.ts';
import { MovieCard } from '../components/MovieCard.tsx';
import { MovieGridSkeleton } from '../components/MovieGridSkeleton.tsx';
import { SearchBar } from '../components/SearchBar.tsx';
import { StateMessage } from '../components/StateMessage.tsx';
import { useApi } from '../hooks/useApi.ts';
import type { MovieQuery } from '../types/movie.ts';

type SortKey = NonNullable<MovieQuery['sort']>;

const SORT_LABELS: Record<SortKey, string> = {
  year: '上映年份',
  rating: '評分',
  title: '片名',
};

function isSortKey(value: string | null): value is SortKey {
  return value === 'year' || value === 'rating' || value === 'title';
}

export function MoviesPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const urlQuery = searchParams.get('q') ?? '';
  const decadeParam = searchParams.get('decade');
  const parsedDecade = decadeParam ? Number.parseInt(decadeParam, 10) : Number.NaN;
  const decade = Number.isFinite(parsedDecade) ? parsedDecade : undefined;
  const sortParam = searchParams.get('sort');
  const sort: SortKey = isSortKey(sortParam) ? sortParam : 'year';

  const [input, setInput] = useState(urlQuery);
  const [debounced, setDebounced] = useState(urlQuery);

  // Keep the URL in step with the search box so the result is shareable / bookmarkable.
  useEffect(() => {
    const timer = window.setTimeout(() => setDebounced(input.trim()), 320);
    return () => window.clearTimeout(timer);
  }, [input]);

  useEffect(() => {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (debounced) next.set('q', debounced);
        else next.delete('q');
        return next;
      },
      { replace: true },
    );
  }, [debounced, setSearchParams]);

  const results = useApi(
    () => fetchMovies({ search: debounced || undefined, decade, sort, limit: 100 }),
    [debounced, decade, sort],
  );

  function updateParam(key: string, value: string | null): void {
    setSearchParams(
      (previous) => {
        const next = new URLSearchParams(previous);
        if (value) next.set(key, value);
        else next.delete(key);
        return next;
      },
      { replace: true },
    );
  }

  const items = results.data?.items ?? [];
  const total = results.data?.total ?? 0;

  return (
    <section className="section shell">
      <div className="section__head">
        <div>
          <p className="u-eyebrow">The Archive · 片庫</p>
          <h2 className="section__title">香港電影精選</h2>
        </div>
        <p className="count-line">
          {results.loading ? (
            '讀取中…'
          ) : (
            <>
              共 <b>{total}</b> 部{debounced && <> 符合「{debounced}」</>}
              {decade && <> · {decade}s</>}
            </>
          )}
        </p>
      </div>

      <div className="toolbar">
        <SearchBar value={input} onChange={setInput} placeholder="搜尋片名，例如：重慶森林 / Chungking" />

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
          {decade && (
            <button type="button" className="chip chip--link" onClick={() => updateParam('decade', null)}>
              {decade}s <span aria-hidden="true">✕</span>
            </button>
          )}
          <label className="u-mono" style={{ color: 'var(--muted-deep)' }} htmlFor="sort">
            排序
          </label>
          <select
            id="sort"
            className="select"
            value={sort}
            onChange={(event) => updateParam('sort', event.target.value)}
          >
            {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
              <option key={key} value={key}>
                {SORT_LABELS[key]}
              </option>
            ))}
          </select>
        </div>
      </div>

      {results.loading && <MovieGridSkeleton count={10} />}

      {!results.loading && results.error && (
        <StateMessage
          glyph="訊號中斷"
          title="無法讀取片庫"
          text={results.error}
        >
          <button type="button" className="btn btn--solid" onClick={results.reload}>
            重試
          </button>
        </StateMessage>
      )}

      {!results.loading && !results.error && items.length === 0 && (
        <StateMessage
          glyph="空場"
          title={debounced ? `找不到「${debounced}」` : '這個年代暫時沒有收藏'}
          text="試試其他片名，或清除搜尋條件回到完整片庫。"
        >
          <button
            type="button"
            className="btn"
            onClick={() => {
              setInput('');
              updateParam('q', null);
            }}
          >
            清除搜尋
          </button>
        </StateMessage>
      )}

      {!results.loading && !results.error && items.length > 0 && (
        <div className="movie-grid">
          {items.map((movie, index) => (
            <MovieCard key={movie.id} movie={movie} index={index} />
          ))}
        </div>
      )}
    </section>
  );
}
