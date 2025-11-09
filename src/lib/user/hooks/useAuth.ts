/**
 * Convenience hook for auth state
 * Provides a clean API similar to the old authStore
 * but backed by React Query
 */

import { useUserQuery } from './useUserQuery';

export function useAuth() {
  const { data: user, isLoading, isError, error } = useUserQuery();
  
  return {
    user: user ?? null,
    loading: isLoading,
    isAuthenticated: !!user,
    isError,
    error,
  };
}

