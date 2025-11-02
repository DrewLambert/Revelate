import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';
import { logAdminChange } from './audit';

/**
 * Service Repository
 *
 * Handles all database operations for the Service model.
 * Includes logging, error handling, and admin audit trails.
 */

export type Service = Prisma.ServiceGetPayload<{}>;
export type ServiceWithPackages = Prisma.ServiceGetPayload<{
  include: { packageServices: { include: { package: true } } };
}>;

export interface CreateServiceInput {
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  basePrice: number;
  category: string;
  icon?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  createdBy?: string;
}

export interface UpdateServiceInput {
  name?: string;
  slug?: string;
  shortDescription?: string;
  fullDescription?: string;
  basePrice?: number;
  category?: string;
  icon?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  updatedBy?: string;
}

/**
 * Get all active services, ordered by display order
 */
export async function getActiveServices(): Promise<Service[]> {
  const startTime = performance.now();

  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getActiveServices',
        service_count: services.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${services.length} active services`
    );

    return services;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getActiveServices',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get active services'
    );
    throw error;
  }
}

/**
 * Get services by category
 */
export async function getServicesByCategory(category: string, activeOnly = true): Promise<Service[]> {
  const startTime = performance.now();

  try {
    const services = await prisma.service.findMany({
      where: {
        category,
        ...(activeOnly && { isActive: true }),
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getServicesByCategory',
        category,
        active_only: activeOnly,
        service_count: services.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${services.length} services for category: ${category}`
    );

    return services;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getServicesByCategory',
        category,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get services by category'
    );
    throw error;
  }
}

/**
 * Get service by ID
 */
export async function getServiceById(id: string): Promise<Service | null> {
  const startTime = performance.now();

  try {
    const service = await prisma.service.findUnique({
      where: { id },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getServiceById',
        service_id: id,
        found: !!service,
        duration_ms: performance.now() - startTime,
      }),
      service ? 'Service retrieved' : 'Service not found'
    );

    return service;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getServiceById',
        service_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get service by ID'
    );
    throw error;
  }
}

/**
 * Get service by slug
 */
export async function getServiceBySlug(slug: string): Promise<Service | null> {
  const startTime = performance.now();

  try {
    const service = await prisma.service.findUnique({
      where: { slug },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getServiceBySlug',
        slug,
        found: !!service,
        duration_ms: performance.now() - startTime,
      }),
      service ? 'Service retrieved' : 'Service not found'
    );

    return service;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getServiceBySlug',
        slug,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get service by slug'
    );
    throw error;
  }
}

/**
 * Get service with its package relationships
 */
export async function getServiceWithPackages(id: string): Promise<ServiceWithPackages | null> {
  const startTime = performance.now();

  try {
    const service = await prisma.service.findUnique({
      where: { id },
      include: {
        packageServices: {
          include: {
            package: true,
          },
          orderBy: {
            package: {
              displayOrder: 'asc',
            },
          },
        },
      },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getServiceWithPackages',
        service_id: id,
        found: !!service,
        package_count: service?.packageServices.length ?? 0,
        duration_ms: performance.now() - startTime,
      }),
      service ? `Service retrieved with ${service.packageServices.length} package relationships` : 'Service not found'
    );

    return service;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getServiceWithPackages',
        service_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get service with packages'
    );
    throw error;
  }
}

/**
 * Get all services (admin view)
 */
export async function getAllServices(): Promise<Service[]> {
  const startTime = performance.now();

  try {
    const services = await prisma.service.findMany({
      orderBy: [
        { isActive: 'desc' },
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getAllServices',
        service_count: services.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${services.length} services (admin view)`
    );

    return services;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getAllServices',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get all services'
    );
    throw error;
  }
}

/**
 * Create a new service
 */
export async function createService(data: CreateServiceInput): Promise<Service> {
  const startTime = performance.now();

  try {
    const service = await prisma.service.create({
      data: {
        name: data.name,
        slug: data.slug,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        basePrice: data.basePrice,
        category: data.category,
        icon: data.icon,
        isFeatured: data.isFeatured ?? false,
        displayOrder: data.displayOrder ?? 0,
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
      },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'services',
      recordId: service.id,
      action: 'create',
      changedBy: data.createdBy || 'system',
      changedFields: {
        name: { new: service.name },
        basePrice: { new: service.basePrice },
        category: { new: service.category },
      },
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'createService',
        service_id: service.id,
        service_name: service.name,
        created_by: data.createdBy,
        duration_ms: performance.now() - startTime,
      }),
      `Service created: ${service.name}`
    );

    return service;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'createService',
        service_name: data.name,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to create service'
    );
    throw error;
  }
}

/**
 * Update a service
 */
export async function updateService(id: string, data: UpdateServiceInput): Promise<Service> {
  const startTime = performance.now();

  try {
    // Get current state for audit log
    const currentService = await prisma.service.findUnique({ where: { id } });
    if (!currentService) {
      throw new Error(`Service not found: ${id}`);
    }

    // Update service
    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.shortDescription !== undefined && { shortDescription: data.shortDescription }),
        ...(data.fullDescription !== undefined && { fullDescription: data.fullDescription }),
        ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
        ...(data.category !== undefined && { category: data.category }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        updatedBy: data.updatedBy,
      },
    });

    // Build changed fields for audit log
    const changedFields: Record<string, { old: unknown; new: unknown }> = {};
    if (data.name !== undefined && data.name !== currentService.name) {
      changedFields.name = { old: currentService.name, new: data.name };
    }
    if (data.basePrice !== undefined && data.basePrice !== Number(currentService.basePrice)) {
      changedFields.basePrice = { old: Number(currentService.basePrice), new: data.basePrice };
    }
    if (data.category !== undefined && data.category !== currentService.category) {
      changedFields.category = { old: currentService.category, new: data.category };
    }
    if (data.isActive !== undefined && data.isActive !== currentService.isActive) {
      changedFields.isActive = { old: currentService.isActive, new: data.isActive };
    }

    // Log admin action if changes were made
    if (Object.keys(changedFields).length > 0) {
      await logAdminChange({
        tableName: 'services',
        recordId: service.id,
        action: 'update',
        changedBy: data.updatedBy || 'system',
        changedFields,
      });
    }

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'updateService',
        service_id: service.id,
        service_name: service.name,
        updated_by: data.updatedBy,
        changed_fields: Object.keys(changedFields),
        duration_ms: performance.now() - startTime,
      }),
      `Service updated: ${service.name}`
    );

    return service;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'updateService',
        service_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to update service'
    );
    throw error;
  }
}

/**
 * Activate a service (soft enable)
 */
export async function activateService(id: string, activatedBy: string): Promise<Service> {
  return updateService(id, { isActive: true, updatedBy: activatedBy });
}

/**
 * Deactivate a service (soft delete)
 */
export async function deactivateService(id: string, deactivatedBy: string): Promise<Service> {
  return updateService(id, { isActive: false, updatedBy: deactivatedBy });
}

/**
 * Delete a service (hard delete)
 * NOTE: Only use for cleanup. Prefer deactivation for production.
 */
export async function deleteService(id: string, deletedBy: string): Promise<void> {
  const startTime = performance.now();

  try {
    const service = await prisma.service.delete({
      where: { id },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'services',
      recordId: id,
      action: 'delete',
      changedBy: deletedBy,
      changedFields: {
        name: { old: service.name },
        basePrice: { old: Number(service.basePrice) },
      },
    });

    logger.warn(
      createLogContext({
        action: 'db_query_executed',
        query: 'deleteService',
        service_id: id,
        service_name: service.name,
        deleted_by: deletedBy,
        duration_ms: performance.now() - startTime,
      }),
      `Service HARD DELETED: ${service.name}`
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'deleteService',
        service_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to delete service'
    );
    throw error;
  }
}

/**
 * Bulk update display order
 */
export async function updateServiceDisplayOrder(
  updates: Array<{ id: string; displayOrder: number }>,
  updatedBy: string
): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.$transaction(
      updates.map(({ id, displayOrder }) =>
        prisma.service.update({
          where: { id },
          data: { displayOrder, updatedBy },
        })
      )
    );

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'updateServiceDisplayOrder',
        update_count: updates.length,
        updated_by: updatedBy,
        duration_ms: performance.now() - startTime,
      }),
      `Updated display order for ${updates.length} services`
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'updateServiceDisplayOrder',
        update_count: updates.length,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to update service display order'
    );
    throw error;
  }
}
