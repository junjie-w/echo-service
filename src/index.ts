/* istanbul ignore file */

import app from './app.js';

import type { Server } from 'http';

export { default as app } from './app.js';
export * from './types/index.js';
export { createRequestEcho } from './utils/response.js';
export { measureExecutionTime } from './utils/timing.js';

export const createServer = (port: number = 3000): Server => {
  const server = app.listen(port, () => {
    console.log(`Echo service listening at http://localhost:${port}`);
  });
  
  return server;
};
