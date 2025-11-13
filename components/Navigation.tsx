'use client';

import Link from 'next/link';
import { useState } from 'react';
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

  return (
    <nav className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center">
              <span className="text-2xl font-bold text-blue-600">Amenity</span>
            </Link>
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
            <BellIcon className="h-6 w-6 text-gray-600 hover:text-blue-600 cursor-pointer" />
            <UserIcon className="h-6 w-6 text-gray-600 hover:text-blue-600 cursor-pointer" />
          </div>
        </div>
      </div>
    </nav>
  );
}