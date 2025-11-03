/**
 * Services API Endpoint Tests
 *
 * Tests for GET /api/services
 */

import { describe, it, expect, beforeAll, afterAll } from '@jest/globals';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

describe('GET /api/services', () => {
  let testServiceId: string;
  const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

  beforeAll(async () => {
    // Create a test service
    const service = await prisma.service.create({
      data: {
        name: 'API Test Service',
        slug: 'api-test-service',
        shortDescription: 'Service for API testing',
        basePrice: 5000,
        category: 'testing',
        icon: '🧪',
        isActive: true,
        isFeatured: true,
        displayOrder: 1,
        createdBy: 'api-test',
      },
    });
    testServiceId = service.id;
  });

  afterAll(async () => {
    // Clean up
    if (testServiceId) {
      await prisma.service.delete({ where: { id: testServiceId } });
    }
    await prisma.$disconnect();
  });

  it('should return active services', async () => {
    const response = await fetch(`${baseUrl}/api/services`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.meta.count).toBeGreaterThan(0);
  });

  it('should filter services by category', async () => {
    const response = await fetch(`${baseUrl}/api/services?category=testing`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(Array.isArray(data.data)).toBe(true);
    expect(data.meta.category).toBe('testing');

    // All returned services should be in the testing category
    data.data.forEach((service: { category: string }) => {
      expect(service.category).toBe('testing');
    });
  });

  it('should filter featured services', async () => {
    const response = await fetch(`${baseUrl}/api/services?featured=true`);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.meta.featured).toBe(true);

    // All returned services should be featured
    data.data.forEach((service: { isFeatured: boolean }) => {
      expect(service.isFeatured).toBe(true);
    });
  });

  it('should include cache headers', async () => {
    const response = await fetch(`${baseUrl}/api/services`);

    expect(response.headers.get('cache-control')).toBeTruthy();
    expect(response.headers.get('cache-control')).toContain('s-maxage');
  });

  it('should return proper response structure', async () => {
    const response = await fetch(`${baseUrl}/api/services`);
    const data = await response.json();

    expect(data).toHaveProperty('success');
    expect(data).toHaveProperty('data');
    expect(data).toHaveProperty('meta');
    expect(data.meta).toHaveProperty('count');
    expect(data.meta).toHaveProperty('featured');
  });

  it('should return services with correct fields', async () => {
    const response = await fetch(`${baseUrl}/api/services`);
    const data = await response.json();

    if (data.data.length > 0) {
      const service = data.data[0];

      expect(service).toHaveProperty('id');
      expect(service).toHaveProperty('name');
      expect(service).toHaveProperty('slug');
      expect(service).toHaveProperty('basePrice');
      expect(service).toHaveProperty('category');
      expect(service).toHaveProperty('isActive');
      expect(service).toHaveProperty('isFeatured');
      expect(service).toHaveProperty('displayOrder');
    }
  });
});
