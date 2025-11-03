import { NextResponse } from 'next/server';
import { getCalendlyAPI } from '@/lib/calendly-api';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

export const runtime = 'edge';

/**
 * GET /api/calendly/availability?event_type_uri={uri}&start_time={iso}&end_time={iso}
 * Returns available time slots for an event type
 */
export async function GET(request: Request) {
  const perfStart = performance.now();

  try {
    const { searchParams } = new URL(request.url);
    const eventTypeUri = searchParams.get('event_type_uri');
    const startTime = searchParams.get('start_time');
    const endTime = searchParams.get('end_time');

    if (!eventTypeUri || !startTime || !endTime) {
      logger.warn(
        createLogContext({
          action: 'calendly_availability_validation_failed',
          endpoint: '/api/calendly/availability',
          hasEventTypeUri: !!eventTypeUri,
          hasStartTime: !!startTime,
          hasEndTime: !!endTime,
          duration_ms: performance.now() - perfStart,
        }),
        'Missing required parameters for Calendly availability'
      );
      return NextResponse.json(
        { error: 'Missing required parameters: event_type_uri, start_time, end_time' },
        { status: 400 }
      );
    }

    const api = getCalendlyAPI();
    const availability = await api.getAvailableTimes(eventTypeUri, startTime, endTime);

    logger.info(
      createLogContext({
        action: 'calendly_availability_fetched',
        endpoint: '/api/calendly/availability',
        duration_ms: performance.now() - perfStart,
      }),
      'Calendly availability retrieved'
    );

    return NextResponse.json(availability);
  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/calendly/availability',
        action: 'fetch_availability'
      },
      extra: {
        hasEventTypeUri: !!new URL(request.url).searchParams.get('event_type_uri'),
        hasStartTime: !!new URL(request.url).searchParams.get('start_time'),
        hasEndTime: !!new URL(request.url).searchParams.get('end_time')
      }
    });

    logger.error(
      createLogContext({
        action: 'calendly_availability_error',
        endpoint: '/api/calendly/availability',
        error,
        duration_ms: performance.now() - perfStart,
      }),
      'Calendly API availability request failed'
    );
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}
