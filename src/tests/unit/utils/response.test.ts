import { createRequestEcho } from '../../../utils/response.js';

import type { HttpMethod } from '../../../types/index.js';
import type { Request } from 'express';
import type { Socket } from 'net';

type MockRequest = Partial<Request> & {
  headers: Record<string, string | string[] | undefined>;
  method: HttpMethod;
  path: string;
  protocol: string;
  get: jest.Mock;
  socket: Socket;
};

const createMockSocket = (overrides: Partial<Socket> = {}): Socket => ({
  remoteAddress: '127.0.0.1',
  ...overrides
} as Socket);

const createMockRequest = (overrides: Partial<MockRequest> = {}): MockRequest => ({
  headers: { 'content-type': 'application/json' },
  method: 'GET',
  path: '/test',
  query: { param: 'value' },
  body: { data: 'test' },
  protocol: 'http',
  get: jest.fn().mockReturnValue('localhost:3000'),
  originalUrl: '/test?param=value',
  socket: createMockSocket(),
  ...overrides
});

describe('createRequestEcho', () => {
  const mockDate = '2024-01-01T00:00:00.000Z';
  let mockRequest: MockRequest;

  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(new Date(mockDate));
    mockRequest = createMockRequest();
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.resetAllMocks();
  });

  it('should create a request echo with all properties', () => {
    const result = createRequestEcho(mockRequest as Request);

    expect(result).toEqual({
      headers: { 'content-type': 'application/json' },
      method: 'GET',
      origin: '127.0.0.1',
      uri: '/test',
      arguments: {
        param: 'value',
        uri: '/test'
      },
      body: { data: 'test' },
      url: 'http://localhost:3000/test?param=value',
      timestamp: mockDate
    });
  });

  it('should use socket.remoteAddress when ip is not available', () => {
    const requestWithSocket = createMockRequest({
      socket: createMockSocket({ remoteAddress: '192.168.1.1' })
    });

    const result = createRequestEcho(requestWithSocket as Request);
    expect(result.origin).toBe('192.168.1.1');
  });

  it('should fallback to "unknown" when no IP information is available', () => {
    const requestWithNoIp = createMockRequest({
      socket: createMockSocket({ remoteAddress: undefined })
    });

    const result = createRequestEcho(requestWithNoIp as Request);
    expect(result.origin).toBe('unknown');
  });

  it('should fallback to "localhost" if host header is not available', () => {
    const requestWithNoHost = createMockRequest({
      get: jest.fn().mockReturnValue(null)
    });

    const result = createRequestEcho(requestWithNoHost as Request);
    expect(result.url).toBe('http://localhost/test?param=value');
  });

  it('should handle empty query parameters', () => {
    const requestWithNoQuery = createMockRequest({
      query: {}
    });

    const result = createRequestEcho(requestWithNoQuery as Request);
    expect(result.arguments).toEqual({
      uri: '/test'
    });
  });

  it('should handle empty body', () => {
    const requestWithNoBody = createMockRequest({
      body: {}
    });

    const result = createRequestEcho(requestWithNoBody as Request);
    expect(result.body).toEqual({});
  });

  it('should include all HTTP headers', () => {
    const requestWithHeaders = createMockRequest({
      headers: {
        'content-type': 'application/json',
        'user-agent': 'test-agent',
        'authorization': 'Bearer token'
      }
    });

    const result = createRequestEcho(requestWithHeaders as Request);
    expect(result.headers).toEqual(requestWithHeaders.headers);
  });

  it('should handle IPv6 addresses', () => {
    const requestWithIpv6 = createMockRequest({
      socket: createMockSocket({ remoteAddress: '::1' })
    });

    const result = createRequestEcho(requestWithIpv6 as Request);
    expect(result.origin).toBe('::1');
  });

  it('should handle missing originalUrl', () => {
    const requestWithoutOriginalUrl = createMockRequest({
      originalUrl: '/test' 
    });
    
    requestWithoutOriginalUrl.get.mockReturnValue('localhost:3000');

    const result = createRequestEcho(requestWithoutOriginalUrl as Request);
    expect(result.url).toBe('http://localhost:3000/test');
  });

  it('should handle requests behind a proxy', () => {
    const requestBehindProxy = createMockRequest({
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '10.0.0.1',
        'x-forwarded-proto': 'https'
      }
    });

    const result = createRequestEcho(requestBehindProxy as Request);
    expect(result.headers?.['x-forwarded-for']).toBe('10.0.0.1');
    expect(result.headers?.['x-forwarded-proto']).toBe('https');
  });
});
