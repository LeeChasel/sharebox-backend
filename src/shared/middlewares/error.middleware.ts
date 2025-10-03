import type { NextFunction, Request, Response } from 'express';
import { env } from '../../config/env';
import { AppError } from '../errors/app-error';
import type { ErrorResponse } from '../types/error-response.types';

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (res.headersSent) {
    next(err);
    return;
  }

  let error = err;

  if (!(error instanceof AppError)) {
    error = new AppError(
      error.message || 'Internal Server Error',
      500,
      'INTERNAL_ERROR',
      undefined,
      false,
    );
  }

  const appError = error as AppError;

  logError(appError, req);

  const errorResponse: ErrorResponse = {
    success: false,
    message: appError.message,
    error: {
      code: appError.code,
      details: appError.details,
    },
    timestamp: new Date().toISOString(),
    path: req.path,
  };

  if (env.NODE_ENV === 'development') {
    errorResponse.error.stack = appError.stack;
  }

  res.status(appError.statusCode).json(errorResponse);
};

function logError(error: AppError, req: Request): void {
  if (!error.isOperational) {
    console.error('Unexpected Error:', {
      message: error.message,
      code: error.code,
      statusCode: error.statusCode,
      stack: error.stack,
      path: req.path,
      method: req.method,
      body: req.body,
      query: req.query,
      params: req.params,
    });
  } else {
    console.log(`Operational Error: [${error.code}] ${error.message}`);
  }
}
