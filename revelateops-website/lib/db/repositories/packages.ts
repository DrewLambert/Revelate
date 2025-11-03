import { Prisma } from '@prisma/client';
import { prisma } from '../prisma';
import { logger } from '@/lib/monitoring/logger';
import { createLogContext } from '@/lib/monitoring/log-utils';
import { logAdminChange } from './audit';

/**
 * Package Repository
 *
 * Handles all database operations for the Package model.
 * Includes package-service relationship management.
 */

export type Package = Prisma.PackageGetPayload<{}>;
export type PackageWithServices = Prisma.PackageGetPayload<{
  include: {
    packageServices: {
      include: { service: true };
    };
  };
}>;
export type PackageWithAll = Prisma.PackageGetPayload<{
  include: {
    packageServices: {
      include: { service: true };
    };
    scopingFactors: true;
    scopingRules: true;
  };
}>;

export interface CreatePackageInput {
  name: string;
  slug: string;
  type: 'stage' | 'targeted' | 'custom';
  stage?: string;
  targetArrMin?: bigint;
  targetArrMax?: bigint;
  tagline?: string;
  shortDescription?: string;
  fullDescription?: string;
  basePrice: number;
  discountPercentage?: number;
  timelineWeeksMin?: number;
  timelineWeeksMax?: number;
  icon?: string;
  badge?: string;
  inputsDescription?: string;
  deliveryRhythmDescription?: string;
  outputsDescription?: string;
  successCriteriaDescription?: string;
  guaranteeDescription?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  createdBy?: string;
}

export interface UpdatePackageInput {
  name?: string;
  slug?: string;
  type?: 'stage' | 'targeted' | 'custom';
  stage?: string;
  targetArrMin?: bigint;
  targetArrMax?: bigint;
  tagline?: string;
  shortDescription?: string;
  fullDescription?: string;
  basePrice?: number;
  discountPercentage?: number;
  timelineWeeksMin?: number;
  timelineWeeksMax?: number;
  icon?: string;
  badge?: string;
  inputsDescription?: string;
  deliveryRhythmDescription?: string;
  outputsDescription?: string;
  successCriteriaDescription?: string;
  guaranteeDescription?: string;
  isFeatured?: boolean;
  displayOrder?: number;
  isActive?: boolean;
  updatedBy?: string;
}

export interface PackageServiceInput {
  serviceId: string;
  isCore: boolean;
  quantity?: number;
  displayOrder?: number;
}

/**
 * Get all active packages, ordered by display order
 */
export async function getActivePackages(): Promise<Package[]> {
  const startTime = performance.now();

  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getActivePackages',
        package_count: packages.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${packages.length} active packages`
    );

    return packages;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getActivePackages',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get active packages'
    );
    throw error;
  }
}

/**
 * Get packages by type
 */
export async function getPackagesByType(
  type: 'stage' | 'targeted' | 'custom',
  activeOnly = true
): Promise<Package[]> {
  const startTime = performance.now();

  try {
    const packages = await prisma.package.findMany({
      where: {
        type,
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
        query: 'getPackagesByType',
        type,
        active_only: activeOnly,
        package_count: packages.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${packages.length} packages for type: ${type}`
    );

    return packages;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getPackagesByType',
        type,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get packages by type'
    );
    throw error;
  }
}

/**
 * Get package by ID
 */
export async function getPackageById(id: string): Promise<Package | null> {
  const startTime = performance.now();

  try {
    const pkg = await prisma.package.findUnique({
      where: { id },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getPackageById',
        package_id: id,
        found: !!pkg,
        duration_ms: performance.now() - startTime,
      }),
      pkg ? 'Package retrieved' : 'Package not found'
    );

    return pkg;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getPackageById',
        package_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get package by ID'
    );
    throw error;
  }
}

/**
 * Get package by slug
 */
export async function getPackageBySlug(slug: string): Promise<Package | null> {
  const startTime = performance.now();

  try {
    const pkg = await prisma.package.findUnique({
      where: { slug },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getPackageBySlug',
        slug,
        found: !!pkg,
        duration_ms: performance.now() - startTime,
      }),
      pkg ? 'Package retrieved' : 'Package not found'
    );

    return pkg;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getPackageBySlug',
        slug,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get package by slug'
    );
    throw error;
  }
}

/**
 * Get package with services
 */
export async function getPackageWithServices(id: string): Promise<PackageWithServices | null> {
  const startTime = performance.now();

  try {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        packageServices: {
          include: {
            service: true,
          },
          orderBy: [
            { isCore: 'desc' },
            { displayOrder: 'asc' },
          ],
        },
      },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getPackageWithServices',
        package_id: id,
        found: !!pkg,
        service_count: pkg?.packageServices.length ?? 0,
        duration_ms: performance.now() - startTime,
      }),
      pkg
        ? `Package retrieved with ${pkg.packageServices.length} services`
        : 'Package not found'
    );

    return pkg;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getPackageWithServices',
        package_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get package with services'
    );
    throw error;
  }
}

/**
 * Get package with all related data (services, scoping factors, rules)
 */
export async function getPackageWithAll(id: string): Promise<PackageWithAll | null> {
  const startTime = performance.now();

  try {
    const pkg = await prisma.package.findUnique({
      where: { id },
      include: {
        packageServices: {
          include: {
            service: true,
          },
          orderBy: [
            { isCore: 'desc' },
            { displayOrder: 'asc' },
          ],
        },
        scopingFactors: {
          where: { isActive: true },
          orderBy: { displayOrder: 'asc' },
        },
        scopingRules: {
          where: { isActive: true },
          orderBy: { priority: 'asc' },
        },
      },
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getPackageWithAll',
        package_id: id,
        found: !!pkg,
        service_count: pkg?.packageServices.length ?? 0,
        scoping_factor_count: pkg?.scopingFactors.length ?? 0,
        scoping_rule_count: pkg?.scopingRules.length ?? 0,
        duration_ms: performance.now() - startTime,
      }),
      pkg ? 'Package retrieved with all related data' : 'Package not found'
    );

    return pkg;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getPackageWithAll',
        package_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get package with all data'
    );
    throw error;
  }
}

/**
 * Get all packages (admin view)
 */
export async function getAllPackages(): Promise<Package[]> {
  const startTime = performance.now();

  try {
    const packages = await prisma.package.findMany({
      orderBy: [
        { isActive: 'desc' },
        { type: 'asc' },
        { displayOrder: 'asc' },
        { name: 'asc' },
      ],
    });

    logger.debug(
      createLogContext({
        action: 'db_query_executed',
        query: 'getAllPackages',
        package_count: packages.length,
        duration_ms: performance.now() - startTime,
      }),
      `Retrieved ${packages.length} packages (admin view)`
    );

    return packages;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'getAllPackages',
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to get all packages'
    );
    throw error;
  }
}

/**
 * Create a new package
 */
export async function createPackage(data: CreatePackageInput): Promise<Package> {
  const startTime = performance.now();

  try {
    const pkg = await prisma.package.create({
      data: {
        name: data.name,
        slug: data.slug,
        type: data.type,
        stage: data.stage,
        targetArrMin: data.targetArrMin,
        targetArrMax: data.targetArrMax,
        tagline: data.tagline,
        shortDescription: data.shortDescription,
        fullDescription: data.fullDescription,
        basePrice: data.basePrice,
        discountPercentage: data.discountPercentage ?? 0,
        timelineWeeksMin: data.timelineWeeksMin,
        timelineWeeksMax: data.timelineWeeksMax,
        icon: data.icon,
        badge: data.badge,
        inputsDescription: data.inputsDescription,
        deliveryRhythmDescription: data.deliveryRhythmDescription,
        outputsDescription: data.outputsDescription,
        successCriteriaDescription: data.successCriteriaDescription,
        guaranteeDescription: data.guaranteeDescription,
        isFeatured: data.isFeatured ?? false,
        displayOrder: data.displayOrder ?? 0,
        createdBy: data.createdBy,
        updatedBy: data.createdBy,
      },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'packages',
      recordId: pkg.id,
      action: 'create',
      changedBy: data.createdBy || 'system',
      changedFields: {
        name: { new: pkg.name },
        basePrice: { new: Number(pkg.basePrice) },
        type: { new: pkg.type },
      },
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'createPackage',
        package_id: pkg.id,
        package_name: pkg.name,
        created_by: data.createdBy,
        duration_ms: performance.now() - startTime,
      }),
      `Package created: ${pkg.name}`
    );

    return pkg;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'createPackage',
        package_name: data.name,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to create package'
    );
    throw error;
  }
}

/**
 * Update a package
 */
export async function updatePackage(id: string, data: UpdatePackageInput): Promise<Package> {
  const startTime = performance.now();

  try {
    // Get current state for audit log
    const currentPackage = await prisma.package.findUnique({ where: { id } });
    if (!currentPackage) {
      throw new Error(`Package not found: ${id}`);
    }

    // Update package
    const pkg = await prisma.package.update({
      where: { id },
      data: {
        ...(data.name !== undefined && { name: data.name }),
        ...(data.slug !== undefined && { slug: data.slug }),
        ...(data.type !== undefined && { type: data.type }),
        ...(data.stage !== undefined && { stage: data.stage }),
        ...(data.targetArrMin !== undefined && { targetArrMin: data.targetArrMin }),
        ...(data.targetArrMax !== undefined && { targetArrMax: data.targetArrMax }),
        ...(data.tagline !== undefined && { tagline: data.tagline }),
        ...(data.shortDescription !== undefined && {
          shortDescription: data.shortDescription,
        }),
        ...(data.fullDescription !== undefined && { fullDescription: data.fullDescription }),
        ...(data.basePrice !== undefined && { basePrice: data.basePrice }),
        ...(data.discountPercentage !== undefined && {
          discountPercentage: data.discountPercentage,
        }),
        ...(data.timelineWeeksMin !== undefined && {
          timelineWeeksMin: data.timelineWeeksMin,
        }),
        ...(data.timelineWeeksMax !== undefined && {
          timelineWeeksMax: data.timelineWeeksMax,
        }),
        ...(data.icon !== undefined && { icon: data.icon }),
        ...(data.badge !== undefined && { badge: data.badge }),
        ...(data.inputsDescription !== undefined && {
          inputsDescription: data.inputsDescription,
        }),
        ...(data.deliveryRhythmDescription !== undefined && {
          deliveryRhythmDescription: data.deliveryRhythmDescription,
        }),
        ...(data.outputsDescription !== undefined && {
          outputsDescription: data.outputsDescription,
        }),
        ...(data.successCriteriaDescription !== undefined && {
          successCriteriaDescription: data.successCriteriaDescription,
        }),
        ...(data.guaranteeDescription !== undefined && {
          guaranteeDescription: data.guaranteeDescription,
        }),
        ...(data.isFeatured !== undefined && { isFeatured: data.isFeatured }),
        ...(data.displayOrder !== undefined && { displayOrder: data.displayOrder }),
        ...(data.isActive !== undefined && { isActive: data.isActive }),
        updatedBy: data.updatedBy,
      },
    });

    // Build changed fields for audit log
    const changedFields: Record<string, { old: unknown; new: unknown }> = {};
    if (data.name !== undefined && data.name !== currentPackage.name) {
      changedFields.name = { old: currentPackage.name, new: data.name };
    }
    if (data.basePrice !== undefined && data.basePrice !== Number(currentPackage.basePrice)) {
      changedFields.basePrice = {
        old: Number(currentPackage.basePrice),
        new: data.basePrice,
      };
    }
    if (data.isActive !== undefined && data.isActive !== currentPackage.isActive) {
      changedFields.isActive = { old: currentPackage.isActive, new: data.isActive };
    }

    // Log admin action if changes were made
    if (Object.keys(changedFields).length > 0) {
      await logAdminChange({
        tableName: 'packages',
        recordId: pkg.id,
        action: 'update',
        changedBy: data.updatedBy || 'system',
        changedFields,
      });
    }

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'updatePackage',
        package_id: pkg.id,
        package_name: pkg.name,
        updated_by: data.updatedBy,
        changed_fields: Object.keys(changedFields),
        duration_ms: performance.now() - startTime,
      }),
      `Package updated: ${pkg.name}`
    );

    return pkg;
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'updatePackage',
        package_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to update package'
    );
    throw error;
  }
}

/**
 * Add service to package
 */
export async function addServiceToPackage(
  packageId: string,
  serviceData: PackageServiceInput,
  addedBy: string
): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.packageService.create({
      data: {
        packageId,
        serviceId: serviceData.serviceId,
        isCore: serviceData.isCore,
        quantity: serviceData.quantity ?? 1,
        displayOrder: serviceData.displayOrder ?? 0,
      },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'package_services',
      recordId: packageId,
      action: 'create',
      changedBy: addedBy,
      changedFields: {
        serviceId: { new: serviceData.serviceId },
        isCore: { new: serviceData.isCore },
      },
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'addServiceToPackage',
        package_id: packageId,
        service_id: serviceData.serviceId,
        added_by: addedBy,
        duration_ms: performance.now() - startTime,
      }),
      'Service added to package'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'addServiceToPackage',
        package_id: packageId,
        service_id: serviceData.serviceId,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to add service to package'
    );
    throw error;
  }
}

/**
 * Remove service from package
 */
export async function removeServiceFromPackage(
  packageId: string,
  serviceId: string,
  removedBy: string
): Promise<void> {
  const startTime = performance.now();

  try {
    await prisma.packageService.delete({
      where: {
        packageId_serviceId: {
          packageId,
          serviceId,
        },
      },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'package_services',
      recordId: packageId,
      action: 'delete',
      changedBy: removedBy,
      changedFields: {
        serviceId: { old: serviceId },
      },
    });

    logger.info(
      createLogContext({
        action: 'db_query_executed',
        query: 'removeServiceFromPackage',
        package_id: packageId,
        service_id: serviceId,
        removed_by: removedBy,
        duration_ms: performance.now() - startTime,
      }),
      'Service removed from package'
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'removeServiceFromPackage',
        package_id: packageId,
        service_id: serviceId,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to remove service from package'
    );
    throw error;
  }
}

/**
 * Activate a package (soft enable)
 */
export async function activatePackage(id: string, activatedBy: string): Promise<Package> {
  return updatePackage(id, { isActive: true, updatedBy: activatedBy });
}

/**
 * Deactivate a package (soft delete)
 */
export async function deactivatePackage(id: string, deactivatedBy: string): Promise<Package> {
  return updatePackage(id, { isActive: false, updatedBy: deactivatedBy });
}

/**
 * Delete a package (hard delete)
 * NOTE: Only use for cleanup. Prefer deactivation for production.
 */
export async function deletePackage(id: string, deletedBy: string): Promise<void> {
  const startTime = performance.now();

  try {
    const pkg = await prisma.package.delete({
      where: { id },
    });

    // Log admin action
    await logAdminChange({
      tableName: 'packages',
      recordId: id,
      action: 'delete',
      changedBy: deletedBy,
      changedFields: {
        name: { old: pkg.name },
        basePrice: { old: Number(pkg.basePrice) },
      },
    });

    logger.warn(
      createLogContext({
        action: 'db_query_executed',
        query: 'deletePackage',
        package_id: id,
        package_name: pkg.name,
        deleted_by: deletedBy,
        duration_ms: performance.now() - startTime,
      }),
      `Package HARD DELETED: ${pkg.name}`
    );
  } catch (error) {
    logger.error(
      createLogContext({
        action: 'db_query_failed',
        query: 'deletePackage',
        package_id: id,
        error,
        duration_ms: performance.now() - startTime,
      }),
      'Failed to delete package'
    );
    throw error;
  }
}
