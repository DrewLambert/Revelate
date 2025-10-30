/**
 * Hash email address for privacy-safe logging in production
 * In development, returns the email unchanged for easier debugging
 * Uses simple obfuscation for Edge Runtime compatibility
 *
 * @param email - Email address to obfuscate
 * @returns Obfuscated email in production, original email in development
 *
 * @example
 * hashEmail('user@example.com') // Production: 'u***@example.com'
 * hashEmail('user@example.com') // Development: 'user@example.com'
 */
export function hashEmail(email: string): string {
  if (process.env.NODE_ENV !== 'production') {
    return email;
  }

  // Simple obfuscation that works in all runtimes (Node.js, Edge, browser)
  const [local, domain] = email.toLowerCase().split('@');
  if (!local || !domain) return '***@***';
  return `${local[0]}***@${domain}`;
}

/**
 * Sanitize phone number for privacy-safe logging
 * Redacts all but the last 4 digits
 *
 * @param phone - Phone number to sanitize
 * @returns Sanitized phone number showing only last 4 digits
 *
 * @example
 * sanitizePhone('555-123-4567') // Returns: '***-***-4567'
 */
export function sanitizePhone(phone: string): string {
  if (!phone || phone.length < 4) {
    return '***';
  }

  const lastFour = phone.slice(-4);
  const masked = '*'.repeat(phone.length - 4);
  return masked + lastFour;
}

/**
 * Sanitize message content for logging
 * Logs only the length if message exceeds max length
 *
 * @param message - Message content to sanitize
 * @param maxLength - Maximum length before truncating (default: 100)
 * @returns Sanitized message
 *
 * @example
 * sanitizeMessage('Short message') // Returns: 'Short message'
 * sanitizeMessage('Very long message...', 20) // Returns: '[Message: 50 chars]'
 */
export function sanitizeMessage(message: string, maxLength = 100): string {
  if (message.length <= maxLength) {
    return message;
  }

  return `[Message: ${message.length} chars]`;
}

/**
 * Create a standardized log context object
 * Ensures consistent structure across all logs
 *
 * @param context - Partial context object
 * @returns Complete log context with sanitized fields
 *
 * @example
 * createLogContext({
 *   conversation_id: 123,
 *   action: 'message_sent',
 *   user_email: 'user@example.com'
 * })
 * // Returns: { conversation_id: 123, action: 'message_sent', user_email: <hashed in prod> }
 */
export interface LogContext {
  conversation_id?: number;
  action: string;
  user_email?: string;
  duration_ms?: number;
  error?: Error | unknown;
  [key: string]: unknown;
}

export function createLogContext(context: Partial<LogContext> & { action: string }): LogContext {
  const sanitizedContext: LogContext = {
    action: context.action,
  };

  if (context.conversation_id !== undefined) {
    sanitizedContext.conversation_id = context.conversation_id;
  }

  if (context.user_email) {
    sanitizedContext.user_email = hashEmail(context.user_email);
  }

  if (context.duration_ms !== undefined) {
    sanitizedContext.duration_ms = Math.round(context.duration_ms * 100) / 100; // Round to 2 decimals
  }

  if (context.error) {
    sanitizedContext.error = context.error;
  }

  // Include any additional context fields
  Object.keys(context).forEach((key) => {
    if (!['action', 'conversation_id', 'user_email', 'duration_ms', 'error'].includes(key)) {
      sanitizedContext[key] = context[key];
    }
  });

  return sanitizedContext;
}

/**
 * Measure execution time of an async function
 * Useful for performance tracking in logs
 *
 * @param fn - Async function to measure
 * @returns Object with result and duration in milliseconds
 *
 * @example
 * const { result, duration } = await measureTime(async () => {
 *   return await database.query('SELECT * FROM users');
 * });
 * logger.info({ duration_ms: duration }, 'Query completed');
 */
export async function measureTime<T>(
  fn: () => Promise<T>
): Promise<{ result: T; duration: number }> {
  const startTime = performance.now();
  const result = await fn();
  const duration = performance.now() - startTime;

  return { result, duration };
}
