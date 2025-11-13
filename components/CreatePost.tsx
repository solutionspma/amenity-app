'use client';

import { useState } from 'react';
import { PhotoIcon, VideoCameraIcon } from '@heroicons/react/24/outline';

export default function CreatePost() {
  const [content, setContent] = useState('');

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
      <div className="flex items-start space-x-3">
        <div className="w-10 h-10 bg-gray-300 rounded-full flex-shrink-0"></div>
        <div className="flex-1">
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's happening on Amenity?"
            className="w-full p-3 border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center space-x-4">
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <PhotoIcon className="w-5 h-5" />
                <span className="text-sm">Photo</span>
              </button>
              <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700">
                <VideoCameraIcon className="w-5 h-5" />
                <span className="text-sm">Video</span>
              </button>
            </div>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              Post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}