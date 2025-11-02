import { useState, useCallback } from 'react';

/**
 * Hook for making authenticated admin API calls
 *
 * Usage:
 * const { callApi, loading, error } = useAdminApi();
 *
 * const services = await callApi('/api/admin/services', 'GET');
 * const newService = await callApi('/api/admin/services', 'POST', { name: 'Test', ... });
 */

interface AdminApiOptions {
  method?: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  body?: unknown;
}

interface AdminApiResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export function useAdminApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const getAdminKey = useCallback(() => {
    // In production, this should come from secure authentication
    // For now, check localStorage or environment
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_api_key') || process.env.NEXT_PUBLIC_ADMIN_API_KEY;
    }
    return null;
  }, []);

  const getAdminUser = useCallback(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('admin_user') || 'admin';
    }
    return 'admin';
  }, []);

  const callApi = useCallback(
    async <T = unknown,>(
      endpoint: string,
      method: 'GET' | 'POST' | 'PATCH' | 'DELETE' = 'GET',
      body?: unknown
    ): Promise<T | null> => {
      setLoading(true);
      setError(null);

      try {
        const adminKey = getAdminKey();
        if (!adminKey) {
          throw new Error('Admin API key not found. Please set up authentication.');
        }

        const headers: HeadersInit = {
          'Content-Type': 'application/json',
          'X-Admin-Key': adminKey,
          'X-Admin-User': getAdminUser(),
        };

        const options: RequestInit = {
          method,
          headers,
          ...(body && { body: JSON.stringify(body) }),
        };

        const response = await fetch(endpoint, options);
        const result: AdminApiResult<T> = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || result.error || 'API request failed');
        }

        setLoading(false);
        return result.data as T;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
        setError(errorMessage);
        setLoading(false);
        throw err;
      }
    },
    [getAdminKey, getAdminUser]
  );

  return {
    callApi,
    loading,
    error,
    setError,
  };
}

// Admin API key management helpers
export const setAdminCredentials = (apiKey: string, user: string = 'admin') => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('admin_api_key', apiKey);
    localStorage.setItem('admin_user', user);
  }
};

export const clearAdminCredentials = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('admin_api_key');
    localStorage.removeItem('admin_user');
  }
};

export const hasAdminCredentials = (): boolean => {
  if (typeof window !== 'undefined') {
    return !!localStorage.getItem('admin_api_key');
  }
  return false;
};
