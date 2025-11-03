import * as Sentry from '@sentry/nextjs';

describe('Sentry Integration', () => {
  beforeAll(() => {
    // Ensure Sentry is initialized
    if (!process.env.NEXT_PUBLIC_SENTRY_DSN) {
      console.warn('NEXT_PUBLIC_SENTRY_DSN not set - Sentry tests may not capture real events');
    }
  });

  it('should capture test errors', async () => {
    const testError = new Error('Test error for Sentry integration');

    // Capture the error
    const eventId = Sentry.captureException(testError, {
      tags: { test: 'integration_test', suite: 'sentry' },
      extra: { timestamp: new Date().toISOString() }
    });

    // Verify event ID was generated
    expect(eventId).toBeDefined();
    expect(typeof eventId).toBe('string');
    expect(eventId.length).toBeGreaterThan(0);

    // Flush to ensure event is sent
    await Sentry.flush(2000);
  });

  it('should include environment context', () => {
    // Verify Sentry DSN is configured (even if just for testing)
    expect(process.env.NEXT_PUBLIC_SENTRY_DSN).toBeDefined();
  });

  it('should capture messages', () => {
    const eventId = Sentry.captureMessage('Test message for Sentry', {
      level: 'info',
      tags: { test: 'integration_test' }
    });

    expect(eventId).toBeDefined();
    expect(typeof eventId).toBe('string');
  });

  it('should set custom tags', () => {
    Sentry.setTag('test_tag', 'test_value');

    const eventId = Sentry.captureException(new Error('Tagged error'), {
      tags: { custom_tag: 'custom_value' }
    });

    expect(eventId).toBeDefined();
  });

  it('should set custom context', () => {
    Sentry.setContext('test_context', {
      key1: 'value1',
      key2: 'value2'
    });

    const eventId = Sentry.captureException(new Error('Error with context'));

    expect(eventId).toBeDefined();
  });
});
