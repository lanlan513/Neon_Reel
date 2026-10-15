import { createApp } from './app.ts';
import { config } from './config.ts';
import { initializeDatabase } from './db/bootstrap.ts';
import { closeDb } from './db/connection.ts';

const { seeded, total } = initializeDatabase();
console.log(`[db] SQLite ready at ${config.dbPath} (${total} movies${seeded ? ', seeded on boot' : ''}).`);

const app = createApp();

const server = app.listen(config.port, () => {
  console.log(`[api] Neon Reel API listening on http://localhost:${config.port}`);
  console.log(`[api] try http://localhost:${config.port}/api/movies?search=重庆`);
});

server.on('error', (error: NodeJS.ErrnoException) => {
  if (error.code === 'EADDRINUSE') {
    console.error(
      `[api] Port ${config.port} is already in use. Stop the other process or start with PORT=<other-port>.`,
    );
    process.exit(1);
  }
  throw error;
});

function shutdown(signal: string): void {
  console.log(`\n[api] ${signal} received — closing server.`);
  server.close(() => {
    closeDb();
    process.exit(0);
  });
}

process.on('SIGINT', () => shutdown('SIGINT'));
process.on('SIGTERM', () => shutdown('SIGTERM'));
