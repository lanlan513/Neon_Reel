import { Router } from 'express';
import { movieService } from '../services/movieService.ts';

export const metaRouter = Router();

/**
 * Genre and decade facets plus the dataset size. Powers the home page rails today and
 * is the natural data source for the planned genre-filter and era-topic pages.
 */
metaRouter.get('/', (_req, res) => {
  res.json(movieService.getMeta());
});
