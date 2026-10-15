import type { ReactNode } from 'react';

interface Props {
  glyph: string;
  title: string;
  text?: string;
  children?: ReactNode;
}

/** Shared empty / error / not-found panel. */
export function StateMessage({ glyph, title, text, children }: Props) {
  return (
    <div className="state rise" role="status">
      <div className="state__glyph" aria-hidden="true">
        {glyph}
      </div>
      <p className="state__title">{title}</p>
      {text && <p className="state__text">{text}</p>}
      {children}
    </div>
  );
}
