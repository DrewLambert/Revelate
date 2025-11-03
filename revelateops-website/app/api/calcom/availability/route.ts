import { NextRequest, NextResponse } from 'next/server';
import * as Sentry from '@sentry/nextjs';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

export async function GET(request: NextRequest) {
  const perfStart = performance.now();

  try {
    const { searchParams } = new URL(request.url);
    const startTime = searchParams.get('startTime');
    const endTime = searchParams.get('endTime');
    const eventTypeId = searchParams.get('eventTypeId');

    logger.debug(
      createLogContext({
        action: 'calcom_availability_request',
        endpoint: '/api/calcom/availability',
        hasStartTime: !!startTime,
        hasEndTime: !!endTime,
        hasEventTypeId: !!eventTypeId,
      }),
      'Cal.com availability request received'
    );

    if (!startTime || !endTime) {
      logger.warn(
        createLogContext({
          action: 'calcom_availability_validation_failed',
          endpoint: '/api/calcom/availability',
          duration_ms: performance.now() - perfStart,
        }),
        'Missing required parameters: startTime and endTime'
      );
      return NextResponse.json(
        { error: 'Missing required parameters: startTime and endTime' },
        { status: 400 }
      );
    }

    const apiKey = process.env.CALCOM_API_KEY;
    if (!apiKey) {
      logger.error(
        createLogContext({
          action: 'calcom_api_key_missing',
          endpoint: '/api/calcom/availability',
          duration_ms: performance.now() - perfStart,
        }),
        'Cal.com API key not found in environment variables'
      );
      return NextResponse.json(
        { error: 'Cal.com API key not configured' },
        { status: 500 }
      );
    }

    // Cal.com API v1 endpoint for slots
    const calcomUrl = new URL(`https://api.cal.com/v1/slots/available`);

    // Required parameters for Cal.com v1 API
    if (eventTypeId) {
      calcomUrl.searchParams.append('eventTypeId', eventTypeId);
    }
    calcomUrl.searchParams.append('startTime', startTime);
    calcomUrl.searchParams.append('endTime', endTime);

    logger.debug(
      createLogContext({
        action: 'calcom_api_request',
        endpoint: '/api/calcom/availability',
        calcom_url: calcomUrl.toString(),
      }),
      'Calling Cal.com slots API'
    );

    const response = await fetch(calcomUrl.toString(), {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      logger.error(
        createLogContext({
          action: 'calcom_api_error',
          endpoint: '/api/calcom/availability',
          status: response.status,
          error_response: errorText.substring(0, 200),
          duration_ms: performance.now() - perfStart,
        }),
        'Cal.com API error response'
      );

      return NextResponse.json(
        {
          error: 'Failed to fetch availability from Cal.com',
          details: errorText,
          status: response.status
        },
        { status: response.status }
      );
    }

    const data = await response.json();

    logger.info(
      createLogContext({
        action: 'calcom_availability_fetched',
        endpoint: '/api/calcom/availability',
        status: response.status,
        duration_ms: performance.now() - perfStart,
      }),
      'Cal.com availability retrieved successfully'
    );

    return NextResponse.json(data);

  } catch (error: unknown) {
    Sentry.captureException(error, {
      tags: {
        route: '/api/calcom/availability',
        action: 'fetch_availability'
      },
      extra: {
        hasApiKey: !!process.env.CALCOM_API_KEY,
        hasStartTime: !!new URL(request.url).searchParams.get('startTime'),
        hasEndTime: !!new URL(request.url).searchParams.get('endTime')
      }
    });

    logger.error(
      createLogContext({
        action: 'calcom_availability_error',
        endpoint: '/api/calcom/availability',
        error,
        duration_ms: performance.now() - perfStart,
      }),
      'Error fetching Cal.com availability'
    );

    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { error: 'Internal server error', details: errorMessage },
      { status: 500 }
    );
  }
}
