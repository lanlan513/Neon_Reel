import type { DatabaseSync } from 'node:sqlite';

/**
 * Schema for the MVP.
 *
 * Multi-valued fields (cast, genres, moods, locations) are stored as JSON columns:
 * the MVP only ever reads a whole movie at a time, so joining into separate tables
 * would add complexity without benefit. When credit-aware features land (director
 * profiles, person relationships), these can be promoted to real tables without
 * changing the API contract.
 */
export const SCHEMA_SQL = `
CREATE TABLE IF NOT EXISTS movies (
  id             TEXT PRIMARY KEY,
  title          TEXT    NOT NULL,
  title_en       TEXT    NOT NULL,
  year           INTEGER NOT NULL,
  decade         INTEGER NOT NULL,
  director       TEXT    NOT NULL,
  cast_json      TEXT    NOT NULL DEFAULT '[]',
  genres_json    TEXT    NOT NULL DEFAULT '[]',
  runtime        INTEGER NOT NULL,
  rating         REAL    NOT NULL,
  language       TEXT    NOT NULL,
  tagline        TEXT    NOT NULL DEFAULT '',
  synopsis       TEXT    NOT NULL DEFAULT '',
  accent         TEXT    NOT NULL DEFAULT '#ff2e88',
  moods_json     TEXT    NOT NULL DEFAULT '[]',
  locations_json TEXT    NOT NULL DEFAULT '[]',
  featured       INTEGER NOT NULL DEFAULT 0,
  created_at     TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_movies_year    ON movies(year);
CREATE INDEX IF NOT EXISTS idx_movies_decade  ON movies(decade);
CREATE INDEX IF NOT EXISTS idx_movies_title   ON movies(title);
CREATE INDEX IF NOT EXISTS idx_movies_titleen ON movies(title_en);
`;

/** Creates the schema if it does not exist yet. Safe to call on every boot. */
export function createSchema(db: DatabaseSync): void {
  db.exec(SCHEMA_SQL);
}
