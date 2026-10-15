import express from 'express';
import cors from 'cors';
import { config } from './config.ts';
import { metaRouter } from './routes/meta.ts';
import { moviesRouter } from './routes/movies.ts';
import { errorHandler, notFoundHandler } from './middleware/errors.ts';

/**
 * Assembles the Express application. Kept separate from `index.ts` so tests (or a
 * future serverless handler) can import the app without binding a port.
 */
export function createApp(): express.Express {
  const app = express();

  app.disable('x-powered-by');
  app.use(cors({ origin: config.corsOrigins }));
  app.use(express.json());

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', service: 'neon-reel-api', time: new Date().toISOString() });
  });

  app.use('/api/movies', moviesRouter);
  app.use('/api/meta', metaRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
