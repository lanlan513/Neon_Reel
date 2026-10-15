import { useCallback, useEffect, useRef, useState } from 'react';
import { ApiError } from '../api/client.ts';

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  /** HTTP status of the failure, when the error came from the API (e.g. 404). */
  errorStatus: number | null;
  /** Re-runs the loader (used by the retry buttons). */
  reload: () => void;
}

/**
 * Minimal data-fetching hook: runs `loader` whenever `deps` change, ignores results
 * from stale requests, and surfaces a human-readable error string.
 *
 * Kept deliberately small — the MVP has four endpoints and no caching requirements,
 * so a library would be more machinery than the app needs.
 */
export function useApi<T>(loader: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorStatus, setErrorStatus] = useState<number | null>(null);
  const [nonce, setNonce] = useState(0);

  const loaderRef = useRef(loader);
  loaderRef.current = loader;

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setErrorStatus(null);

    loaderRef.current().then(
      (result) => {
        if (cancelled) return;
        setData(result);
        setLoading(false);
      },
      (cause: unknown) => {
        if (cancelled) return;
        setError(cause instanceof Error ? cause.message : '發生未知錯誤。');
        setErrorStatus(cause instanceof ApiError ? cause.status : null);
        setLoading(false);
      },
    );

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce]);

  const reload = useCallback(() => setNonce((value) => value + 1), []);

  return { data, loading, error, errorStatus, reload };
}
