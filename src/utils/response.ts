import type { Request } from 'express';
import type { HttpMethod, RequestEcho } from '../types/index.js';

export const createRequestEcho = (req: Request): RequestEcho => ({
  headers: req.headers,
  method: req.method as HttpMethod, 
  origin: req.ip ?? req.socket.remoteAddress ?? 'unknown',
  uri: req.path,
  arguments: {
    ...req.query,
    uri: req.path,
  },
  body: req.body,
  url: `${req.protocol}://${req.get('host') ?? 'localhost'}${req.originalUrl}`,
  timestamp: new Date().toISOString(),
});