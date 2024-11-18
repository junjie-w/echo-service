/* istanbul ignore file */

export const SERVICE_INFO = {
  SOURCE_CODE: 'https://github.com/junjie-w/echo-service',
  NAME: 'echo-service'
} as const;

export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
} as const;
