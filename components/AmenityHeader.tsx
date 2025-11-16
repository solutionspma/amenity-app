'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import SmartLogo from './SmartLogo';
import ThemeToggle from './ui/ThemeToggle';
import ElegantSearchDropdown from './ui/ElegantSearchDropdown';
import { ImageUploadService } from '@/lib/services/image-upload';

interface AmenityHeaderProps {
  currentPage?: string;
  className?: string;
  showAuth?: boolean;
}

export default function AmenityHeader({ 
  currentPage = '', 
  className = "",
  showAuth = true
}: AmenityHeaderProps) {
  const MASTER_USER_ID = 'demo-user-id'; // Pastor Marcus Johnson - master account
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [isMasterUser, setIsMasterUser] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    // Check for user profile image and auth status
    const userId = localStorage.getItem('amenity_user_id') || 'demo-user-id';
    const userImage = ImageUploadService.getProfileImage(userId);
    const authStatus = localStorage.getItem('amenity_signed_in') === 'true';
    const masterStatus = userId === MASTER_USER_ID;
    
    if (userImage) setProfileImage(userImage);
    setIsSignedIn(authStatus);
    setIsMasterUser(masterStatus);

    // Add keyboard shortcut for search (Cmd+K / Ctrl+K)
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Navigation items - conditionally show based on auth and page
  const getNavItems = () => {
    const isHomepage = currentPage === '/' || currentPage === '';
    
    // Landing page nav (not signed in)
    if (isHomepage && !isSignedIn) {
      return [];
    }
    
    // Signed in nav
    const items = [
      { href: '/feed', label: 'Feed', icon: '📱' },
      { href: '/live', label: 'Live', icon: '🔴' },
      { href: '/shorts', label: 'Shorts', icon: '⚡' },
      { href: '/marketplace', label: 'Store', icon: '🛒' },
      { href: '/messages', label: 'Messages', icon: '💬' },
      { href: '/creator', label: 'Creator Channels', icon: '✨' },
      { href: '/svg-ya', label: 'SVG-YA', icon: '🎨' }
    ];
    
    // Add Modularity Engine for master user only
    if (isMasterUser) {
      items.push({ href: '/modularity-engine/', label: 'Modularity', icon: '🔧' });
    }
    
    return items;
  };
  
  const navItems = getNavItems();

  return (
    <nav className={`amenity-navigation amenity-component bg-black/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-8">
            <SmartLogo 
              showText={true}
              textClassName="text-2xl font-bold text-white dark:text-white"
            />
            
            <div className="hidden md:flex space-x-6">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-1 transition-colors ${
                    currentPage === item.href
                      ? 'text-yellow-400 font-medium'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  <span className="text-sm">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Search with keyboard hint */}
            <button 
              onClick={() => setIsSearchOpen(true)}
              className="hidden md:flex items-center space-x-2 text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg group"
              aria-label="Search"
              title="Search (⌘K)"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <span className="text-xs text-gray-500 hidden lg:block">⌘K</span>
            </button>
            
            {/* Notifications */}
            <button 
              onClick={() => {
                console.log('Notifications clicked');
                window.location.href = '/notifications';
              }}
              className="relative text-gray-300 hover:text-white transition-colors p-2 hover:bg-white/10 rounded-lg"
              aria-label="Notifications"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center animate-pulse">3</span>
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {showAuth && (
              <>
                {!isSignedIn ? (
                  <>
                    {/* Auth Buttons - only show on homepage for non-signed in users */}
                    {(currentPage === '/' || currentPage === '') && (
                      <>
                        <Link
                          href="/auth/login"
                          className="text-gray-300 hover:text-white transition-colors"
                        >
                          Sign In
                        </Link>
                        
                        <Link
                          href="/auth/register"
                          className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-black px-3 py-2 md:px-4 md:py-2 rounded-lg font-semibold transition-all text-sm md:text-base"
                        >
                          Join Now
                        </Link>
                      </>
                    )}
                  </>
                ) : (
                  <>
                    {/* Signed in state */}
                    <span className="text-green-400 text-sm hidden md:block">● Signed In</span>
                    
                    {/* Profile Dropdown */}
                    <div className="relative">
                      <button
                        onClick={() => setShowProfileMenu(!showProfileMenu)}
                        className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 flex items-center justify-center text-white font-bold hover:scale-105 transition-transform ring-2 ring-purple-400/30 hover:ring-purple-300/50"
                        style={{
                          boxShadow: '0 0 15px rgba(147, 51, 234, 0.3)'
                        }}
                      >
                        {profileImage ? (
                          <img
                            src={profileImage}
                            alt="Profile"
                            className="w-full h-full rounded-full object-cover"
                          />
                        ) : (
                          'U'
                        )}
                      </button>
                      
                      {/* Dropdown Menu */}
                      {showProfileMenu && (
                        <div className="absolute right-0 mt-2 w-56 bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden z-50">
                          <Link
                            href="/profiles/me"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <span className="text-xl">👤</span>
                            <span>My Profile</span>
                          </Link>
                          <Link
                            href="/profiles/settings"
                            className="flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-gray-800 hover:text-white transition-colors"
                            onClick={() => setShowProfileMenu(false)}
                          >
                            <span className="text-xl">⚙️</span>
                            <span>Settings</span>
                          </Link>
                          {isMasterUser && (
                            <Link
                              href="/admin/master-control"
                              className="flex items-center space-x-3 px-4 py-3 text-purple-400 hover:bg-purple-900/20 hover:text-purple-300 transition-colors border-t border-gray-700"
                              onClick={() => setShowProfileMenu(false)}
                            >
                              <span className="text-xl">👑</span>
                              <span>Master Control</span>
                            </Link>
                          )}
                          <div className="border-t border-gray-700">
                            <button
                              onClick={handleLogout}
                              className="flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors w-full text-left"
                            >
                              <span className="text-xl">🚪</span>
                              <span>Sign Out</span>
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </>
            )}

            {/* Mobile menu button */}
            <button
              className="md:hidden text-gray-300 hover:text-white"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-700 py-4">
            <div className="space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    currentPage === item.href
                      ? 'bg-yellow-400/10 text-yellow-400'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
              {showAuth && (
                <>
                  <Link
                    href="/profiles/me"
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>👤</span>
                    <span>Profile</span>
                  </Link>
                  <Link
                    href="/profiles/settings"
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <span>⚙️</span>
                    <span>Settings</span>
                  </Link>
                  {isMasterUser && (
                    <Link
                      href="/admin/master-control"
                      className="flex items-center space-x-3 px-4 py-2 rounded-lg text-purple-400 hover:bg-purple-600/20 hover:text-purple-300 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>👑</span>
                      <span>Master Control</span>
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-3 px-4 py-2 rounded-lg text-red-400 hover:bg-red-900/20 hover:text-red-300 transition-colors w-full text-left"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
      
      {/* Elegant Search Dropdown */}
      <ElegantSearchDropdown 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)}
        onNavigate={(url) => {
          setIsSearchOpen(false);
          window.location.href = url;
        }}
      />
    </nav>
  );
}