import type { NextFunction, Request, Response } from 'express';
import { NotFoundError } from '../errors/not-found-error';

export const notFoundHandler = (req: Request, _res: Response, next: NextFunction): void => {
  const error = new NotFoundError(`Route ${req.method} ${req.originalUrl} not found`);
  next(error);
};
