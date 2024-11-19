import { logger } from '../../../utils/logger.js';

describe('logger', () => {
  let consoleLogSpy: jest.SpyInstance;
  let consoleErrorSpy: jest.SpyInstance;
  let consoleWarnSpy: jest.SpyInstance;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('info', () => {
    it('should log string messages with INFO prefix', () => {
      logger.info('test message');
      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO] test message');
    });

    it('should log object messages with INFO prefix', () => {
      const testObj: Record<string, unknown> = { key: 'value' };
      logger.info(testObj);
      expect(consoleLogSpy).toHaveBeenCalledWith('[INFO]', testObj);
    });
  });

  describe('error', () => {
    it('should log string errors with ERROR prefix', () => {
      logger.error('error message');
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR] error message');
    });

    it('should properly format and log Error objects', () => {
      const testError = new Error('test error message');
      testError.name = 'TestError'; 
      
      logger.error(testError);
      
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', {
        name: 'TestError',
        message: 'test error message',
        stack: testError.stack
      });
    });

    it('should handle Error objects with custom properties', () => {
      class CustomError extends Error {
        constructor(message: string) {
          super(message);
          this.name = 'CustomError';
        }
      }

      const customError = new CustomError('custom error message');
      logger.error(customError);

      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', {
        name: 'CustomError',
        message: 'custom error message',
        stack: customError.stack
      });
    });

    it('should log object errors with ERROR prefix', () => {
      const testObj: Record<string, unknown> = { 
        error: 'test error',
        code: 500 
      };
      logger.error(testObj);
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', testObj);
    });
  });

  describe('warn', () => {
    it('should log string warnings with WARN prefix', () => {
      logger.warn('warning message');
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN] warning message');
    });

    it('should log object warnings with WARN prefix', () => {
      const testWarning: Record<string, unknown> = { 
        warning: 'test warning',
        level: 'medium' 
      };
      logger.warn(testWarning);
      expect(consoleWarnSpy).toHaveBeenCalledWith('[WARN]', testWarning);
    });
  });

  describe('error edge cases', () => {
    it('should handle Error objects without stack traces', () => {
      const errorWithoutStack = new Error('test error');
      delete errorWithoutStack.stack;
  
      logger.error(errorWithoutStack);
  
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', {
        name: 'Error',
        message: 'test error',
        stack: undefined
      });
    });
  
    it('should handle Error objects with null prototype', () => {
      const errorWithNullProto = Object.create(null);
      errorWithNullProto.name = 'NullProtoError';
      errorWithNullProto.message = 'test error';
      errorWithNullProto.stack = 'test stack';
  
      logger.error(errorWithNullProto as Error);
  
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', {
        name: 'NullProtoError',
        message: 'test error',
        stack: 'test stack'
      });
    });
  
    it('should handle subclassed Error objects with additional properties', () => {
      class ExtendedError extends Error {
        constructor(
          message: string,
          public readonly code: number,
          public readonly details: Record<string, unknown>
        ) {
          super(message);
          this.name = 'ExtendedError';
        }
      }
  
      const extendedError = new ExtendedError('extended error', 500, { extra: 'info' });
      logger.error(extendedError);
  
      expect(consoleErrorSpy).toHaveBeenCalledWith('[ERROR]', {
        name: 'ExtendedError',
        message: 'extended error',
        stack: extendedError.stack
      });
    });
  });
});
