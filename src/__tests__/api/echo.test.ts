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
    it('should have healthy status', async () => {
      const response = await request(API_URL)
        .get('/health')
        .expect(200);
      
      expect(response.body).toEqual(expect.objectContaining({
        status: 'healthy',
        uptime: expect.any(Number)
      }));
    });

    it('should handle basic echo request', async () => {
      const testData = { test: 'basic-cycle' };
      const response = await request(API_URL)
        .post('/echo')
        .send(testData)
        .expect(200);

      expect(response.body.requestEcho.body).toEqual(testData);
      expect(response.body.totalProcessingTime).toBeDefined();
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

  describe('Performance and Load Testing', () => {
    const PERFORMANCE_THRESHOLD = 200;

    it('should handle parallel requests with consistent results', async () => {
      const NUM_PARALLEL = 5;
      const requests = Array(NUM_PARALLEL).fill(null).map((_, index) => 
        request(API_URL)
          .post('/echo')
          .send({ test: `parallel-${index}` })
      );
    
      const startTime = Date.now();
      const responses = await Promise.all(requests);
      const totalTime = Date.now() - startTime;

      responses.forEach((response, index) => {
        expect(response.status).toBe(200);
        expect(response.body.requestEcho.body.test).toBe(`parallel-${index}`);
      });

      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLD * 2);
    
      console.log('Parallel requests completed in:', totalTime, 'ms');
    });

    it('should handle different HTTP methods concurrently', async () => {
      type HttpMethod = 'get' | 'post' | 'put' | 'delete' | 'patch';
      const methods: HttpMethod[] = ['get', 'post', 'put', 'delete', 'patch'];
      
      const startTime = Date.now();
      
      const responses = await Promise.all(methods.map(method => {
        const req = request(API_URL);
        switch (method) {
        case 'get':
          return req.get('/echo');
        case 'post':
          return req.post('/echo').send({ test: 'post' });
        case 'put':
          return req.put('/echo').send({ test: 'put' });
        case 'delete':
          return req.delete('/echo');
        case 'patch':
          return req.patch('/echo').send({ test: 'patch' });
        }
      }));
  
      const totalTime = Date.now() - startTime;
      
      expect(responses.every(r => r.status === 200)).toBe(true);
      expect(totalTime).toBeLessThan(PERFORMANCE_THRESHOLD * 2);
      
      console.log('Mixed methods test completed in:', totalTime, 'ms');
    });
  
    it('should maintain consistent response time under load', async () => {
      const NUM_REQUESTS = 10;
      const requests = Array(NUM_REQUESTS).fill(null).map(async (_, index) => {
        const startTime = Date.now();
        const response = await request(API_URL)
          .post('/echo')
          .send({ test: `load-${index}` });
          
        return {
          status: response.status,
          responseTime: Date.now() - startTime
        };
      });
      
      const results = await Promise.all(requests);
      
      const stats = results.reduce((acc, result) => ({
        totalTime: acc.totalTime + result.responseTime,
        maxTime: Math.max(acc.maxTime, result.responseTime),
        minTime: Math.min(acc.minTime, result.responseTime),
        successCount: acc.successCount + (result.status === 200 ? 1 : 0)
      }), {
        totalTime: 0,
        maxTime: -Infinity,
        minTime: Infinity,
        successCount: 0
      });

      expect(stats.successCount).toBe(NUM_REQUESTS);
      expect(stats.maxTime).toBeLessThan(PERFORMANCE_THRESHOLD);
      
      console.log('Load test results:', {
        averageResponseTime: Math.round(stats.totalTime / NUM_REQUESTS),
        maxResponseTime: stats.maxTime,
        minResponseTime: stats.minTime,
        successRate: `${(stats.successCount / NUM_REQUESTS) * 100}%`
      });
    }, 10000);

    it('should handle varying payload sizes efficiently', async () => {
      const payloadSizes = [1, 10, 100, 1000];
      const results = await Promise.all(
        payloadSizes.map(async (size) => {
          const startTime = Date.now();
          const response = await request(API_URL)
            .post('/echo')
            .send({
              array: Array(size).fill('test'),
              timestamp: Date.now()
            });
          
          return {
            size,
            responseTime: Date.now() - startTime,
            status: response.status
          };
        })
      );

      results.forEach(result => {
        expect(result.status).toBe(200);
        expect(result.responseTime).toBeLessThan(PERFORMANCE_THRESHOLD * 2);
      });

      console.log('Payload size test results:', 
        results.map(r => ({
          size: r.size,
          responseTime: r.responseTime
        }))
      );
    });
  });
});
