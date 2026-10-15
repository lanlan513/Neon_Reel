import fs from 'node:fs';
import path from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import { config } from '../config.ts';

let instance: DatabaseSync | null = null;

/**
 * Lazily opens the SQLite database (Node's built-in `node:sqlite`, no native build step).
 * WAL mode + foreign keys keep the door open for the relational features planned next
 * (directors, cast credits, filming locations).
 */
export function getDb(): DatabaseSync {
  if (instance) return instance;

  fs.mkdirSync(path.dirname(config.dbPath), { recursive: true });

  const db = new DatabaseSync(config.dbPath);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  instance = db;
  return db;
}

/** Closes the connection — used by scripts that must release the file handle. */
export function closeDb(): void {
  instance?.close();
  instance = null;
}
