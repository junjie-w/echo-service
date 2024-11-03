import { Request, Response } from 'express';
import { logger } from '../utils/logger.js';
import type { ErrorResponse } from '../types/index.js';

export const notFoundHandler = (req: Request, res: Response) => {
  logger.warn({
    method: req.method,
    url: req.url,
    message: 'Route not found'
  });

  const errorResponse: ErrorResponse = {
    error: {
      message: 'Not Found',
      timestamp: new Date().toISOString(),
      path: req.path
    }
  };

  res.status(404).json(errorResponse);
};
