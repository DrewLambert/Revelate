import { PrismaClient } from '@prisma/client';
import { logger } from '@/lib/monitoring/logger';

/**
 * Prisma Client Singleton
 *
 * This singleton pattern prevents multiple instances of Prisma Client
 * in development mode (hot reloading) while ensuring a single instance
 * in production.
 */

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log: [
      { level: 'query', emit: 'event' },
      { level: 'error', emit: 'event' },
      { level: 'warn', emit: 'event' },
    ],
  });

  // Log queries in development
  if (process.env.NODE_ENV === 'development') {
    client.$on('query' as never, (e: unknown) => {
      const event = e as { query: string; params: string; duration: number };
      logger.debug({
        action: 'prisma_query',
        query: event.query,
        params: event.params,
        duration_ms: event.duration,
      }, 'Prisma query executed');
    });
  }

  // Log errors
  client.$on('error' as never, (e: unknown) => {
    const event = e as { message: string; target?: string };
    logger.error({
      action: 'prisma_error',
      message: event.message,
      target: event.target,
    }, 'Prisma error occurred');
  });

  // Log warnings
  client.$on('warn' as never, (e: unknown) => {
    const event = e as { message: string };
    logger.warn({
      action: 'prisma_warning',
      message: event.message,
    }, 'Prisma warning');
  });

  return client;
};

export const prisma = globalThis.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== 'production') {
  globalThis.prisma = prisma;
}

export default prisma;
