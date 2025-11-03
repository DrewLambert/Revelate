import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

export async function POST(request: NextRequest) {
  const startTime = performance.now();

  try {
    const body = await request.json();

    const {
      eventTypeId,
      start,
      responses,
      metadata,
      timeZone,
    } = body;

    if (!eventTypeId || !start || !responses) {
      logger.warn(
        createLogContext({
          action: 'calcom_booking_validation_failed',
          endpoint: '/api/calcom/booking',
          hasEventTypeId: !!eventTypeId,
          hasStart: !!start,
          hasResponses: !!responses,
          duration_ms: performance.now() - startTime,
        }),
        'Missing required booking fields'
      );
      return NextResponse.json(
        { error: 'Missing required fields: eventTypeId, start, and responses' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CALCOM_API_KEY;
    if (!apiKey) {
      logger.error(
        createLogContext({
          action: 'calcom_api_key_missing',
          endpoint: '/api/calcom/booking',
          duration_ms: performance.now() - startTime,
        }),
        'Cal.com API key not configured'
      );
      return NextResponse.json(
        { error: 'Cal.com API key not configured' },
        { status: 500 }
      );
    }

    // Cal.com API v1 endpoint for creating bookings
    const calcomUrl = 'https://api.cal.com/v1/bookings';

    const bookingData = {
      eventTypeId,
      start,
      responses,
      metadata,
      timeZone: timeZone || Intl.DateTimeFormat().resolvedOptions().timeZone,
    };

    logger.info(
      createLogContext({
        action: 'calcom_booking_request',
        endpoint: '/api/calcom/booking',
        eventTypeId,
        timeZone: bookingData.timeZone,
      }),
      'Creating Cal.com booking'
    );

    const response = await fetch(calcomUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(bookingData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        createLogContext({
          action: 'calcom_booking_error',
          endpoint: '/api/calcom/booking',
          status: response.status,
          error_response: errorText.substring(0, 200),
          duration_ms: performance.now() - startTime,
        }),
        'Cal.com booking creation failed'
      );
      return NextResponse.json(
        { error: 'Failed to create booking with Cal.com', details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();

    logger.info(
      createLogContext({
        action: 'calcom_booking_created',
        endpoint: '/api/calcom/booking',
        duration_ms: performance.now() - startTime,
      }),
      'Cal.com booking created successfully'
    );

    return NextResponse.json(data);

  } catch (error) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/calcom/booking',
        action: 'create_booking'
      },
      extra: {
        hasApiKey: !!process.env.CALCOM_API_KEY
      }
    });

    logger.error(
      createLogContext({
        action: 'calcom_booking_exception',
        endpoint: '/api/calcom/booking',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Error creating Cal.com booking'
    );
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
