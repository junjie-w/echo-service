import { json } from 'express';

import { BadRequestError } from '../types/index.js';
import { logger } from '../utils/logger.js';

import type { JsonVerifyCallback } from '../types/index.js';

export const verifyJsonFormat: JsonVerifyCallback = (req, _res, buf) => {
  try {
    JSON.parse(buf.toString());
  } catch (error) {
    logger.error({
      error,
      path: req.path,
      body: buf.toString(),
      message: 'Invalid JSON received'
    });
    throw new BadRequestError('Invalid JSON format');
  }
};

export const jsonParser = json({
  verify: verifyJsonFormat
});
