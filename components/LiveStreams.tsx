'use client';

import { PlayIcon, EyeIcon, UserIcon } from '@heroicons/react/24/outline';

export default function LiveStreams() {
  const liveStreams = [
    { id: 1, title: 'Morning Worship Service', creator: 'FaithChurch', viewers: 234, thumbnail: '/api/placeholder/300/200' },
    { id: 2, title: 'Tech Tutorial: React Hooks', creator: 'DevMaster', viewers: 89, thumbnail: '/api/placeholder/300/200' },
    { id: 3, title: 'Creative Art Session', creator: 'ArtistLife', viewers: 156, thumbnail: '/api/placeholder/300/200' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
      <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
        <div className="w-3 h-3 bg-red-500 rounded-full mr-2 animate-pulse"></div>
        Live Now
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {liveStreams.map((stream) => (
          <div key={stream.id} className="group cursor-pointer">
            <div className="relative">
              <div className="w-full h-32 bg-gray-300 rounded-lg overflow-hidden">
                <div className="w-full h-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
                  <PlayIcon className="w-8 h-8 text-white" />
                </div>
              </div>
              
              <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-semibold">
                LIVE
              </div>
              
              <div className="absolute bottom-2 right-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
                <EyeIcon className="w-3 h-3 mr-1" />
                {stream.viewers}
              </div>
            </div>
            
            <div className="mt-2">
              <h4 className="font-medium text-sm text-gray-900 group-hover:text-blue-600 truncate">
                {stream.title}
              </h4>
              <div className="flex items-center mt-1 text-xs text-gray-500">
                <UserIcon className="w-3 h-3 mr-1" />
                {stream.creator}
              </div>
            </div>
          </div>
        ))}
      </div>
      
      <button className="w-full mt-4 text-blue-600 hover:text-blue-700 text-sm font-medium">
        View All Live Streams
      </button>
    </div>
  );
}