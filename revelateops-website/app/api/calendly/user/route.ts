import { NextResponse } from 'next/server';
import { getCalendlyAPI } from '@/lib/calendly-api';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';
import * as Sentry from '@sentry/nextjs';

export const runtime = 'edge';

/**
 * GET /api/calendly/user
 * Returns current Calendly user information
 */
export async function GET() {
  const startTime = performance.now();

  try {
    const api = getCalendlyAPI();
    const user = await api.getCurrentUser();

    logger.info(
      createLogContext({
        action: 'calendly_user_fetched',
        endpoint: '/api/calendly/user',
        duration_ms: performance.now() - startTime,
      }),
      'Calendly user data retrieved'
    );

    return NextResponse.json(user);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/calendly/user',
        action: 'fetch_user_data'
      },
      extra: {
        duration_ms: performance.now() - startTime
      }
    });

    logger.error(
      createLogContext({
        action: 'calendly_api_error',
        endpoint: '/api/calendly/user',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Calendly API request failed'
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch user data' },
      { status: 500 }
    );
  }
}
