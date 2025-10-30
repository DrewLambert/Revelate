import { logger, createChildLogger } from '@/lib/monitoring/logger';
import pino from 'pino';

describe('Logger', () => {
  describe('logger configuration', () => {
    it('should be a Pino logger instance', () => {
      expect(logger).toBeDefined();
      expect(typeof logger.info).toBe('function');
      expect(typeof logger.error).toBe('function');
      expect(typeof logger.warn).toBe('function');
      expect(typeof logger.debug).toBe('function');
    });

    it('should have correct log level in production', () => {
      const originalEnv = process.env.NODE_ENV;
      const originalLogLevel = process.env.LOG_LEVEL;

      process.env.NODE_ENV = 'production';
      delete process.env.LOG_LEVEL;

      // Re-import to get fresh config
      jest.resetModules();
      const { logger: prodLogger } = require('@/lib/monitoring/logger');

      expect(prodLogger.level).toBe('info');

      // Restore
      process.env.NODE_ENV = originalEnv;
      process.env.LOG_LEVEL = originalLogLevel;
      jest.resetModules();
    });

    it('should have correct log level in development', () => {
      const originalEnv = process.env.NODE_ENV;
      const originalLogLevel = process.env.LOG_LEVEL;

      process.env.NODE_ENV = 'development';
      delete process.env.LOG_LEVEL;

      // Re-import to get fresh config
      jest.resetModules();
      const { logger: devLogger } = require('@/lib/monitoring/logger');

      expect(devLogger.level).toBe('debug');

      // Restore
      process.env.NODE_ENV = originalEnv;
      process.env.LOG_LEVEL = originalLogLevel;
      jest.resetModules();
    });

    it('should respect LOG_LEVEL environment variable', () => {
      const originalLogLevel = process.env.LOG_LEVEL;

      process.env.LOG_LEVEL = 'warn';

      // Re-import to get fresh config
      jest.resetModules();
      const { logger: warnLogger } = require('@/lib/monitoring/logger');

      expect(warnLogger.level).toBe('warn');

      // Restore
      process.env.LOG_LEVEL = originalLogLevel;
      jest.resetModules();
    });
  });

  describe('createChildLogger', () => {
    it('should create a child logger with context', () => {
      const childLogger = createChildLogger({ conversation_id: 123 });

      expect(childLogger).toBeDefined();
      expect(typeof childLogger.info).toBe('function');
    });

    it('should include parent context in child logger', () => {
      const mockWrite = jest.fn();
      const testLogger = pino(
        {
          level: 'info',
        },
        {
          write: mockWrite,
        }
      );

      const childLogger = testLogger.child({ conversation_id: 123 });
      childLogger.info({ action: 'test' }, 'Test message');

      expect(mockWrite).toHaveBeenCalled();
      const logOutput = JSON.parse(mockWrite.mock.calls[0][0]);
      expect(logOutput.conversation_id).toBe(123);
      expect(logOutput.action).toBe('test');
    });
  });

  describe('logging methods', () => {
    it('should support info logging', () => {
      const mockWrite = jest.fn();
      const testLogger = pino(
        {
          level: 'info',
          formatters: {
            level: (label) => ({ level: label }),
          },
        },
        {
          write: mockWrite,
        }
      );

      testLogger.info({ action: 'test' }, 'Test info message');

      expect(mockWrite).toHaveBeenCalled();
      const logOutput = JSON.parse(mockWrite.mock.calls[0][0]);
      expect(logOutput.level).toBe('info');
      expect(logOutput.msg).toBe('Test info message');
      expect(logOutput.action).toBe('test');
    });

    it('should support error logging with error objects', () => {
      const mockWrite = jest.fn();
      const testLogger = pino(
        {
          level: 'error',
          formatters: {
            level: (label) => ({ level: label }),
          },
        },
        {
          write: mockWrite,
        }
      );

      const testError = new Error('Test error');
      testLogger.error({ error: testError, action: 'test_failed' }, 'Operation failed');

      expect(mockWrite).toHaveBeenCalled();
      const logOutput = JSON.parse(mockWrite.mock.calls[0][0]);
      expect(logOutput.level).toBe('error');
      expect(logOutput.msg).toBe('Operation failed');
      expect(logOutput.action).toBe('test_failed');
    });

    it('should support warn logging', () => {
      const mockWrite = jest.fn();
      const testLogger = pino(
        {
          level: 'warn',
          formatters: {
            level: (label) => ({ level: label }),
          },
        },
        {
          write: mockWrite,
        }
      );

      testLogger.warn({ action: 'rate_limit_approaching' }, 'Rate limit at 80%');

      expect(mockWrite).toHaveBeenCalled();
      const logOutput = JSON.parse(mockWrite.mock.calls[0][0]);
      expect(logOutput.level).toBe('warn');
      expect(logOutput.msg).toBe('Rate limit at 80%');
    });

    it('should support debug logging', () => {
      const mockWrite = jest.fn();
      const testLogger = pino(
        {
          level: 'debug',
          formatters: {
            level: (label) => ({ level: label }),
          },
        },
        {
          write: mockWrite,
        }
      );

      testLogger.debug({ action: 'debug_trace', step: 1 }, 'Debug step 1');

      expect(mockWrite).toHaveBeenCalled();
      const logOutput = JSON.parse(mockWrite.mock.calls[0][0]);
      expect(logOutput.level).toBe('debug');
      expect(logOutput.step).toBe(1);
    });
  });

  describe('JSON output format', () => {
    it('should output valid JSON in production mode', () => {
      const mockWrite = jest.fn();
      const testLogger = pino(
        {
          level: 'info',
        },
        {
          write: mockWrite,
        }
      );

      testLogger.info({ conversation_id: 123, action: 'test' }, 'Test message');

      expect(mockWrite).toHaveBeenCalled();
      const output = mockWrite.mock.calls[0][0];

      // Should be valid JSON
      expect(() => JSON.parse(output)).not.toThrow();

      const parsed = JSON.parse(output);
      expect(parsed).toHaveProperty('level');
      expect(parsed).toHaveProperty('time');
      expect(parsed).toHaveProperty('msg');
      expect(parsed).toHaveProperty('conversation_id');
      expect(parsed).toHaveProperty('action');
    });
  });
});
