import { createServer } from '@junjie-wu/echo-service';

const port = process.env.PORT || 3001;

try {
  const server = createServer(port);

  console.log(`
🚀 Echo Service Library Example
=============================
Server running at http://localhost:${port}

Available endpoints:
- GET  /        → Service info
- GET  /health  → Health check
- ALL  /echo    → Request echo

Press Ctrl+C to stop
`);

  process.on('SIGINT', () => {
    console.log('\nShutting down server...');
    server.close(() => {
      console.log('Server stopped');
      process.exit(0);
    });
  });

} catch (error) {
  if (error.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${port} is already in use!`);
    console.log('Try using a different port:\n');
    console.log('PORT=3004 npm start\n');
  } else {
    console.error('Error starting server:', error);
  }
  process.exit(1);
}
