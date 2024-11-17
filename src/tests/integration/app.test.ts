import request from 'supertest';

import app from '../../app.js';
import { SERVICE_INFO } from '../../config/config.js';
import * as responseUtils from '../../utils/response.js';

const mockHostname = jest.fn().mockReturnValue('test-host');
jest.mock('os', () => ({
  ...jest.requireActual('os'),
  hostname: mockHostname
}));

describe('Echo Service Integration Tests', () => { 
  const originalEnv = process.env.NODE_ENV;

  beforeEach(() => {
    mockHostname.mockReturnValue('test-host');
  });

  afterEach(() => {
    jest.clearAllMocks();
    jest.restoreAllMocks();  
    process.env.NODE_ENV = originalEnv;
  });

  describe('GET /', () => {
    it('should return 200 and welcome message with available endpoints', async () => {
      const response = await request(app)
        .get('/')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body).toEqual({
        message: 'Welcome to Echo Service! Send your requests to /echo endpoint',
        availableEndpoints: {
          echo: '/echo',
          health: '/health'
        },
        documentation: SERVICE_INFO.SOURCE_CODE
      });
    });
  });

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

  describe('JSON Validation', () => {
    it('should handle valid JSON bodies', async () => {
      const validBody = { test: 'data' };
      const response = await request(app)
        .post('/echo')
        .send(validBody)
        .expect('Content-Type', /json/)
        .expect(200);

      expect(response.body.requestEcho.body).toEqual(validBody);
    });

    it('should reject invalid JSON with 400', async () => {
      const response = await request(app)
        .post('/echo')
        .set('Content-Type', 'application/json')
        .send('{"invalid": "json"') 
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toEqual(expect.objectContaining({
        error: expect.objectContaining({
          message: expect.stringMatching(/invalid json/i)
        })
      }));
    });

    it('should handle empty JSON objects', async () => {
      await request(app)
        .post('/echo')
        .send({})
        .expect(200);
    });

    it('should handle JSON arrays', async () => {
      const arrayData = [1, 2, 3];
      const response = await request(app)
        .post('/echo')
        .send(arrayData)
        .expect(200);

      expect(response.body.requestEcho.body).toEqual(arrayData);
    });

    it('should handle large JSON objects', async () => {
      const largeObject = {
        array: Array(1000).fill('test'),
        nested: {
          data: Array(100).fill({ test: 'value' })
        }
      };

      const response = await request(app)
        .post('/echo')
        .send(largeObject)
        .expect(200);

      expect(response.body.requestEcho.body).toEqual(largeObject);
    });
  });

  describe('Error Handling', () => {
    it('should call next with error if createRequestEcho fails', async () => {
      const errorMessage = 'Intentional error';
      
      jest.spyOn(responseUtils, 'createRequestEcho').mockImplementation(() => {
        throw new Error(errorMessage);
      });
  
      const response = await request(app)
        .post('/echo')
        .send({ test: 'data' })
        .expect('Content-Type', /json/)
        .expect(500); 
  
      expect(response.body).toEqual(expect.objectContaining({
        error: expect.objectContaining({
          message: errorMessage
        })
      }));
    });

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
