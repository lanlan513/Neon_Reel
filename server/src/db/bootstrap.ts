import { getDb } from './connection.ts';
import { createSchema } from './schema.ts';
import { countMovies, seedDatabase } from './seed.ts';

/**
 * Prepares the database on server start: applies the schema and, when the table is
 * empty, loads the seed dataset. This means `npm run dev` works on a fresh clone with
 * no manual setup step, while `npm run seed -- --reset` stays available for a clean slate.
 */
export function initializeDatabase(): { seeded: boolean; total: number } {
  const db = getDb();
  createSchema(db);

  const existing = countMovies(db);
  if (existing > 0) {
    return { seeded: false, total: existing };
  }

  const inserted = seedDatabase(db);
  return { seeded: true, total: inserted };
}
