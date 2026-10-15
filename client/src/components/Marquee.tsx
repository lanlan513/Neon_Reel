interface Props {
  /** Raw ticket labels, e.g. `["英雄本色 1986", "Chungking Express 1994"]`. */
  items: string[];
}

/** Infinite neon ticker. The item list is duplicated once so the loop is seamless. */
export function Marquee({ items }: Props) {
  if (items.length === 0) return null;

  const group = (key: string) => (
    <div className="marquee__group" key={key} aria-hidden={key === 'b'}>
      {items.map((item, index) => (
        <span key={`${key}-${index}`} style={{ display: 'contents' }}>
          <span className="marquee__item">{item}</span>
          <span className="marquee__star" aria-hidden="true">
            ✦
          </span>
        </span>
      ))}
    </div>
  );

  return (
    <div className="marquee" aria-label="電影名錄跑馬燈">
      <div className="marquee__track">
        {group('a')}
        {group('b')}
      </div>
    </div>
  );
}
