import { useRef, useState } from 'react';
import type { CSSProperties, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchMovies } from '../api/movies.ts';

interface Props {
  children?: ReactNode;
  className?: string;
  style?: CSSProperties;
}

/**
 * Picks a random film from the archive and navigates to it.
 * The id list is fetched lazily on first click and cached for the session.
 */
export function RandomMovieButton({ children = '隨機抽一部', className = 'btn btn--solid', style }: Props) {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const cache = useRef<string[] | null>(null);

  async function handleClick(): Promise<void> {
    if (busy) return;
    setBusy(true);
    try {
      if (!cache.current) {
        const page = await fetchMovies({ limit: 100 });
        cache.current = page.items.map((movie) => movie.id);
      }
      const ids = cache.current;
      const pick = ids[Math.floor(Math.random() * ids.length)];
      if (pick) navigate(`/movies/${pick}`);
    } catch {
      navigate('/movies');
    } finally {
      setBusy(false);
    }
  }

  return (
    <button type="button" className={className} style={style} onClick={handleClick} disabled={busy}>
      {busy ? '抽取中…' : children}
    </button>
  );
}
