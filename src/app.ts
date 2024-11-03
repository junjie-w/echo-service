import express from 'express';
import { hostname } from 'os';
import { createRequestEcho } from './utils/response.js';
import { measureExecutionTime } from './utils/timing.js';
import type { EchoResponse, EchoResponseData, HealthCheckResponse } from './types/index.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { SERVICE_INFO } from './config/constants.js';
import { config } from './config/config.js';

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/health', (_req, res) => {
  const healthResponse: HealthCheckResponse = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  };

  res.status(200).json(healthResponse);
});

app.all('/echo', (req, res, next) => {
  try {
    const totalResponse = measureExecutionTime<EchoResponseData>(() => {
      const echoResponse = measureExecutionTime(() => createRequestEcho(req));
      
      return {
        requestEcho: {
          ...echoResponse.data,
          processingTime: echoResponse.processingTime 
        },
        server: {
          hostname: hostname(),
          nodeVersion: process.version
        },
        serviceInfo: {
          sourceCode: SERVICE_INFO.SOURCE_CODE,
          version: config.VERSION,
          environment: config.NODE_ENV
        }
      };
    });

    const response: EchoResponse = {
      ...totalResponse.data,
      totalProcessingTime: totalResponse.processingTime 
    };

    res.json(response);
  } catch (error) {
    next(error);
  }
});

app.use(notFoundHandler);
app.use(errorHandler);

export default app;