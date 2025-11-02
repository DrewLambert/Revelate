import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';

/**
 * Audit Repository
 *
 * Handles audit logging for all admin changes.
 * Every CRUD operation on services, packages, and scoping rules
 * should generate an audit log entry.
 */

export type AdminAuditLog = Prisma.AdminAuditLogGetPayload<{}>;

export interface LogAdminChangeInput {
  tableName: string;
  recordId: string;
  action: 'create' | 'update' | 'delete' | 'activate' | 'deactivate';
  changedBy: string;
  changedFields?: Record<string, { old?: unknown; new?: unknown }>;
}

/**
 * Log an admin change
 */
export async function logAdminChange(input: LogAdminChangeInput): Promise<AdminAuditLog> {
  const startTime = performance.now();

  try {
    const auditLog = await prisma.adminAuditLog.create({
      data: {
        tableName: input.tableName,
        recordId: input.recordId,
        action: input.action,
        changedBy: input.changedBy,
        changedFields: (input.changedFields ?? {}) as Prisma.InputJsonValue,
      },
    });

    logger.info(
      createLogContext({
        action: 'audit_log_created',
        table: input.tableName,
        record_id: input.recordId,
        audit_action: input.action,
        changed_by: input.changedBy,
        duration_ms: performance.now() - startTime,
      }),
      `Audit log created: ${input.action} on ${input.tableName}`
    );

    return auditLog;
  } catch (error) {
    // Don't throw - audit logging should not break the main operation
    logger.error(
      createLogContext({
        action: 'audit_log_failed',
        table: input.tableName,
        record_id: input.recordId,
        audit_action: input.action,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to create audit log (non-blocking)'
    );

    // Return a placeholder to satisfy type requirements
    return {
      id: '',
      tableName: input.tableName,
      recordId: input.recordId,
      action: input.action,
      changedFields: (input.changedFields ?? {}) as Prisma.JsonValue,
      changedBy: input.changedBy,
      changedAt: new Date(),
    };
  }
}

/**
 * Get audit logs for a specific record
 */
export async function getAuditLogsForRecord(
  tableName: string,
  recordId: string,
  limit = 50
): Promise<AdminAuditLog[]> {
  const startTime = performance.now();

  try {
    const logs = await prisma.adminAuditLog.findMany({
      where: {
        tableName,
        recordId,
      },
      orderBy: {
        changedAt: 'desc',
      },
      take: limit,
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getAuditLogsForRecord',
        table: tableName,
        record_id: recordId,
        log_count: logs.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${logs.length} audit logs for record`
    );

    return logs;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getAuditLogsForRecord',
        table: tableName,
        record_id: recordId,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get audit logs for record'
    );
    throw error;
  }
}

/**
 * Get audit logs for a table
 */
export async function getAuditLogsForTable(
  tableName: string,
  limit = 100
): Promise<AdminAuditLog[]> {
  const startTime = performance.now();

  try {
    const logs = await prisma.adminAuditLog.findMany({
      where: {
        tableName,
      },
      orderBy: {
        changedAt: 'desc',
      },
      take: limit,
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getAuditLogsForTable',
        table: tableName,
        log_count: logs.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${logs.length} audit logs for table`
    );

    return logs;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getAuditLogsForTable',
        table: tableName,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get audit logs for table'
    );
    throw error;
  }
}

/**
 * Get recent audit logs across all tables
 */
export async function getRecentAuditLogs(limit = 100): Promise<AdminAuditLog[]> {
  const startTime = performance.now();

  try {
    const logs = await prisma.adminAuditLog.findMany({
      orderBy: {
        changedAt: 'desc',
      },
      take: limit,
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getRecentAuditLogs',
        log_count: logs.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${logs.length} recent audit logs`
    );

    return logs;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getRecentAuditLogs',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get recent audit logs'
    );
    throw error;
  }
}

/**
 * Get audit logs by user
 */
export async function getAuditLogsByUser(
  changedBy: string,
  limit = 100
): Promise<AdminAuditLog[]> {
  const startTime = performance.now();

  try {
    const logs = await prisma.adminAuditLog.findMany({
      where: {
        changedBy,
      },
      orderBy: {
        changedAt: 'desc',
      },
      take: limit,
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getAuditLogsByUser',
        changed_by: changedBy,
        log_count: logs.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${logs.length} audit logs for user`
    );

    return logs;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getAuditLogsByUser',
        changed_by: changedBy,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get audit logs by user'
    );
    throw error;
  }
}

/**
 * Get audit logs with filters
 */
export async function getAuditLogsFiltered(filters: {
  tableName?: string;
  recordId?: string;
  action?: string;
  changedBy?: string;
  startDate?: Date;
  endDate?: Date;
  limit?: number;
}): Promise<AdminAuditLog[]> {
  const startTime = performance.now();

  try {
    const logs = await prisma.adminAuditLog.findMany({
      where: {
        ...(filters.tableName && { tableName: filters.tableName }),
        ...(filters.recordId && { recordId: filters.recordId }),
        ...(filters.action && { action: filters.action }),
        ...(filters.changedBy && { changedBy: filters.changedBy }),
        ...(filters.startDate && {
          changedAt: {
            gte: filters.startDate,
          },
        }),
        ...(filters.endDate && {
          changedAt: {
            lte: filters.endDate,
          },
        }),
      },
      orderBy: {
        changedAt: 'desc',
      },
      take: filters.limit ?? 100,
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getAuditLogsFiltered',
        filters,
        log_count: logs.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${logs.length} filtered audit logs`
    );

    return logs;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getAuditLogsFiltered',
        filters,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get filtered audit logs'
    );
    throw error;
  }
}
