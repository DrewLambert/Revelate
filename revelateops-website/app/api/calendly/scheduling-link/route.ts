import { NextResponse } from 'next/server';
import { getCalendlyAPI } from '@/lib/calendly-api';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

export const runtime = 'edge';

/**
 * POST /api/calendly/scheduling-link
 * Creates a single-use scheduling link
 * Body: { event_type_uri: string }
 */
export async function POST(request: Request) {
  const startTime = performance.now();

  try {
    const body = await request.json();
    const { event_type_uri } = body;

    if (!event_type_uri) {
      logger.warn(
        createLogContext({
          action: 'calendly_scheduling_link_validation_failed',
          endpoint: '/api/calendly/scheduling-link',
          duration_ms: performance.now() - startTime,
        }),
        'Missing event_type_uri for scheduling link creation'
      );
      return NextResponse.json(
        { error: 'Missing required parameter: event_type_uri' },
        { status: 400 }
      );
    }

    const api = getCalendlyAPI();
    const schedulingLink = await api.createSchedulingLink({
      max_event_count: 1, // Single-use link
      owner: event_type_uri,
      owner_type: 'EventType',
    });

    logger.info(
      createLogContext({
        action: 'calendly_scheduling_link_created',
        endpoint: '/api/calendly/scheduling-link',
        duration_ms: performance.now() - startTime,
      }),
      'Calendly scheduling link created'
    );

    return NextResponse.json(schedulingLink);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/calendly/scheduling-link',
        action: 'create_scheduling_link'
      }
    });

    logger.error(
      createLogContext({
        action: 'calendly_scheduling_link_error',
        endpoint: '/api/calendly/scheduling-link',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Calendly API scheduling link creation failed'
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create scheduling link' },
      { status: 500 }
    );
  }
}
