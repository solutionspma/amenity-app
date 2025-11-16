'use client';

import Link from 'next/link';
import { useState } from 'react';
import SmartLogo from './SmartLogo';
import { useNavigationStyles } from '@/lib/hooks/useComponentStyles';
import { 
  HomeIcon, 
  PlayIcon, 
  CameraIcon, 
  UserIcon,
  ChatBubbleLeftIcon,
  BellIcon 
} from '@heroicons/react/24/outline';

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);
  const navStyles = useNavigationStyles({ 
    defaultStyles: { 
      backgroundColor: '#ffffff',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
    } 
  });

  return (
    <nav 
      className={`amenity-navigation amenity-component shadow-lg border-b border-gray-200 ${navStyles.className}`}
      style={navStyles.styles}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center space-x-2">
              <SmartLogo />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-500 to-orange-600 bg-clip-text text-transparent">
                Amenity
              </span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/" className="flex items-center space-x-1 text-gray-900 hover:text-blue-600">
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>
            <Link href="/shorts" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <PlayIcon className="h-5 w-5" />
              <span>Shorts</span>
            </Link>
            <Link href="/live" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <CameraIcon className="h-5 w-5" />
              <span>Live</span>
            </Link>
            <Link href="/messages" className="flex items-center space-x-1 text-gray-600 hover:text-blue-600">
              <ChatBubbleLeftIcon className="h-5 w-5" />
              <span>Messages</span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/admin/master-control" 
              className="text-sm font-medium text-gray-700 hover:text-pink-600 transition-colors"
            >
              Admin
            </Link>
            <BellIcon className="h-6 w-6 text-gray-600 hover:text-pink-600 cursor-pointer" />
            <UserIcon className="h-6 w-6 text-gray-600 hover:text-pink-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
}