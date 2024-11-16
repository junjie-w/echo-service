import { NextFunction, Request, Response } from 'express';

import { errorHandler } from '../../../middleware/errorHandler.js';
import { HttpError } from '../../../types/index.js';
import { logger } from '../../../utils/logger.js';

jest.mock('../../../utils/logger.js');

describe('errorHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let nextFunction: NextFunction;
  const mockDate = '2024-01-01T00:00:00.000Z';
  const originalEnv = process.env.NODE_ENV;

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
    process.env.NODE_ENV = originalEnv;
  });

  // it('should handle errors in production mode', () => {
  //   process.env.NODE_ENV = 'production';
  //   const error = new Error('Test error');

  //   errorHandler(
  //     error,
  //     mockRequest as Request,
  //     mockResponse as Response,
  //     nextFunction
  //   );

  //   expect(mockResponse.status).toHaveBeenCalledWith(500);
  //   expect(mockResponse.json).toHaveBeenCalledWith({
  //     error: {
  //       message: 'Internal Server Error',
  //       timestamp: mockDate,
  //       path: '/test',
  //       requestId: undefined
  //     }
  //   });

  //   expect(logger.error).toHaveBeenCalledWith({
  //     err: error,
  //     method: 'GET',
  //     url: '/test',
  //     requestId: 'unknown'
  //   });
  // });

  // it('should handle errors in development mode', () => {
  //   process.env.NODE_ENV = 'development';
  //   const error = new Error('Test error');

  //   errorHandler(
  //     error,
  //     mockRequest as Request,
  //     mockResponse as Response,
  //     nextFunction
  //   );

  //   expect(logger.error).toHaveBeenCalledWith({
  //     err: error,
  //     method: 'GET',
  //     url: '/test',
  //     requestId: 'unknown'
  //   });

  //   expect(mockResponse.json).toHaveBeenCalledWith({
  //     error: {
  //       message: error.message,
  //       timestamp: mockDate,
  //       path: '/test',
  //       requestId: undefined
  //     }
  //   });
  // });
  describe('HttpError handling in production mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production';
    });

    it('should show "Internal Server Error" for 500 HttpError', () => {
      const error = new HttpError(500, 'Original 500 error message');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Internal Server Error',
          timestamp: mockDate,
          path: '/test',
          requestId: undefined
        }
      });
    });

    it('should show original message for non-500 HttpError', () => {
      const error = new HttpError(400, 'Bad Request Message');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Bad Request Message', // Original message should be shown
          timestamp: mockDate,
          path: '/test',
          requestId: undefined
        }
      });
    });

    it('should show original message for 501 HttpError', () => {
      const error = new HttpError(501, 'Not Implemented');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(501);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Not Implemented', // Original message should be shown
          timestamp: mockDate,
          path: '/test',
          requestId: undefined
        }
      });
    });
  });

  describe('HttpError handling in development mode', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'development';
    });

    it('should always show original message for 500 HttpError', () => {
      const error = new HttpError(500, 'Original 500 error message');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Original 500 error message',
          timestamp: mockDate,
          path: '/test',
          requestId: undefined
        }
      });
    });

    it('should show original message for non-500 HttpError', () => {
      const error = new HttpError(400, 'Bad Request Message');

      errorHandler(
        error,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Bad Request Message',
          timestamp: mockDate,
          path: '/test',
          requestId: undefined
        }
      });
    });
  });

  it('should include request ID when available', () => {
    const requestId = 'test-request-id';
    const requestWithId = {
      ...mockRequest,
      headers: {
        'x-request-id': requestId
      }
    };

    const error = new Error('Test error');

    errorHandler(
      error,
      requestWithId as Request,
      mockResponse as Response,
      nextFunction
    );

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: error.message,
        timestamp: mockDate,
        path: '/test',
        requestId: requestId
      }
    });

    expect(logger.error).toHaveBeenCalledWith({
      err: error,
      method: 'GET',
      url: '/test',
      requestId: requestId
    });
  });

  describe('edge cases', () => {
    it('should handle errors with undefined messages', () => {
      const errorWithoutMessage = new Error();
      process.env.NODE_ENV = 'development';

      errorHandler(
        errorWithoutMessage,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: '',
          timestamp: mockDate,
          path: '/test',
          requestId: undefined
        }
      });
    });

    it('should handle malformed request IDs', () => {
      const requestWithMalformedId = {
        ...mockRequest,
        headers: {
          'x-request-id': ['multiple', 'ids']
        }
      };

      const error = new Error('Test error');

      errorHandler(
        error,
        requestWithMalformedId as unknown as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: error.message,
          timestamp: mockDate,
          path: '/test',
          requestId: 'multiple,ids' 
        }
      });
    });

    it('should handle SyntaxError with body property', () => {
      const syntaxError = new SyntaxError('Invalid JSON');
      (syntaxError as SyntaxError & { body: string }).body = '{"invalid": "json"';

      errorHandler(
        syntaxError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Invalid JSON format',
          timestamp: mockDate,
          path: '/test',
          requestId: undefined
        }
      });
    });
    it('should handle HttpError in production mode', () => {
      process.env.NODE_ENV = 'production';
      const httpError = new HttpError(404, 'Not Found');

      errorHandler(
        httpError,
        mockRequest as Request,
        mockResponse as Response,
        nextFunction
      );

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: httpError.message,
          timestamp: mockDate,
          path: '/test',
          requestId: undefined
        }
      });
    });

    it('should handle errors with custom properties', () => {
      process.env.NODE_ENV = 'production';

      class CustomError extends Error {
        constructor(message: string, public code: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      const customError = new CustomError('Custom error', 'CUSTOM_ERROR');

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

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Internal Server Error',
          timestamp: mockDate,
          path: '/test',
          requestId: undefined
        }
      });
    });
  });
});
