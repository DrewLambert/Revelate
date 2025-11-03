import { useState, useEffect } from 'react';

/**
 * Hook for fetching services from the database API
 *
 * Usage:
 * const { services, loading, error } = useServices();
 * const { services, loading, error } = useServices('architecture'); // filter by category
 */

export interface Service {
  id: string;
  name: string;
  slug: string;
  shortDescription?: string;
  fullDescription?: string;
  basePrice: number;
  category: string;
  icon?: string;
  isActive: boolean;
  isFeatured: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface UseServicesResult {
  services: Service[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export function useServices(category?: string): UseServicesResult {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (category) {
        params.append('category', category);
      }

      const url = `/api/services${params.toString() ? `?${params.toString()}` : ''}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to fetch services: ${response.statusText}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.message || result.error || 'Failed to fetch services');
      }

      setServices(result.data || []);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, [category]);

  return {
    services,
    loading,
    error,
    refetch: fetchServices,
  };
}
