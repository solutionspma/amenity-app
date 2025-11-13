'use client';

import { useState, useEffect } from 'react';

interface Story {
  id: string;
  username: string;
  avatar: string;
  preview: string;
  isViewed: boolean;
}

export default function Stories() {
  const [stories, setStories] = useState<Story[]>([]);

  useEffect(() => {
    // Mock stories data
    const mockStories: Story[] = [
      {
        id: '1',
        username: 'You',
        avatar: '/api/placeholder/60/60',
        preview: '/api/placeholder/60/60',
        isViewed: false
      },
      {
        id: '2',
        username: 'creator_alpha',
        avatar: '/api/placeholder/60/60',
        preview: '/api/placeholder/60/60',
        isViewed: false
      },
      {
        id: '3',
        username: 'ministry_beta',
        avatar: '/api/placeholder/60/60',
        preview: '/api/placeholder/60/60',
        isViewed: true
      },
      {
        id: '4',
        username: 'tech_gamma',
        avatar: '/api/placeholder/60/60',
        preview: '/api/placeholder/60/60',
        isViewed: false
      },
      {
        id: '5',
        username: 'artist_delta',
        avatar: '/api/placeholder/60/60',
        preview: '/api/placeholder/60/60',
        isViewed: true
      }
    ];

    setStories(mockStories);
  }, []);

  const markAsViewed = (storyId: string) => {
    setStories(stories.map(story => 
      story.id === storyId ? { ...story, isViewed: true } : story
    ));
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-6">
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {stories.map((story) => (
          <button
            key={story.id}
            onClick={() => markAsViewed(story.id)}
            className="flex-shrink-0 flex flex-col items-center space-y-2 group"
          >
            <div className={`relative ${story.id === '1' ? 'w-16 h-16' : 'w-14 h-14'}`}>
              {/* Story ring */}
              <div className={`absolute inset-0 rounded-full ${
                story.isViewed 
                  ? 'bg-gray-300' 
                  : 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-600'
              } p-0.5`}>
                <img
                  src={story.avatar}
                  alt={story.username}
                  className="w-full h-full rounded-full bg-white p-0.5 object-cover"
                />
              </div>

              {/* Add story button for "You" */}
              {story.id === '1' && (
                <div className="absolute bottom-0 right-0 bg-blue-600 rounded-full w-5 h-5 flex items-center justify-center border-2 border-white">
                  <span className="text-white text-xs font-bold">+</span>
                </div>
              )}
            </div>

            <span className={`text-xs font-medium truncate max-w-16 ${
              story.isViewed ? 'text-gray-500' : 'text-gray-900'
            }`}>
              {story.username}
            </span>
          </button>
        ))}

        {/* See all stories */}
        <button className="flex-shrink-0 flex flex-col items-center justify-center space-y-2 w-14 h-14 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
          <span className="text-gray-600 text-xs">See all</span>
        </button>
      </div>
    </div>
  );
}