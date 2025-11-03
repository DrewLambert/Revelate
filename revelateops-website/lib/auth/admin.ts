import { NextRequest } from 'next/server';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * Admin Authentication Helper
 *
 * Simple API key authentication for admin routes.
 * TODO: Replace with proper authentication (OAuth, JWT, etc.) in production.
 *
 * Usage:
 * const authResult = authenticateAdmin(request);
 * if (!authResult.authorized) {
 *   return NextResponse.json({ error: authResult.error }, { status: 401 });
 * }
 */

export interface AdminAuthResult {
  authorized: boolean;
  adminUser?: string;
  error?: string;
}

/**
 * Authenticate admin request
 *
 * Checks for X-Admin-Key header matching ADMIN_API_KEY environment variable.
 * Returns admin user identifier if authorized.
 */
export function authenticateAdmin(request: NextRequest): AdminAuthResult {
  const startTime = performance.now();

  try {
    // Get admin key from environment
    const validAdminKey = process.env.ADMIN_API_KEY;

    // Check if admin key is configured
    if (!validAdminKey) {
      logger.error(
        createLogContext({
          action: 'admin_auth_failed',
          reason: 'admin_key_not_configured',
          duration_ms: performance.now() - startTime,
        }),
        'Admin authentication failed: ADMIN_API_KEY not configured'
      );

      return {
        authorized: false,
        error: 'Admin authentication not configured',
      };
    }

    // Get API key from request headers
    const providedKey = request.headers.get('X-Admin-Key');

    if (!providedKey) {
      logger.warn(
        createLogContext({
          action: 'admin_auth_failed',
          reason: 'missing_key',
          duration_ms: performance.now() - startTime,
        }),
        'Admin authentication failed: Missing X-Admin-Key header'
      );

      return {
        authorized: false,
        error: 'Missing admin authentication key',
      };
    }

    // Validate API key
    if (providedKey !== validAdminKey) {
      logger.warn(
        createLogContext({
          action: 'admin_auth_failed',
          reason: 'invalid_key',
          duration_ms: performance.now() - startTime,
        }),
        'Admin authentication failed: Invalid API key'
      );

      return {
        authorized: false,
        error: 'Invalid admin authentication key',
      };
    }

    // Get admin user identifier (from header or default)
    const adminUser = request.headers.get('X-Admin-User') || 'admin';

    logger.info(
      createLogContext({
        action: 'admin_auth_success',
        admin_user: adminUser,
        duration_ms: performance.now() - startTime,
      }),
      `Admin authenticated: ${adminUser}`
    );

    return {
      authorized: true,
      adminUser,
    };
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'admin_auth_error',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Admin authentication error'
    );

    return {
      authorized: false,
      error: 'Authentication error',
    };
  }
}

/**
 * Create unauthorized response
 */
export function createUnauthorizedResponse(error: string) {
  return {
    success: false,
    error: 'Unauthorized',
    message: error,
  };
}
