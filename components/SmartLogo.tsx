'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useLogoStyles } from '@/lib/hooks/useComponentStyles';
import { useBackdrop } from '@/contexts/BackdropContext';

interface SmartLogoProps {
  className?: string;
  showText?: boolean;
  textClassName?: string;
}

export default function SmartLogo({ className = "h-8 w-auto", showText = true, textClassName = "text-xl font-bold text-white" }: SmartLogoProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [lastActivity, setLastActivity] = useState(Date.now());
  
  // Get custom styles from visual editor
  const logoStyles = useLogoStyles();
  const { getBackdropForPage } = useBackdrop();
  
  // Get current page backdrop to adapt logo styling
  const currentPage = typeof window !== 'undefined' ? window.location.pathname.split('/')[1] || 'homepage' : 'homepage';
  const pageBackdrop = getBackdropForPage(currentPage);
  
  // Adapt logo text color based on background
  const getAdaptiveTextColor = () => {
    if (logoStyles.hasCustomStyles) return textClassName; // Use custom style if set
    
    // Adapt based on background
    if (pageBackdrop.type === 'solid' && pageBackdrop.solid?.includes('fff')) {
      return "text-xl font-bold text-gray-900"; // Dark text on light background
    }
    return textClassName; // Default light text
  };
  
  // Check authentication status
  useEffect(() => {
    // Check if user is signed in (you can replace this with your actual auth check)
    const checkAuth = () => {
      const token = localStorage.getItem('supabase.auth.token');
      const session = localStorage.getItem('sb-session');
      setIsAuthenticated(!!token || !!session);
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    // Track user activity
    const updateActivity = () => setLastActivity(Date.now());
    
    document.addEventListener('mousedown', updateActivity);
    document.addEventListener('keydown', updateActivity);
    document.addEventListener('scroll', updateActivity);
    document.addEventListener('touchstart', updateActivity);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
      document.removeEventListener('mousedown', updateActivity);
      document.removeEventListener('keydown', updateActivity);
      document.removeEventListener('scroll', updateActivity);
      document.removeEventListener('touchstart', updateActivity);
    };
  }, []);

  // Check for inactivity (configurable from master control - default 30 minutes)
  const inactivityTimeout = 30 * 60 * 1000; // 30 minutes in milliseconds
  const isInactive = Date.now() - lastActivity > inactivityTimeout;

  // Determine destination based on auth status and activity
  const getDestination = () => {
    if (!isAuthenticated || isInactive) {
      return '/';
    }
    return '/profile'; // Or dashboard/feed page for authenticated users
  };

  return (
    <Link 
      href={getDestination()} 
      className={`amenity-logo amenity-component flex items-center hover:opacity-80 transition-opacity ${logoStyles.className}`}
      style={logoStyles.styles}
    >
      {/* Professional Amenity SVG logo */}
      <img 
        src="/logos/amenity-logo-white.svg" 
        alt="Amenity - Faith Community Platform" 
        className="h-8 w-auto dark:block hidden"
      />
      <img 
        src="/logos/amenity-logo-dark.svg" 
        alt="Amenity - Faith Community Platform" 
        className="h-8 w-auto light:block dark:hidden"
      />
    </Link>
  );
}