'use client';

import { useState } from 'react';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

export default function SearchPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [searchType, setSearchType] = useState<'all' | 'people' | 'posts' | 'groups'>('all');
  const { getBackdropStyle } = useBackdrop();

  const mockResults = [
    { type: 'user', name: 'Pastor John', username: '@pastorjohn', avatar: '👨‍💼', verified: true },
    { type: 'user', name: 'Faith Community', username: '@faithcommunity', avatar: '⛪', verified: true },
    { type: 'post', content: 'Amazing service today! #blessed', author: 'Sister Mary', likes: 45 },
    { type: 'group', name: 'Youth Ministry', members: 234, description: 'Connecting young believers' },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      // Filter mock results based on query
      const filtered = mockResults.filter(item => 
        item.name?.toLowerCase().includes(query.toLowerCase()) ||
        item.username?.toLowerCase().includes(query.toLowerCase()) ||
        item.content?.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(filtered);
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="min-h-screen" style={getBackdropStyle('search')}>
      <AmenityHeader currentPage="/search" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">🔍 Search Amenity</h1>
          <p className="text-gray-300">Find people, posts, groups, and content across the platform</p>
        </div>

        {/* Search Input */}
        <div className="bg-black/20 rounded-2xl p-6 mb-8 border border-gray-700">
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search for anything..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 pl-12 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
              autoFocus
            />
            <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Search Filters */}
          <div className="flex space-x-2">
            {(['all', 'people', 'posts', 'groups'] as const).map((type) => (
              <button
                key={type}
                onClick={() => setSearchType(type)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  searchType === type
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        {/* Search Results */}
        {searchQuery ? (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-white">
              Results for "{searchQuery}" ({searchResults.length})
            </h2>
            
            {searchResults.length > 0 ? (
              <div className="space-y-4">
                {searchResults.map((result, index) => (
                  <div key={index} className="bg-black/20 rounded-xl p-6 border border-gray-700">
                    {result.type === 'user' && (
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl">
                          {result.avatar}
                        </div>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="text-white font-semibold">{result.name}</h3>
                            {result.verified && <span className="text-blue-400">✓</span>}
                          </div>
                          <p className="text-gray-400">{result.username}</p>
                        </div>
                        <button className="ml-auto bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          Follow
                        </button>
                      </div>
                    )}
                    
                    {result.type === 'post' && (
                      <div>
                        <p className="text-white mb-2">{result.content}</p>
                        <div className="flex items-center space-x-4 text-gray-400 text-sm">
                          <span>by {result.author}</span>
                          <span>❤️ {result.likes}</span>
                        </div>
                      </div>
                    )}
                    
                    {result.type === 'group' && (
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="text-white font-semibold mb-1">{result.name}</h3>
                          <p className="text-gray-400 text-sm mb-2">{result.description}</p>
                          <span className="text-gray-500 text-sm">{result.members} members</span>
                        </div>
                        <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">
                          Join Group
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-white mb-2">No results found</h3>
                <p className="text-gray-400">Try searching for something else</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">✨</div>
            <h3 className="text-xl font-semibold text-white mb-2">Start your search</h3>
            <p className="text-gray-400">Type above to find people, posts, and groups</p>
          </div>
        )}
      </main>
      
      <AmenityFooter />
    </div>
  );
}