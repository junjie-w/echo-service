#!/usr/bin/env node
import { createServer } from './index.js';

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;

const server = createServer(port);

process.on('SIGINT', () => {
  console.log('\nShutting down server...');
  server.close(() => {
    console.log('Server stopped');
    process.exit(0);
  });
});

console.log(`
🚀 Echo Service CLI
==================
Server running at http://localhost:${port}

Available endpoints:
- GET  /        → Service info
- GET  /health  → Health check
- ALL  /echo    → Request echo

Press Ctrl+C to stop
`);
