import { Request, Response } from 'express';

import { verifyJsonFormat } from '../../../middleware/jsonValidator.js';
import { BadRequestError } from '../../../types/index.js';

describe('JSON Validator Middleware', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  const mockEncoding = 'utf8';

  beforeEach(() => {
    mockRequest = {
      path: '/test'
    } as Partial<Request>;
    mockResponse = {} as Partial<Response>;
  });

  it('should accept valid JSON', () => {
    const validJson = '{"test": "data"}';
    const buffer = Buffer.from(validJson);

    expect(() => 
      verifyJsonFormat(
        mockRequest as Request,
        mockResponse as Response,
        buffer,
        mockEncoding
      )
    ).not.toThrow();
  });

  it('should throw BadRequestError for invalid JSON', () => {
    const invalidJson = '{"test": "data"'; 
    const buffer = Buffer.from(invalidJson);

    expect(() => 
      verifyJsonFormat(
        mockRequest as Request,
        mockResponse as Response,
        buffer,
        mockEncoding
      )
    ).toThrow(BadRequestError);
  });

  it('should throw BadRequestError with correct message', () => {
    const invalidJson = 'not json at all';
    const buffer = Buffer.from(invalidJson);

    expect(() => 
      verifyJsonFormat(
        mockRequest as Request,
        mockResponse as Response,
        buffer,
        mockEncoding
      )
    ).toThrow('Invalid JSON format');
  });

  it('should accept empty JSON object', () => {
    const emptyJson = '{}';
    const buffer = Buffer.from(emptyJson);

    expect(() => 
      verifyJsonFormat(
        mockRequest as Request,
        mockResponse as Response,
        buffer,
        mockEncoding
      )
    ).not.toThrow();
  });

  it('should accept JSON array', () => {
    const jsonArray = '[1,2,3]';
    const buffer = Buffer.from(jsonArray);

    expect(() => 
      verifyJsonFormat(
        mockRequest as Request,
        mockResponse as Response,
        buffer,
        mockEncoding
      )
    ).not.toThrow();
  });
});
