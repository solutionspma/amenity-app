'use client';

import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

export default function ShortsPage() {
  const { getBackdropStyle } = useBackdrop();
  
  return (
    <div className="min-h-screen" style={getBackdropStyle('shorts')}>
      <AmenityHeader currentPage="/shorts" />

      {/* Shorts Feed */}
      <div className="max-w-md mx-auto">
        {[1,2,3,4,5].map((i) => (
          <div key={i} className="h-screen relative bg-gray-900 border-b border-gray-800">
            <video 
              className="w-full h-full object-cover"
              poster={`/images/team-meeting.jpg`}
              controls
            >
              <source src="#" type="video/mp4" />
            </video>
            
            {/* Overlay Controls */}
            <div className="absolute bottom-20 left-4 right-16 text-white">
              <h3 className="text-lg font-bold mb-2">
                Daily Devotion: Faith Over Fear #{i}
              </h3>
              <p className="text-sm text-gray-300 mb-4">
                Pastor Marcus Johnson shares powerful insights about overcoming fear through faith.
              </p>
              <div className="flex items-center space-x-4">
                <span className="text-sm">@gracechurch</span>
                <span className="text-sm">#Faith #Devotion</span>
              </div>
            </div>

            {/* Side Actions */}
            <div className="absolute bottom-20 right-4 flex flex-col space-y-6">
              <button className="flex flex-col items-center text-white">
                <div className="bg-red-500 rounded-full p-3 mb-2">❤️</div>
                <span className="text-xs">1.2K</span>
              </button>
              <button className="flex flex-col items-center text-white">
                <div className="bg-gray-700 rounded-full p-3 mb-2">💬</div>
                <span className="text-xs">234</span>
              </button>
              <button className="flex flex-col items-center text-white">
                <div className="bg-gray-700 rounded-full p-3 mb-2">🙏</div>
                <span className="text-xs">567</span>
              </button>
              <button className="flex flex-col items-center text-white">
                <div className="bg-gray-700 rounded-full p-3 mb-2">↗️</div>
                <span className="text-xs">Share</span>
              </button>
            </div>
          </div>
        ))}
      </div>
      
      <AmenityFooter />
    </div>
  );
}