import { hostname } from 'node:os';

import express from 'express';

import { config, SERVICE_INFO } from './config/config.js';
import { errorHandler } from './middleware/errorHandler.js';
import { jsonParser } from './middleware/jsonValidator.js';
import { notFoundHandler } from './middleware/notFoundHandler.js';
import { createRequestEcho } from './utils/response.js';
import { measureExecutionTime } from './utils/timing.js';

import type { EchoResponse, EchoResponseData, HealthCheckResponse } from './types/index.js';

const app = express();
app.use(jsonParser);
app.use(express.urlencoded({ extended: true }));

app.get('/', (_req, res) => {
  res.json({
    message: 'Welcome to Echo Service! Send your requests to /echo endpoint',
    availableEndpoints: {
      echo: '/echo',
      health: '/health'
    },
    documentation: SERVICE_INFO.SOURCE_CODE
  });
});

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
app.use(errorHandler as express.ErrorRequestHandler); 

export default app;
