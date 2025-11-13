'use client';

import Link from 'next/link';
import { 
  HomeIcon, 
  PlayIcon, 
  CameraIcon, 
  UserIcon,
  ChatBubbleLeftIcon 
} from '@heroicons/react/24/outline';

export default function MobileNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 md:hidden z-50">
      <div className="grid grid-cols-5 h-16">
        <Link href="/" className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-blue-600">
          <HomeIcon className="h-6 w-6" />
          <span className="text-xs">Home</span>
        </Link>
        
        <Link href="/shorts" className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-blue-600">
          <PlayIcon className="h-6 w-6" />
          <span className="text-xs">Shorts</span>
        </Link>
        
        <Link href="/camera" className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-blue-600">
          <div className="bg-blue-600 rounded-full p-2">
            <CameraIcon className="h-6 w-6 text-white" />
          </div>
        </Link>
        
        <Link href="/messages" className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-blue-600">
          <ChatBubbleLeftIcon className="h-6 w-6" />
          <span className="text-xs">Chat</span>
        </Link>
        
        <Link href="/profile" className="flex flex-col items-center justify-center space-y-1 text-gray-600 hover:text-blue-600">
          <UserIcon className="h-6 w-6" />
          <span className="text-xs">Profile</span>
        </Link>
      </div>
    </div>
  );
}