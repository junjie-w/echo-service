const baseConfig = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  moduleNameMapper: {
    '^(\\.{1,2}/.*)\\.js$': '$1'
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      useESM: true
    }]
  },
  extensionsToTreatAsEsm: ['.ts']
};

export default {
  ...baseConfig,
  projects: [
    {
      displayName: '🧪 UNIT',  
      ...baseConfig,
      testMatch: ['<rootDir>/src/tests/unit/**/*.test.ts'],
      rootDir: '.'
    },
    {
      displayName: '🔄 INTEGRATION',  
      ...baseConfig,
      testMatch: ['<rootDir>/src/tests/integration/**/*.test.ts'],
      rootDir: '.'
    },
    {
      displayName: '🌐 API',  
      ...baseConfig,
      testMatch: ['<rootDir>/src/tests/api/**/*.test.ts'],
      rootDir: '.'
    }
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  },
  collectCoverageFrom: [
    'src/**/*.{ts,js}',
    '!src/tests/**',
    '!src/**/*.d.ts',
    '!src/types/**',
    '!src/server.ts',
    '!src/cli.ts',
    '!src/**/index.ts'
  ],
  testTimeout: 10000,
  verbose: true,
  detectOpenHandles: true
};
