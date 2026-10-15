import { pathToFileURL } from 'node:url';
import type { DatabaseSync } from 'node:sqlite';
import { seedMovies } from '../data/movies.ts';
import { closeDb, getDb } from './connection.ts';
import { createSchema } from './schema.ts';

/**
 * Writes the curated seed dataset into SQLite.
 *
 * Runs on the first boot (when the table is empty) and can be re-run at any time with
 * `npm run seed -- --reset` to restore a clean dataset.
 */
export function seedDatabase(db: DatabaseSync, options: { reset?: boolean } = {}): number {
  const { reset = false } = options;

  if (reset) db.exec('DELETE FROM movies');

  const insert = db.prepare(`
    INSERT OR REPLACE INTO movies (
      id, title, title_en, year, decade, director,
      cast_json, genres_json, runtime, rating, language,
      tagline, synopsis, accent,
      moods_json, locations_json, featured
    ) VALUES (
      $id, $title, $title_en, $year, $decade, $director,
      $cast_json, $genres_json, $runtime, $rating, $language,
      $tagline, $synopsis, $accent,
      $moods_json, $locations_json, $featured
    )
  `);

  for (const movie of seedMovies) {
    insert.run({
      id: movie.id,
      title: movie.title,
      title_en: movie.titleEn,
      year: movie.year,
      decade: movie.decade,
      director: movie.director,
      cast_json: JSON.stringify(movie.cast),
      genres_json: JSON.stringify(movie.genres),
      runtime: movie.runtime,
      rating: movie.rating,
      language: movie.language,
      tagline: movie.tagline,
      synopsis: movie.synopsis,
      accent: movie.accent,
      moods_json: JSON.stringify(movie.moods),
      locations_json: JSON.stringify(movie.locations),
      featured: movie.featured ? 1 : 0,
    });
  }

  return seedMovies.length;
}

export function countMovies(db: DatabaseSync): number {
  const row = db.prepare('SELECT COUNT(*) AS total FROM movies').get() as { total: number };
  return row.total;
}

/** CLI entry: `node src/db/seed.ts [--reset]`. */
function runAsScript(): void {
  const reset = process.argv.includes('--reset');
  const db = getDb();
  createSchema(db);
  const inserted = seedDatabase(db, { reset });
  console.log(`[seed] ${inserted} movies written to SQLite (reset=${reset}). Total rows: ${countMovies(db)}`);
  closeDb();
}

// Only execute when this file is run directly, not when imported by the app bootstrapper.
const entry = process.argv[1];
if (entry && import.meta.url === pathToFileURL(entry).href) {
  runAsScript();
}
