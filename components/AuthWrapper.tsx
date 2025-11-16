'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface AuthWrapperProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
  redirectTo?: string;
}

export default function AuthWrapper({ 
  children, 
  requireAdmin = false, 
  redirectTo = '/auth/login' 
}: AuthWrapperProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is logged in
        const authCheck = await fetch('/api/auth/check', {
          credentials: 'include'
        });

        if (authCheck.ok) {
          const userData = await authCheck.json();
          setIsAuthenticated(true);
          setIsAdmin(userData.isAdmin || userData.role === 'admin');
        } else {
          // Mock authentication for development
          const mockAuth = localStorage.getItem('amenity_auth');
          const mockUser = localStorage.getItem('amenity_user');
          
          if (mockAuth && mockUser) {
            const user = JSON.parse(mockUser);
            setIsAuthenticated(true);
            setIsAdmin(user.role === 'admin' || user.isAdmin);
          }
        }
      } catch (error) {
        console.warn('Auth check failed, using mock auth');
        
        // Fallback to localStorage mock
        const mockAuth = localStorage.getItem('amenity_auth');
        const mockUser = localStorage.getItem('amenity_user');
        
        if (mockAuth && mockUser) {
          const user = JSON.parse(mockUser);
          setIsAuthenticated(true);
          setIsAdmin(user.role === 'admin' || user.isAdmin);
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }
      
      if (requireAdmin && !isAdmin) {
        router.push('/dashboard?error=admin_required');
        return;
      }
    }
  }, [isAuthenticated, isAdmin, isLoading, requireAdmin, redirectTo, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-400 mx-auto mb-4"></div>
          <p className="text-white text-lg">Authenticating...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Authentication Required</h1>
          <p className="text-gray-300 mb-6">Please sign in to access this page.</p>
          <button 
            onClick={() => router.push(redirectTo)}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Sign In
          </button>
        </div>
      </div>
    );
  }

  if (requireAdmin && !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-white text-2xl mb-4">Admin Access Required</h1>
          <p className="text-gray-300 mb-6">You need administrator privileges to access this page.</p>
          <button 
            onClick={() => router.push('/dashboard')}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-3 rounded-lg font-semibold"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Mock authentication helper for development
export const mockLogin = (email: string, password: string, isAdmin = false) => {
  const userData = {
    id: '1',
    email,
    name: email.split('@')[0],
    role: isAdmin ? 'admin' : 'user',
    isAdmin,
    avatar: '/logos/pitch-ball-logo.png'
  };

  localStorage.setItem('amenity_auth', 'mock_token');
  localStorage.setItem('amenity_user', JSON.stringify(userData));
  
  return userData;
};

export const mockLogout = () => {
  localStorage.removeItem('amenity_auth');
  localStorage.removeItem('amenity_user');
};