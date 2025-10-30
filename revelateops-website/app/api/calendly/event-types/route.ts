import { NextResponse } from 'next/server';
import { getCalendlyAPI } from '@/lib/calendly-api';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

export const runtime = 'edge';

/**
 * GET /api/calendly/event-types
 * Returns active event types for the current user
 */
export async function GET() {
  const startTime = performance.now();

  try {
    const api = getCalendlyAPI();

    // First get current user to get their URI
    const userResponse = await api.getCurrentUser() as { resource: { uri: string } };
    const userUri = userResponse.resource.uri;

    // Then get their event types
    const eventTypes = await api.getEventTypes(userUri);

    logger.info(
      createLogContext({
        action: 'calendly_event_types_fetched',
        endpoint: '/api/calendly/event-types',
        duration_ms: performance.now() - startTime,
      }),
      'Calendly event types retrieved'
    );

    return NextResponse.json(eventTypes);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/calendly/event-types',
        action: 'fetch_event_types'
      }
    });

    logger.error(
      createLogContext({
        action: 'calendly_event_types_error',
        endpoint: '/api/calendly/event-types',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Calendly API event types request failed'
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch event types' },
      { status: 500 }
    );
  }
}
