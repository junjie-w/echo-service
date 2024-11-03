import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger.js';
import type { ErrorResponse } from '../types/index.js';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  _next: NextFunction
) => {
  logger.error({
    err,
    method: req.method,
    url: req.url,
    requestId: req.headers['x-request-id'] || 'unknown',
  });

  const errorResponse: ErrorResponse = {
    error: {
      message: process.env.NODE_ENV === 'production' 
        ? 'Internal Server Error' 
        : err.message,
      timestamp: new Date().toISOString(),
      requestId: req.headers['x-request-id']?.toString(),
      path: req.path
    }
  };

  res.status(500).json(errorResponse);
};
