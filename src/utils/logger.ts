import type { LoggerFunction, LogLevel, LogPayload } from '../types/index.js';

export const logger: Record<LogLevel, LoggerFunction> = {
  info: (payload: LogPayload) => {
    if (typeof payload === 'string') {
      console.log(`[INFO] ${payload}`);
    } else {
      console.log('[INFO]', payload);
    }
  },
  error: (payload: LogPayload) => {
    if (typeof payload === 'string') {
      console.error(`[ERROR] ${payload}`);
    } else if (payload instanceof Error) {
      console.error('[ERROR]', {
        name: payload.name,
        message: payload.message,
        stack: payload.stack
      });
    } else {
      console.error('[ERROR]', payload);
    }
  },
  warn: (payload: LogPayload) => {
    if (typeof payload === 'string') {
      console.warn(`[WARN] ${payload}`);
    } else {
      console.warn('[WARN]', payload);
    }
  }
};
