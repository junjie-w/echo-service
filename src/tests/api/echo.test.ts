import { execSync } from 'node:child_process';

import request from 'supertest';

const API_URL = process.env.API_URL || 'http://localhost:3001';

const waitForServer = async (url: string, maxAttempts = 10): Promise<void> => {
  for (let i = 0; i < maxAttempts; i++) {
    try {
      await request(url).get('/health');
      console.log('Server is ready!');
      return;
    } catch (error) {
      console.log(
        `Attempt ${i + 1}/${maxAttempts} to connect to server... Error: ${
          error instanceof Error ? error.message : String(error)
        }`
      );      
      if (i === maxAttempts - 1) {
        throw new Error(`Server failed to start after ${maxAttempts} attempts`);
      }
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

describe('Echo Service E2E Tests', () => {
  jest.setTimeout(30000); 

  beforeAll(async () => {
    if (!process.env.API_URL) {
      try {
        console.log('Building the application...');
        execSync('npm run build', { stdio: 'inherit' });

        console.log('Starting the server...');
        if (process.platform === 'win32') {
          execSync('start /B cross-env PORT=3001 NODE_ENV=test node dist/server.js', {
            stdio: 'inherit',
            shell: 'true'
          });
        } else {
          execSync('cross-env PORT=3001 NODE_ENV=test node dist/server.js &', {
            stdio: 'inherit',
            shell: '/bin/bash'
          });
        }
        
        console.log('Waiting for server to be ready...');
        await waitForServer(API_URL);
      } catch (error) {
        console.error('Failed to start server:', error);
        throw error;
      }
    }
  }, 30000); 

  afterAll(async () => {
    if (!process.env.API_URL) {
      try {
        console.log('Stopping the server...');
        if (process.platform === 'win32') {
          execSync('taskkill /F /IM node.exe', { stdio: 'inherit' });
        } else {
          execSync('pkill -f "node dist/server.js" || true', { 
            stdio: 'inherit',
            shell: '/bin/bash'
          });
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log('Server stopped successfully');
      } catch (error) {
        console.error('Failed to stop server:', error);
      }
    }
  }, 10000); 

  describe('Basic API Health', () => {
    it('should be healthy', async () => {
      const response = await request(API_URL)
        .get('/health')
        .expect(200);
      
      expect(response.body).toEqual(expect.objectContaining({
        status: 'healthy',
        uptime: expect.any(Number)
      }));
    });

    it('should handle basic request-response cycle', async () => {
      const testData = { test: 'basic-cycle' };
      const response = await request(API_URL)
        .post('/echo')
        .send(testData)
        .expect(200);

      expect(response.body.requestEcho.body).toEqual(testData);
      expect(response.body.totalProcessingTime).toBeDefined();
    });
  });

  describe('API Reliability', () => {
    it('should handle parallel requests', async () => {
      const requests = Array(5).fill(null).map((_, index) => 
        request(API_URL)
          .post('/echo')
          .send({ test: `parallel-${index}` })
      );
      
      const responses = await Promise.all(requests);
      responses.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.body.requestEcho.body.test).toBe(`parallel-${index}`);
      });
    });

    // Your existing performance test can stay here
    it('should maintain response time under threshold', async () => {
      const startTime = Date.now();
      await request(API_URL)
        .get('/echo')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(200);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', async () => {
      const response = await request(API_URL)
        .post('/echo')
        .set('Content-Type', 'application/json')
        .send('{"invalid": "json"') 
        .expect(400);
  
      expect(response.body).toEqual(expect.objectContaining({
        error: expect.objectContaining({
          message: expect.stringMatching(/invalid json/i)
        })
      }));
    });
  
    it('should handle large payloads', async () => {
      const largeObject = {
        array: Array(1000).fill('test')
      };
  
      await request(API_URL)
        .post('/echo')
        .send(largeObject)
        .expect(200);
    });
  });

  describe('External API Tests', () => {
    it('should handle high load', async () => {
      const requests = Array(10).fill(null).map(() => 
        request(API_URL)
          .post('/echo')
          .send({ test: 'load' })
      );
      
      const responses = await Promise.all(requests);
      responses.forEach(response => {
        expect(response.status).toBe(200);
      });
    }, 10000); 

    it('should maintain response time under threshold', async () => {
      const startTime = Date.now();
      
      await request(API_URL)
        .get('/echo')
        .expect(200);
      
      const responseTime = Date.now() - startTime;
      expect(responseTime).toBeLessThan(200);
    }, 10000); 
  });
});
