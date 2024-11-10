import request from 'supertest';

import app from '../../app.js';

describe('Echo Service Integration Tests', () => {
  describe('GET /health', () => {
    it('should return 200 and health status', async () => {
      const response = await request(app)
        .get('/health')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        status: 'healthy',
        timestamp: expect.any(String),
        uptime: expect.any(Number)
      }));
    });
  });

  describe('ALL /echo', () => {
    it('should echo GET request', async () => {
      const response = await request(app)
        .get('/echo?param=test')
        .set('X-Test-Header', 'test-value')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual(expect.objectContaining({
        requestEcho: expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            'x-test-header': 'test-value'
          }),
          arguments: expect.objectContaining({
            param: 'test'
          })
        }),
        totalProcessingTime: expect.any(String)
      }));
    });

    it('should echo POST request with JSON body', async () => {
      const testBody = { test: 'data' };
      const response = await request(app)
        .post('/echo')
        .send(testBody)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.requestEcho).toEqual(expect.objectContaining({
        method: 'POST',
        body: testBody
      }));
    });
  });

  describe('Error Handling', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app)
        .get('/non-existent')
        .expect('Content-Type', /json/)
        .expect(404);

      expect(response.body).toEqual(expect.objectContaining({
        error: expect.objectContaining({
          message: 'Not Found',
          path: '/non-existent'
        })
      }));
    });
  });
});
