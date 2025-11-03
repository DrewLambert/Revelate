import pino from 'pino';

/**
 * Pino logger instance configured for structured logging
 *
 * Configuration:
 * - Production: JSON output for parsing/aggregation
 * - Development: Pretty-printed colorized output
 * - Log level controlled by LOG_LEVEL env var
 *
 * Usage:
 * ```typescript
 * import { logger } from '@/lib/monitoring/logger';
 *
 * logger.info({ conversation_id: 123, action: 'message_sent' }, 'User message sent');
 * logger.error({ error, conversation_id: 123 }, 'Database query failed');
 * ```
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || (process.env.NODE_ENV === 'production' ? 'info' : 'debug'),

  formatters: {
    level: (label) => ({ level: label }),
  },

  // Pretty-print in development only
  ...(process.env.NODE_ENV === 'development' && {
    transport: {
      target: 'pino-pretty',
      options: {
        colorize: true,
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    },
  }),
});

/**
 * Create a child logger with predefined context
 * Useful for adding conversation_id or other context to all logs in a scope
 *
 * @param context - Context object to be included in all child logger calls
 * @returns Child logger instance
 *
 * @example
 * const childLogger = logger.child({ conversation_id: 123 });
 * childLogger.info({ action: 'message_sent' }, 'User message sent');
 * // Logs include both conversation_id and action
 */
export function createChildLogger(context: Record<string, unknown>): pino.Logger {
  return logger.child(context);
}
