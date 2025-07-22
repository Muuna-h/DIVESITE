import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // Data stays fresh for 5 minutes
      gcTime: 1000 * 60 * 30, // Cache is kept for 30 minutes
      refetchOnMount: false,
      refetchOnWindowFocus: false,
      refetchOnReconnect: 'always',
      retry: 1,
      // Custom cache key generator
      queryKeyHashFn: (queryKey: unknown) => {
        if (Array.isArray(queryKey)) {
          return queryKey.join('.');
        }
        return String(queryKey);
      },
    },
    mutations: {
      retry: 1,
    },
  },
});
