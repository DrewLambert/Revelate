import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

// Test endpoint to verify Cal.com API key and fetch event types
export async function GET(request: NextRequest) {
  const startTime = performance.now();

  try {
    const apiKey = process.env.CALCOM_API_KEY;

    if (!apiKey) {
      logger.error(
        createLogContext({
          action: 'calcom_api_key_missing',
          endpoint: '/api/calcom/test',
          duration_ms: performance.now() - startTime,
        }),
        'Cal.com API key not configured'
      );
      return NextResponse.json(
        { error: 'Cal.com API key not configured' },
        { status: 500 }
      );
    }

    logger.debug(
      createLogContext({
        action: 'calcom_api_test_started',
        endpoint: '/api/calcom/test',
        keyPrefix: apiKey.substring(0, 20),
      }),
      'Testing Cal.com API key'
    );

    // Try to fetch event types to verify API key works (using v1 API)
    const response = await fetch('https://api.cal.com/v1/event-types', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    logger.info(
      createLogContext({
        action: 'calcom_api_test_completed',
        endpoint: '/api/calcom/test',
        status: response.status,
        ok: response.ok,
        duration_ms: performance.now() - startTime,
      }),
      response.ok ? 'Cal.com API key test successful' : 'Cal.com API key test failed'
    );

    return NextResponse.json({
      status: response.status,
      ok: response.ok,
      data: data,
      message: response.ok
        ? 'API key is valid! See event types below.'
        : 'API key test failed. Check the error details.',
    });

  } catch (error: unknown) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/calcom/test',
        action: 'test_api_key'
      },
      extra: {
        hasApiKey: !!process.env.CALCOM_API_KEY
      }
    });

    logger.error(
      createLogContext({
        action: 'calcom_api_test_error',
        endpoint: '/api/calcom/test',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Cal.com API test failed with error'
    );

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    const errorStack = error instanceof Error ? error.stack : undefined;

    return NextResponse.json(
      {
        error: 'Test failed',
        details: errorMessage,
        stack: errorStack
      },
      { status: 500 }
    );
  }
}
