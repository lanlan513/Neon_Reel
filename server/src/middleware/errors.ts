import type { NextFunction, Request, Response } from 'express';

/** Uniform error payload shape used across the API. */
export interface ApiError {
  error: { code: string; message: string };
}

/** Catches requests that matched no route. */
export function notFoundHandler(req: Request, res: Response): void {
  const body: ApiError = {
    error: { code: 'NOT_FOUND', message: `没有找到 ${req.method} ${req.originalUrl} 对应的接口。` },
  };
  res.status(404).json(body);
}

/** Final error boundary — never leaks stack traces to clients. */
export function errorHandler(err: unknown, _req: Request, res: Response, _next: NextFunction): void {
  console.error('[api] unhandled error:', err);
  const body: ApiError = {
    error: { code: 'INTERNAL_ERROR', message: '服务器内部错误，请稍后再试。' },
  };
  res.status(500).json(body);
}
