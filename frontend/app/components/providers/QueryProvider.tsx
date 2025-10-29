'use client';

/**
 * React Query Provider
 * Provides React Query context to the application
 * Must be a client component - only renders on client side
 */

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactNode, useState, useEffect } from 'react';

interface QueryProviderProps {
  children: ReactNode;
}

//  Create QueryClient instance
function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Disable automatic refetching on window focus in production
        refetchOnWindowFocus: process.env.NODE_ENV === 'development',
        // Retry failed requests once
        retry: 1,
        // Cache data for 5 minutes by default
        staleTime: 5 * 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  // Always use browser client in client components
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

export function QueryProvider({ children }: QueryProviderProps) {
  const [queryClient] = useState(() => getQueryClient());
  const [isMounted, setIsMounted] = useState(false);

  // Only render on client side to avoid SSR issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Return children without QueryProvider during SSR
  if (!isMounted) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
