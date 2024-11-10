import { errorHandler } from '../../../middleware/errorHandler.js';
import { logger } from '../../../utils/logger.js';

import type { NextFunction, Request, Response } from 'express';

jest.mock('../../../utils/logger.js');

describe('errorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  const mockDate = '2024-01-01T00:00:00.000Z';

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(mockDate));

    mockRequest = {
      method: 'GET',
      url: '/test',
      path: '/test',
      headers: {}
    };

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };

    nextFunction = jest.fn();

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should handle errors in production mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const error = new Error('Test error');
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(logger.error).toHaveBeenCalledWith({
      err: error,
      method: 'GET',
      url: '/test',
      requestId: 'unknown'
    });

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Internal Server Error',
        timestamp: mockDate,
        requestId: undefined,
        path: '/test'
      }
    });

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should handle errors in development mode', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'development';

    const error = new Error('Test error');
    errorHandler(
      error,
      mockRequest as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(logger.error).toHaveBeenCalledWith({
      err: error,
      method: 'GET',
      url: '/test',
      requestId: 'unknown'
    });

    expect(mockResponse.status).toHaveBeenCalledWith(500);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Test error',
        timestamp: mockDate,
        requestId: undefined,
        path: '/test'
      }
    });

    process.env.NODE_ENV = originalNodeEnv;
  });

  it('should include request ID when available', () => {
    const requestWithId = {
      ...mockRequest,
      headers: {
        'x-request-id': 'test-request-id'
      }
    };

    const error = new Error('Test error');
    errorHandler(
      error,
      requestWithId as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(logger.error).toHaveBeenCalledWith({
      err: error,
      method: 'GET',
      url: '/test',
      requestId: 'test-request-id'
    });

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: expect.any(String),
        timestamp: mockDate,
        requestId: 'test-request-id',
        path: '/test'
      }
    });
  });

  describe('edge cases', () => {
    it('should handle errors with undefined messages', () => {
      const errorWithoutMessage = new Error();
      errorHandler(
        errorWithoutMessage,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: process.env.NODE_ENV === 'production' 
            ? 'Internal Server Error' 
            : '',
          timestamp: mockDate,
          requestId: undefined,
          path: '/test'
        }
      });
    });

    it('should handle malformed request IDs', () => {
      const requestWithBadId = {
        ...mockRequest,
        headers: {
          'x-request-id': ['multiple', 'ids']
        }
      };

      errorHandler(
        new Error('test'),
        requestWithBadId as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: expect.any(String),
          timestamp: mockDate,
          requestId: 'multiple,ids',
          path: '/test'
        }
      });
    });

    it('should handle errors with custom properties', () => {
      class CustomError extends Error {
        constructor(message: string, public code: number) {
          super(message);
          this.name = 'CustomError';
        }
      }

      const customError = new CustomError('Custom error', 500);
      errorHandler(
        customError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(logger.error).toHaveBeenCalledWith({
        err: customError,
        method: 'GET',
        url: '/test',
        requestId: 'unknown'
      });
    });
  });
});
