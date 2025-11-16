'use client';

import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SessionContextProvider } from '@supabase/auth-helpers-react';
import { createClient } from '@/lib/supabase/client';
import { AmenityProvider } from '@/contexts/AmenityContext';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { BackdropProvider } from '@/contexts/BackdropContext';
import { ElementProvider } from '@/contexts/ElementContext';
import GlobalStyleInjector from '@/components/GlobalStyleInjector';
import AdvancedColorPicker from '@/components/ui/AdvancedColorPicker';
import { EnhancedAdminSecurity } from '@/lib/services/enhanced-admin-security';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000, // 1 minute
      gcTime: 10 * 60 * 1000, // 10 minutes (renamed from cacheTime in newer versions)
    },
  },
});

const supabase = createClient();

// Initialize admin security system
if (typeof window !== 'undefined') {
  EnhancedAdminSecurity.initializeAdminSystem().catch(console.error);
}

export function Providers({ children }: { children: React.ReactNode }) {
  const MASTER_USER_ID = 'demo-user-id'; // Pastor Marcus Johnson - master account
  const [isAdmin, setIsAdmin] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    
    // Check if current user is the master user
    const currentUserId = localStorage.getItem('amenity_user_id');
    const isMasterUser = currentUserId === MASTER_USER_ID;
    
    // Also check admin security system
    EnhancedAdminSecurity.checkAdminStatus().then(status => {
      setIsAdmin(status.isAdmin || isMasterUser);
    });
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <SessionContextProvider supabaseClient={supabase}>
        <ThemeProvider>
          <BackdropProvider>
            <ElementProvider>
              <AmenityProvider>
                <GlobalStyleInjector />
                {children}
                <AdvancedColorPicker isAdmin={isAdmin} />
              </AmenityProvider>
            </ElementProvider>
          </BackdropProvider>
        </ThemeProvider>
      </SessionContextProvider>
    </QueryClientProvider>
  );
}