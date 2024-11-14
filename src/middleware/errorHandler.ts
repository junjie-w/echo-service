import { HttpError } from '../types/index.js';
import { logger } from '../utils/logger.js';

import type { ErrorResponse } from '../types/index.js';
import type { NextFunction, Request, Response } from 'express';

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

  if (err instanceof SyntaxError && 'body' in err) {
    const errorResponse: ErrorResponse = {
      error: {
        message: 'Invalid JSON format',
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id']?.toString(),
        path: req.path
      }
    };
    return res.status(400).json(errorResponse);
  }
  
  if (err instanceof HttpError) {
    const errorResponse: ErrorResponse = {
      error: {
        message: process.env.NODE_ENV === 'production' 
          ? err.statusCode === 500 ? 'Internal Server Error' : err.message
          : err.message,
        timestamp: new Date().toISOString(),
        requestId: req.headers['x-request-id']?.toString(),
        path: req.path
      }
    };
    return res.status(err.statusCode).json(errorResponse);
  }

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
