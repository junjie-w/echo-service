export const config = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || '3000',
  VERSION: process.env.npm_package_version || '1.0.0'
} as const;
