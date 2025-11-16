/**
 * React Query client configuration
 * Provides global defaults for queries and mutations
 */

import { QueryClient, QueryFunction } from '@tanstack/react-query';
import { getBackendUrl, getApiHeaders } from '@/lib/api';
import { mapUserResponse } from '@/lib/user/mapUserResponse';
import type { User } from "@/lib/user/types";

/**
 * Default query function for user/me endpoint
 */
const userMeQueryFn: QueryFunction<User | null> = async () => {
  // Use relative URL to go through Next.js proxy instead of hitting backend directly
  // This avoids CORS issues and ensures consistent behavior across all environments
  const response = await fetch('/api/user/me', {
    method: 'GET',
    headers: getApiHeaders(),
    credentials: 'include',
  });

  // Only clear user on 401/403 (invalid cookie), not on network errors
  if (response.status === 401 || response.status === 403) {
    console.log('Authentication invalid (401/403)');
    return null;
  }

  // If server error or network error, throw to trigger retry
  if (!response.ok) {
    throw new Error(`Auth check failed with status ${response.status}`);
  }

  const responseText = await response.text();

  let data;
  try {
    data = JSON.parse(responseText);
  } catch (error) {
    console.error('Invalid JSON response from server:', error);
    throw new Error('Invalid JSON response');
  }

  return mapUserResponse(data);
};

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: async (context) => {
        // Handle user/me query
        if (context.queryKey[0] === 'user' && context.queryKey[1] === 'me') {
          return userMeQueryFn(context);
        }
        // For other queries, they should provide their own queryFn
        throw new Error(`No default queryFn configured for ${JSON.stringify(context.queryKey)}`);
      },
      // Consider data fresh for 2 minutes
      staleTime: 2 * 60 * 1000,
      // Keep unused data in cache for 5 minutes
      gcTime: 5 * 60 * 1000,
      // Don't refetch on every window focus - implement smarter strategy in useUserQuery
      refetchOnWindowFocus: false,
      // Refetch when network reconnects
      refetchOnReconnect: true,
      // Retry failed requests up to 3 times
      retry: (failureCount, error) => {
        // Don't retry on auth errors (401/403)
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes('401') || errorMessage.includes('403')) {
          return false;
        }
        // Retry up to 3 times for other errors
        return failureCount < 3;
      },
      // Exponential backoff for retries
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
    },
    mutations: {
      // Don't retry failed mutations - auth should fail fast
      retry: 0,
      // No retry delay for mutations (fail fast)
      retryDelay: 0,
    },
  },
});

/**
 * Create a new QueryClient instance
 * Useful for testing or creating isolated client instances
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: queryClient.getDefaultOptions(),
  });
}
