import { NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';

/**
 * GET /api/test-error
 * Test endpoint to verify Sentry error capture works correctly
 *
 * This endpoint intentionally throws an error that should be captured by Sentry.
 * Use this to verify:
 * - Sentry SDK is properly configured
 * - Errors appear in Sentry dashboard
 * - Stack traces are readable (source maps working)
 * - Tags and context are properly attached
 */
export async function GET() {
  try {
    // Capture a test message first
    Sentry.captureMessage('Test error endpoint accessed', {
      level: 'info',
      tags: {
        route: '/api/test-error',
        test: 'true'
      }
    });

    // Intentionally throw an error for testing
    throw new Error('Test error for Sentry verification - this is expected');
  } catch (error) {
    // Capture the exception with context
    Sentry.captureException(error, {
      tags: {
        route: '/api/test-error',
        action: 'test_error_trigger',
        intentional: 'true'
      },
      extra: {
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV,
        testInfo: 'This error was intentionally triggered to test Sentry integration'
      }
    });

    return NextResponse.json(
      {
        error: 'Test error triggered successfully',
        message: 'Check Sentry dashboard to verify error was captured',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
