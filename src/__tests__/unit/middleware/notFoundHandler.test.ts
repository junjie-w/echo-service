import { notFoundHandler } from '../../../middleware/notFoundHandler.js';
import { logger } from '../../../utils/logger.js';

import type { Request, Response } from 'express';

jest.mock('../../../utils/logger.js');

describe('notFoundHandler', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
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

    jest.clearAllMocks();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should handle 404 errors', () => {
    notFoundHandler(mockRequest as Request, mockResponse as Response);

    expect(logger.warn).toHaveBeenCalledWith({
      method: 'GET',
      url: '/test',
      message: 'Route not found'
    });

    expect(mockResponse.status).toHaveBeenCalledWith(404);
    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Not Found',
        timestamp: mockDate,
        path: '/test'
      }
    });
  });

  it('should handle different HTTP methods', () => {
    const postRequest = {
      ...mockRequest,
      method: 'POST'
    };

    notFoundHandler(postRequest as Request, mockResponse as Response);

    expect(logger.warn).toHaveBeenCalledWith({
      method: 'POST',
      url: '/test',
      message: 'Route not found'
    });
  });

  it('should handle requests with query parameters', () => {
    const requestWithQuery = {
      ...mockRequest,
      url: '/test?param=value',
      path: '/test'
    };

    notFoundHandler(requestWithQuery as Request, mockResponse as Response);

    expect(logger.warn).toHaveBeenCalledWith({
      method: 'GET',
      url: '/test?param=value',
      message: 'Route not found'
    });

    expect(mockResponse.json).toHaveBeenCalledWith({
      error: {
        message: 'Not Found',
        timestamp: mockDate,
        path: '/test'
      }
    });
  });

  describe('edge cases', () => {
    it('should handle requests with empty path', () => {
      const requestWithEmptyPath = {
        ...mockRequest,
        path: '',
        url: ''
      };

      notFoundHandler(
        requestWithEmptyPath as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Not Found',
          timestamp: mockDate,
          path: ''
        }
      });
    });

    it('should handle requests when path is not in req object', () => {
      const requestWithoutPath = {
        method: mockRequest.method,
        url: mockRequest.url,
        headers: mockRequest.headers
      };
      
      notFoundHandler(
        requestWithoutPath as unknown as Request,
        mockResponse as Response
      );

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Not Found',
          timestamp: mockDate,
          path: undefined
        }
      });
    });

    it('should handle requests with unicode paths', () => {
      const requestWithUnicode = {
        method: mockRequest.method,
        headers: mockRequest.headers,
        path: '/café/König',
        url: '/café/König'
      };

      notFoundHandler(
        requestWithUnicode as Request,
        mockResponse as Response
      );

      expect(logger.warn).toHaveBeenCalledWith({
        method: 'GET',
        url: '/café/König',
        message: 'Route not found'
      });
    });

    it('should handle requests with special characters', () => {
      const requestWithSpecialChars = {
        method: mockRequest.method,
        headers: mockRequest.headers,
        path: '/über/straße',
        url: '/über/straße'
      };

      notFoundHandler(
        requestWithSpecialChars as Request,
        mockResponse as Response
      );

      expect(logger.warn).toHaveBeenCalledWith({
        method: 'GET',
        url: '/über/straße',
        message: 'Route not found'
      });
    });

    it('should handle requests with encoded URI components', () => {
      const requestWithEncodedChars = {
        method: mockRequest.method,
        headers: mockRequest.headers,
        path: '/with spaces/and%20symbols',
        url: '/with spaces/and%20symbols'
      };

      notFoundHandler(
        requestWithEncodedChars as Request,
        mockResponse as Response
      );

      expect(logger.warn).toHaveBeenCalledWith({
        method: 'GET',
        url: '/with spaces/and%20symbols',
        message: 'Route not found'
      });
    });

    it('should handle requests with encoded characters', () => {
      const requestWithEncoded = {
        ...mockRequest,
        path: '/test%20path',
        url: '/test%20path'
      };

      notFoundHandler(
        requestWithEncoded as Request,
        mockResponse as Response
      );

      expect(logger.warn).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test%20path',
        message: 'Route not found'
      });
    });

    it('should handle requests with minimal required properties', () => {
      const minimalRequest = {
        method: 'GET',
        url: '/test'
      };

      notFoundHandler(
        minimalRequest as unknown as Request,
        mockResponse as Response
      );

      expect(logger.warn).toHaveBeenCalledWith({
        method: 'GET',
        url: '/test',
        message: 'Route not found'
      });

      expect(mockResponse.json).toHaveBeenCalledWith({
        error: {
          message: 'Not Found',
          timestamp: mockDate,
          path: undefined
        }
      });
    });
  });
});
