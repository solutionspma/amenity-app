'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClient } from '@/lib/supabase/client';
import { AmenityProvider } from '@/contexts/AmenityContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in newer versions)
    },
  },
});

const supabase = createClient();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider>
          <AmenityProvider>
            {children}
          </AmenityProvider>
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}