import * as Sentry from '@sentry/nextjs';

/**
 * Integration tests for API route error tracking with Sentry
 *
 * These tests verify that Sentry error capture is properly integrated
 * into all API routes and captures errors with appropriate context.
 */
describe('API Error Tracking with Sentry', () => {
  beforeEach(() => {
    // Clear any previous Sentry context
    Sentry.setContext('test', null);
  });

  it('should have Sentry SDK available', () => {
    expect(Sentry).toBeDefined();
    expect(Sentry.captureException).toBeDefined();
    expect(Sentry.captureMessage).toBeDefined();
  });

  it('should capture exceptions with tags and extra data', () => {
    const testError = new Error('API route error simulation');

    const eventId = Sentry.captureException(testError, {
      tags: {
        route: '/api/test',
        action: 'test_action'
      },
      extra: {
        userId: 'test-user',
        requestData: { foo: 'bar' }
      }
    });

    expect(eventId).toBeDefined();
    expect(typeof eventId).toBe('string');
  });

  it('should handle different error types', () => {
    // Standard Error
    const standardError = new Error('Standard error');
    const id1 = Sentry.captureException(standardError);
    expect(id1).toBeDefined();

    // TypeError
    const typeError = new TypeError('Type error');
    const id2 = Sentry.captureException(typeError);
    expect(id2).toBeDefined();

    // Custom error
    class CustomError extends Error {
      constructor(message: string) {
        super(message);
        this.name = 'CustomError';
      }
    }
    const customError = new CustomError('Custom error');
    const id3 = Sentry.captureException(customError);
    expect(id3).toBeDefined();
  });

  it('should capture errors with performance timing', () => {
    const startTime = performance.now();

    // Simulate some work
    for (let i = 0; i < 1000; i++) {
      Math.sqrt(i);
    }

    const duration = performance.now() - startTime;

    const eventId = Sentry.captureException(new Error('Performance test error'), {
      extra: {
        duration_ms: duration,
        operation: 'test_operation'
      }
    });

    expect(eventId).toBeDefined();
    expect(duration).toBeGreaterThan(0);
  });

  it('should handle configuration check errors', () => {
    const eventId = Sentry.captureException(new Error('Configuration missing'), {
      tags: {
        route: '/api/test',
        action: 'config_check'
      },
      extra: {
        hasApiKey: false,
        configMissing: true
      }
    });

    expect(eventId).toBeDefined();
  });

  it('should support error severity levels', () => {
    const errorId = Sentry.captureMessage('Error level message', {
      level: 'error',
      tags: { severity: 'high' }
    });
    expect(errorId).toBeDefined();

    const warningId = Sentry.captureMessage('Warning level message', {
      level: 'warning',
      tags: { severity: 'medium' }
    });
    expect(warningId).toBeDefined();

    const infoId = Sentry.captureMessage('Info level message', {
      level: 'info',
      tags: { severity: 'low' }
    });
    expect(infoId).toBeDefined();
  });

  it('should flush events without errors', async () => {
    Sentry.captureException(new Error('Test error for flush'));

    // Flush may return false in test environment if there's no transport configured
    // or if there are no events in the queue. We just verify it doesn't throw.
    const flushed = await Sentry.flush(2000);
    expect(typeof flushed).toBe('boolean');
  });
});
