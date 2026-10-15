interface Props {
  count?: number;
}

/** Shimmering placeholder grid shown while the archive request is in flight. */
export function MovieGridSkeleton({ count = 10 }: Props) {
  return (
    <div className="movie-grid" aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div className="skeleton-card" key={index}>
          <div className="skeleton skeleton--poster" />
          <div className="skeleton skeleton--line" style={{ marginTop: '0.2rem' }} />
          <div className="skeleton skeleton--line skeleton--line-short" />
        </div>
      ))}
    </div>
  );
}
