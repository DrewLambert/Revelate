/**
 * Services Repository Tests
 *
 * Tests for CRUD operations on services table
 */

import { describe, it, expect, beforeAll, afterAll, afterEach } from '@jest/globals';
import { PrismaClient } from '@prisma/client';
import * as serviceRepo from '@/lib/db/repositories/services';

const prisma = new PrismaClient();

// Test data
const testService = {
  name: 'Test Service',
  slug: 'test-service',
  shortDescription: 'This is a test service',
  fullDescription: 'This is a detailed description of the test service',
  basePrice: 5000,
  category: 'testing',
  icon: '🧪',
  isFeatured: false,
  displayOrder: 999,
  createdBy: 'test-user',
};

describe('Services Repository', () => {
  let createdServiceId: string;

  afterEach(async () => {
    // Clean up test data after each test
    if (createdServiceId) {
      try {
        await prisma.service.delete({ where: { id: createdServiceId } });
      } catch (error) {
        // Service may already be deleted
      }
      createdServiceId = '';
    }
  });

  afterAll(async () => {
    // Clean up any remaining test services
    await prisma.service.deleteMany({
      where: { slug: { startsWith: 'test-' } },
    });
    await prisma.$disconnect();
  });

  describe('createService', () => {
    it('should create a new service', async () => {
      const service = await serviceRepo.createService(testService);

      expect(service).toBeDefined();
      expect(service.id).toBeDefined();
      expect(service.name).toBe(testService.name);
      expect(service.slug).toBe(testService.slug);
      expect(Number(service.basePrice)).toBe(testService.basePrice);
      expect(service.category).toBe(testService.category);
      expect(service.isActive).toBe(true); // Default value

      createdServiceId = service.id;
    });

    it('should set default values correctly', async () => {
      const minimalService = {
        name: 'Minimal Test Service',
        slug: 'test-minimal',
        basePrice: 1000,
        category: 'test',
        createdBy: 'test-user',
      };

      const service = await serviceRepo.createService(minimalService);

      expect(service.isActive).toBe(true);
      expect(service.isFeatured).toBe(false);
      expect(service.displayOrder).toBe(0);

      createdServiceId = service.id;
    });
  });

  describe('getServiceById', () => {
    beforeAll(async () => {
      const service = await serviceRepo.createService(testService);
      createdServiceId = service.id;
    });

    it('should retrieve a service by ID', async () => {
      const service = await serviceRepo.getServiceById(createdServiceId);

      expect(service).toBeDefined();
      expect(service?.id).toBe(createdServiceId);
      expect(service?.name).toBe(testService.name);
    });

    it('should return null for non-existent ID', async () => {
      const service = await serviceRepo.getServiceById('non-existent-id');
      expect(service).toBeNull();
    });
  });

  describe('getServiceBySlug', () => {
    beforeAll(async () => {
      const service = await serviceRepo.createService(testService);
      createdServiceId = service.id;
    });

    it('should retrieve a service by slug', async () => {
      const service = await serviceRepo.getServiceBySlug(testService.slug);

      expect(service).toBeDefined();
      expect(service?.slug).toBe(testService.slug);
      expect(service?.name).toBe(testService.name);
    });

    it('should return null for non-existent slug', async () => {
      const service = await serviceRepo.getServiceBySlug('non-existent-slug');
      expect(service).toBeNull();
    });
  });

  describe('updateService', () => {
    beforeAll(async () => {
      const service = await serviceRepo.createService(testService);
      createdServiceId = service.id;
    });

    it('should update service fields', async () => {
      const updates = {
        name: 'Updated Test Service',
        basePrice: 7500,
        updatedBy: 'test-updater',
      };

      const updated = await serviceRepo.updateService(createdServiceId, updates);

      expect(updated.name).toBe(updates.name);
      expect(Number(updated.basePrice)).toBe(updates.basePrice);
      expect(updated.updatedBy).toBe(updates.updatedBy);
    });

    it('should not update fields not provided', async () => {
      const updates = {
        name: 'Only Name Updated',
        updatedBy: 'test-updater',
      };

      const updated = await serviceRepo.updateService(createdServiceId, updates);

      expect(updated.name).toBe(updates.name);
      expect(updated.category).toBe(testService.category); // Should remain unchanged
      expect(Number(updated.basePrice)).toBe(testService.basePrice); // Should remain unchanged
    });
  });

  describe('activateService / deactivateService', () => {
    beforeAll(async () => {
      const service = await serviceRepo.createService(testService);
      createdServiceId = service.id;
    });

    it('should deactivate a service', async () => {
      const deactivated = await serviceRepo.deactivateService(createdServiceId, 'test-admin');

      expect(deactivated.isActive).toBe(false);
    });

    it('should reactivate a service', async () => {
      await serviceRepo.deactivateService(createdServiceId, 'test-admin');
      const activated = await serviceRepo.activateService(createdServiceId, 'test-admin');

      expect(activated.isActive).toBe(true);
    });
  });

  describe('getActiveServices', () => {
    let activeServiceId: string;
    let inactiveServiceId: string;

    beforeAll(async () => {
      const activeService = await serviceRepo.createService({
        ...testService,
        slug: 'test-active',
      });
      const inactiveService = await serviceRepo.createService({
        ...testService,
        slug: 'test-inactive',
      });

      activeServiceId = activeService.id;
      inactiveServiceId = inactiveService.id;

      await serviceRepo.deactivateService(inactiveServiceId, 'test-admin');
    });

    afterAll(async () => {
      await prisma.service.delete({ where: { id: activeServiceId } });
      await prisma.service.delete({ where: { id: inactiveServiceId } });
    });

    it('should return only active services', async () => {
      const services = await serviceRepo.getActiveServices();

      const activeFound = services.some((s) => s.id === activeServiceId);
      const inactiveFound = services.some((s) => s.id === inactiveServiceId);

      expect(activeFound).toBe(true);
      expect(inactiveFound).toBe(false);
    });
  });

  describe('getServicesByCategory', () => {
    let testingServiceId: string;
    let otherServiceId: string;

    beforeAll(async () => {
      const testingService = await serviceRepo.createService({
        ...testService,
        slug: 'test-category-1',
        category: 'testing',
      });
      const otherService = await serviceRepo.createService({
        ...testService,
        slug: 'test-category-2',
        category: 'other',
      });

      testingServiceId = testingService.id;
      otherServiceId = otherService.id;
    });

    afterAll(async () => {
      await prisma.service.delete({ where: { id: testingServiceId } });
      await prisma.service.delete({ where: { id: otherServiceId } });
    });

    it('should return services from specified category', async () => {
      const services = await serviceRepo.getServicesByCategory('testing');

      const testingFound = services.some((s) => s.id === testingServiceId);
      const otherFound = services.some((s) => s.id === otherServiceId);

      expect(testingFound).toBe(true);
      expect(otherFound).toBe(false);
    });
  });

  describe('deleteService', () => {
    it('should hard delete a service', async () => {
      const service = await serviceRepo.createService({
        ...testService,
        slug: 'test-to-delete',
      });

      await serviceRepo.deleteService(service.id, 'test-admin');

      const deleted = await serviceRepo.getServiceById(service.id);
      expect(deleted).toBeNull();
    });
  });
});
