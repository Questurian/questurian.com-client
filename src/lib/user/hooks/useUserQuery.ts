/**
 * User query hooks using React Query
 * Core authentication queries and mutations used app-wide
 */

import { useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { User } from "@/lib/user/types";
import { getBackendUrl, getApiHeaders, post, isServiceUnavailableError } from '@/lib/api';
import { mapUserResponse } from '@/lib/user/mapUserResponse';

/**
 * Query the current authenticated user
 * Uses smart refetch strategy:
 * - Data is considered fresh for 2 minutes (no refetch)
 * - If previous request failed, refetch on window focus to detect recovery
 * - Data refetches on network reconnect
 * - Component mount respects stale time (no aggressive invalidation)
 */
export function useUserQuery() {
  const query = useQuery({
    queryKey: queryKeys.userMe(),
    queryFn: async (): Promise<User | null> => {
      const headers = getApiHeaders();

      console.log('[useUserQuery] Fetching user data from: /api/user/me (via proxy)');

      // Use relative URL to go through Next.js API proxy
      const response = await fetch('/api/user/me', {
        method: 'GET',
        headers: headers,
        credentials: 'include',
      });

      console.log('[useUserQuery] Response status:', response.status);

      // Only clear user on 401/403 (invalid cookie), not on network errors
      if (response.status === 401 || response.status === 403) {
        console.log('[useUserQuery] Auth invalid - user is not logged in');
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
      } catch {
        throw new Error('Invalid JSON response');
      }

      const mappedData = mapUserResponse(data);
      console.log('[useUserQuery] Successfully fetched user:', mappedData?.email);
      return mappedData;
    },
    // Don't retry on auth errors (handled above)
    retry: (failureCount, error) => {
      const errorMessage = error instanceof Error ? error.message : String(error);
      if (errorMessage.includes('401') || errorMessage.includes('403')) {
        return false;
      }
      return failureCount < 3;
    },
    // Consider data fresh for 2 minutes
    staleTime: 2 * 60 * 1000,
    // Only refetch stale data on mount (don't invalidate fresh data)
    refetchOnMount: (query) => query.isStale(),
    // Don't refetch on window focus (handled by smart logic below)
    refetchOnWindowFocus: false,
    // Refetch on reconnect to detect if backend is back online
    refetchOnReconnect: true,
  });

  // Smart window focus refetch: only refetch if previous request failed
  // This handles backend recovery without constant unnecessary API calls
  useEffect(() => {
    const handleWindowFocus = () => {
      // Only refetch if the query is in an error state
      // This detects when backend comes back online after being down
      if (query.isError) {
        query.refetch();
      }
    };

    window.addEventListener('focus', handleWindowFocus);
    return () => {
      window.removeEventListener('focus', handleWindowFocus);
    };
  }, [query]);

  return query;
}

/**
 * Login mutation
 */
interface LoginVariables {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
}

export function useLoginMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: LoginVariables): Promise<LoginResponse> => {
      try {
        return post<LoginResponse>('/api/auth/login', {
          email: variables.email,
          password: variables.password,
        });
      } catch (error) {
        // Check if it's a service unavailability error
        if (isServiceUnavailableError(error)) {
          throw new Error('Service is unavailable. Please try again later.');
        }

        // Re-throw other errors
        throw error;
      }
    },
    onSuccess: () => {
      // Invalidate and refetch user data to ensure we have complete membership info
      // Cookie is automatically set by backend
      queryClient.invalidateQueries({ queryKey: queryKeys.userMe() });
    },
  });
}

/**
 * Logout mutation
 */
export function useLogoutMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      try {
        console.log('[LOGOUT] Starting logout request...');
        const backendUrl = getBackendUrl();
        const response = await fetch(`${backendUrl}/api/auth/logout`, {
          method: 'POST',
          headers: getApiHeaders(),
          credentials: 'include',
        });

        console.log('[LOGOUT] Backend response status:', response.status);

        // Proceed with local cleanup even if logout request fails
        if (!response.ok) {
          const text = await response.text();
          throw new Error(`Logout failed with status ${response.status}: ${text}`);
        }
        console.log('[LOGOUT] Backend logout successful');
      } catch (error) {
        // Check if it's a service unavailability error but proceed with cleanup anyway
        if (isServiceUnavailableError(error)) {
          console.warn('[LOGOUT] Service unavailable during logout, proceeding with local cleanup');
        } else {
          console.warn('[LOGOUT] Logout request failed, proceeding with local cleanup:', error);
        }
        // Don't re-throw - proceed with cleanup
      }
    },
    onSettled: () => {
      console.log('[LOGOUT] onSettled called - starting cache cleanup');

      // Log current cache state before clearing
      const cacheData = queryClient.getQueryData(queryKeys.userMe());
      console.log('[LOGOUT] Current user cache before clear:', cacheData);

      // Clear all queries BEFORE redirecting to ensure cache is completely cleared
      // This prevents React Query from keeping cached user data in memory
      console.log('[LOGOUT] Calling queryClient.clear()...');
      queryClient.clear();

      console.log('[LOGOUT] Cache cleared. Verifying...');
      const cacheDataAfter = queryClient.getQueryData(queryKeys.userMe());
      console.log('[LOGOUT] User cache after clear:', cacheDataAfter);

      console.log('[LOGOUT] All queries in cache:', queryClient.getQueryCache().getAll());

      // Force full page reload to ensure clean state
      console.log('[LOGOUT] Redirecting to home page...');
      window.location.href = '/';
    },
  });
}

/**
 * Signup mutation
 */
interface SignupVariables {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

interface SignupResponse {
  requiresVerification?: boolean;
  message?: string;
  user?: User;
}

export function useSignupMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (variables: SignupVariables): Promise<SignupResponse> => {
      try {
        return post<SignupResponse>('/api/auth/signup', {
          email: variables.email,
          password: variables.password,
          firstName: variables.firstName,
          lastName: variables.lastName,
        });
      } catch (error) {
        // Check if it's a service unavailability error
        if (isServiceUnavailableError(error)) {
          throw new Error('Service is unavailable. Please try again later.');
        }

        // Re-throw other errors
        throw error;
      }
    },
    onSuccess: (data) => {
      // If user is present, invalidate and refetch to get complete membership data
      // Cookie is automatically set by backend
      if (data.user) {
        queryClient.invalidateQueries({ queryKey: queryKeys.userMe() });
      }
    },
  });
}
