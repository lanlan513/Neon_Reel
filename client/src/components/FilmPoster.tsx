import { useId } from 'react';
import {
  buildSkyline,
  createRng,
  hashString,
  pickMotif,
  titleFontSize,
  type PosterMotif,
} from '../lib/posterArt.ts';

/** Minimal shape needed to draw a poster — satisfied by both `Movie` and `MovieSummary`. */
export interface PosterMovie {
  id: string;
  title: string;
  titleEn: string;
  year: number;
  genres: string[];
  accent: string;
}

interface Props {
  movie: PosterMovie;
  /** `mini` drops the typography for the small thumbnails used in era strips. */
  variant?: 'poster' | 'mini';
  className?: string;
  /** Marks the artwork as decorative for screen readers. */
  decorative?: boolean;
}

interface MotifProps {
  kind: PosterMotif;
  accent: string;
  rotation: number;
}

/** Abstract, genre-derived overlay burned over the skyline. */
function Motif({ kind, accent, rotation }: MotifProps) {
  const blend = { mixBlendMode: 'screen' } as const;

  switch (kind) {
    case 'blades':
      return (
        <g style={blend} opacity={0.6} transform={`rotate(${rotation} 300 320)`}>
          {[-260, -180, -100, -20, 60, 140, 220, 300].map((offset) => (
            <line
              key={offset}
              x1={-60}
              y1={offset}
              x2={660}
              y2={offset}
              stroke={accent}
              strokeWidth={3}
              opacity={0.8}
            />
          ))}
        </g>
      );

    case 'bars':
      return (
        <g style={blend} opacity={0.72}>
          {Array.from({ length: 14 }, (_, index) => (
            <rect
              key={index}
              x={index * 44 + 10}
              y={0}
              width={index % 2 === 0 ? 15 : 7}
              height={660}
              fill={accent}
              opacity={index % 2 === 0 ? 0.45 : 0.24}
            />
          ))}
        </g>
      );

    case 'orbs':
      return (
        <g style={blend} opacity={0.7}>
          <circle cx={232} cy={292} r={134} fill={accent} opacity={0.55} />
          <circle cx={372} cy={336} r={98} fill="#ffffff" opacity={0.22} />
        </g>
      );

    case 'blocks':
      return (
        <g style={blend} opacity={0.6}>
          {(
            [
              [-1, 0],
              [0, 1],
              [1, -1],
              [0, 0],
            ] as const
          ).map(([dx, dy], index) => (
            <rect
              key={`${dx}:${dy}`}
              x={300 + dx * 124 - 72}
              y={286 + dy * 112 - 72}
              width={144}
              height={144}
              fill={index % 2 === 1 ? accent : '#ffffff'}
              opacity={index % 2 === 1 ? 0.34 : 0.16}
            />
          ))}
        </g>
      );

    case 'rings':
    default:
      return (
        <g style={blend} fill="none" opacity={0.6}>
          {[70, 120, 170, 220, 272].map((radius, index) => (
            <circle
              key={radius}
              cx={300}
              cy={306}
              r={radius}
              stroke={accent}
              strokeWidth={index % 2 === 0 ? 2 : 1}
              opacity={0.5 - index * 0.06}
            />
          ))}
        </g>
      );
  }
}

/**
 * Renders a film's poster as inline SVG.
 *
 * The artwork is generated from the film's own data (id, genres, accent colour), so it
 * is stable across reloads and needs no image host, no network and no binary assets.
 */
export function FilmPoster({ movie, variant = 'poster', className, decorative = false }: Props) {
  const rawId = useId().replace(/[^a-zA-Z0-9]/g, '');
  const uid = `${movie.id}-${rawId}`;

  const seed = hashString(movie.id);
  const rng = createRng(seed ^ 0x9e3779b9);
  const accent = movie.accent;
  const isMini = variant === 'mini';

  const buildings = buildSkyline(seed, 600, 650);
  const motif = pickMotif(movie.genres);
  const rotation = Math.round((rng() - 0.5) * 26);
  const discY = 246 + Math.round((rng() - 0.5) * 44);
  const discR = 112 + Math.round(rng() * 44);

  const sky = `sky-${uid}`;
  const spot = `spot-${uid}`;
  const win = `win-${uid}`;
  const holes = `holes-${uid}`;
  const scan = `scan-${uid}`;
  const glow = `glow-${uid}`;
  const soft = `soft-${uid}`;
  const band = `band-${uid}`;

  return (
    <svg
      className={`poster-art${className ? ` ${className}` : ''}`}
      viewBox="0 0 600 900"
      preserveAspectRatio="xMidYMid slice"
      role={decorative ? 'presentation' : 'img'}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : `${movie.title} 藝術海報`}
    >
      <defs>
        <linearGradient id={sky} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.42" />
          <stop offset="38%" stopColor="#1a1122" stopOpacity="1" />
          <stop offset="100%" stopColor="#06040a" stopOpacity="1" />
        </linearGradient>

        <radialGradient id={spot} cx="50%" cy={`${((discY / 900) * 100).toFixed(1)}%`} r="54%">
          <stop offset="0%" stopColor={accent} stopOpacity="0.52" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </radialGradient>

        <linearGradient id={band} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#06040a" stopOpacity="0" />
          <stop offset="40%" stopColor="#06040a" stopOpacity="0.88" />
          <stop offset="100%" stopColor="#06040a" stopOpacity="0.97" />
        </linearGradient>

        <pattern id={win} width="12" height="16" patternUnits="userSpaceOnUse">
          <rect width="12" height="16" fill="#0e0a16" />
          <rect x="3" y="4" width="5" height="7" fill={accent} opacity="0.34" />
        </pattern>

        <pattern id={holes} width="30" height="30" patternUnits="userSpaceOnUse">
          <rect x="6" y="7" width="16" height="16" rx="3" fill="#06040a" opacity="0.9" />
        </pattern>

        <pattern id={scan} width="6" height="5" patternUnits="userSpaceOnUse">
          <rect y="3" width="6" height="1.3" fill="#000000" opacity="0.55" />
        </pattern>

        <filter id={glow} x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="13" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id={soft} x="-60%" y="-60%" width="220%" height="220%">
          <feGaussianBlur stdDeviation="36" />
        </filter>
      </defs>

      {/* sky, glow and neon disc -------------------------------------------- */}
      <rect width="600" height="900" fill={`url(#${sky})`} />
      <rect width="600" height="900" fill={`url(#${spot})`} />
      <circle cx="300" cy={discY} r={discR} fill={accent} opacity="0.85" filter={`url(#${soft})`} />
      <circle cx="300" cy={discY} r={discR} fill={accent} opacity="0.3" />
      <circle cx="300" cy={discY} r={discR} fill="none" stroke="#ffffff" strokeWidth="1.5" opacity="0.32" />

      <Motif kind={motif} accent={accent} rotation={rotation} />

      {/* skyline ------------------------------------------------------------- */}
      <g>
        {buildings.map((building) => (
          <g key={building.x}>
            <rect
              x={building.x}
              y={building.y}
              width={building.width}
              height={building.height}
              fill={`url(#${win})`}
            />
            <rect
              x={building.x}
              y={building.y}
              width={building.width}
              height={2}
              fill={accent}
              opacity="0.55"
            />
            {building.antenna && (
              <>
                <line
                  x1={building.x + building.width / 2}
                  y1={building.y}
                  x2={building.x + building.width / 2}
                  y2={building.y - 20}
                  stroke={accent}
                  strokeWidth="2"
                  opacity="0.5"
                />
                <circle
                  cx={building.x + building.width / 2}
                  cy={building.y - 22}
                  r="2.6"
                  fill={accent}
                  opacity="0.9"
                />
              </>
            )}
          </g>
        ))}
      </g>

      {/* wet-street reflection band ----------------------------------------- */}
      <rect x="0" y="650" width="600" height="4" fill={accent} opacity="0.5" />
      <rect x="0" y="654" width="600" height="80" fill={accent} opacity="0.09" />

      {/* film-strip sprocket edges ------------------------------------------ */}
      <rect x="0" y="0" width="26" height="900" fill={accent} opacity="0.12" />
      <rect x="0" y="0" width="26" height="900" fill={`url(#${holes})`} />
      <rect x="574" y="0" width="26" height="900" fill={accent} opacity="0.12" />
      <rect x="574" y="0" width="26" height="900" fill={`url(#${holes})`} />

      {/* typography ---------------------------------------------------------- */}
      {!isMini && (
        <>
          <rect x="0" y="640" width="600" height="260" fill={`url(#${band})`} />
          <g filter={`url(#${glow})`}>
            <text
              x="300"
              y="770"
              textAnchor="middle"
              fontFamily="'Noto Sans HK', 'PingFang HK', sans-serif"
              fontSize={titleFontSize(movie.title)}
              fontWeight="900"
              fill={accent}
              letterSpacing="2"
            >
              {movie.title}
            </text>
          </g>
          <text
            x="300"
            y="770"
            textAnchor="middle"
            fontFamily="'Noto Sans HK', 'PingFang HK', sans-serif"
            fontSize={titleFontSize(movie.title)}
            fontWeight="900"
            fill="#ffffff"
            letterSpacing="2"
          >
            {movie.title}
          </text>
          <text
            x="300"
            y="812"
            textAnchor="middle"
            fontFamily="'Bebas Neue', 'Anton', sans-serif"
            fontStyle="normal"
            fontSize="23"
            fill={accent}
            letterSpacing="6"
          >
            {movie.titleEn.toUpperCase()}
          </text>
          <text
            x="300"
            y="858"
            textAnchor="middle"
            fontFamily="'Space Mono', ui-monospace, monospace"
            fontSize="15"
            fill="#cbbfae"
            letterSpacing="3"
          >
            {movie.year} · {movie.genres.slice(0, 2).join(' / ')}
          </text>
        </>
      )}

      {/* scanlines ----------------------------------------------------------- */}
      <rect width="600" height="900" fill={`url(#${scan})`} opacity="0.42" />
    </svg>
  );
}
