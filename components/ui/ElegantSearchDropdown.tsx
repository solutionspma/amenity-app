'use client';

import { useState, useEffect, useRef } from 'react';
import { Search, X, Clock, TrendingUp, Hash, Users, FileText, Building } from 'lucide-react';

interface SearchResult {
  id: string;
  type: 'user' | 'post' | 'group' | 'hashtag' | 'page';
  title: string;
  subtitle?: string;
  avatar?: string;
  verified?: boolean;
  url: string;
}

interface ElegantSearchDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate?: (url: string) => void;
}

export default function ElegantSearchDropdown({ isOpen, onClose, onNavigate }: ElegantSearchDropdownProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Mock trending searches and recent searches
  const trendingSearches = [
    '#SundayService',
    '#BlessedLife', 
    '#FaithFamily',
    '#MiracleMonday',
    '#TestimonyTime'
  ];

  const mockResults: SearchResult[] = [
    { id: '1', type: 'user', title: 'Pastor John Mitchell', subtitle: '@pastorjohn · Faith Leader', avatar: '👨‍💼', verified: true, url: '/profiles/pastorjohn' },
    { id: '2', type: 'user', title: 'Sarah Grace', subtitle: '@sarahgrace · Worship Leader', avatar: '🎵', url: '/profiles/sarahgrace' },
    { id: '3', type: 'group', title: 'Youth Ministry', subtitle: '234 members · Active community', avatar: '👥', url: '/groups/youth-ministry' },
    { id: '4', type: 'post', title: 'Sunday Service Highlights', subtitle: 'Amazing worship today! #blessed', avatar: '📖', url: '/posts/sunday-highlights' },
    { id: '5', type: 'hashtag', title: '#SundayService', subtitle: '1.2K posts this week', url: '/hashtag/sundayservice' },
    { id: '6', type: 'page', title: 'Live Streaming Guide', subtitle: 'How to set up your church stream', url: '/help/streaming' },
  ];

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    // Load recent searches from localStorage
    const saved = localStorage.getItem('amenity_recent_searches');
    if (saved) {
      setRecentSearches(JSON.parse(saved));
    }
  }, []);

  const performSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const filtered = mockResults.filter(result =>
        result.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        result.subtitle?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setResults(filtered);
      setIsLoading(false);
    }, 300);
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    performSearch(searchQuery);
  };

  const handleResultClick = (result: SearchResult) => {
    // Add to recent searches
    const newRecents = [result.title, ...recentSearches.filter(r => r !== result.title)].slice(0, 5);
    setRecentSearches(newRecents);
    localStorage.setItem('amenity_recent_searches', JSON.stringify(newRecents));
    
    // Navigate
    if (onNavigate) {
      onNavigate(result.url);
    } else {
      window.location.href = result.url;
    }
    
    onClose();
  };

  const handleRecentClick = (recent: string) => {
    setQuery(recent);
    performSearch(recent);
  };

  const clearRecent = (recent: string) => {
    const newRecents = recentSearches.filter(r => r !== recent);
    setRecentSearches(newRecents);
    localStorage.setItem('amenity_recent_searches', JSON.stringify(newRecents));
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'user': return Users;
      case 'post': return FileText;
      case 'group': return Building;
      case 'hashtag': return Hash;
      case 'page': return FileText;
      default: return Search;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Search Dropdown */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white dark:bg-gray-900 shadow-2xl animate-in slide-in-from-top duration-300">
        <div className="max-w-4xl mx-auto px-4 py-6">
          {/* Search Input */}
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search people, posts, groups, and more..."
              className="w-full pl-12 pr-12 py-4 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:focus:ring-yellow-400 focus:border-transparent"
            />
            <button
              onClick={onClose}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content Area */}
          <div className="max-h-96 overflow-y-auto">
            {query.trim() ? (
              // Search Results
              <div>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500"></div>
                    <span className="ml-3 text-gray-600 dark:text-gray-400">Searching...</span>
                  </div>
                ) : results.length > 0 ? (
                  <div className="space-y-2">
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Search Results</h3>
                    {results.map((result) => {
                      const Icon = getResultIcon(result.type);
                      return (
                        <button
                          key={result.id}
                          onClick={() => handleResultClick(result)}
                          className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                        >
                          <div className="flex-shrink-0">
                            {result.avatar ? (
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center text-white">
                                {result.avatar}
                              </div>
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                                <Icon className="h-5 w-5 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2">
                              <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                                {result.title}
                              </p>
                              {result.verified && (
                                <span className="text-blue-500">✓</span>
                              )}
                            </div>
                            {result.subtitle && (
                              <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                                {result.subtitle}
                              </p>
                            )}
                          </div>
                          <div className="text-xs text-gray-400 capitalize">
                            {result.type}
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Search className="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500 dark:text-gray-400">No results found for "{query}"</p>
                    <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">Try searching for something else</p>
                  </div>
                )}
              </div>
            ) : (
              // Default state - Recent searches and trending
              <div className="space-y-6">
                {/* Recent Searches */}
                {recentSearches.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Recent Searches
                    </h3>
                    <div className="space-y-1">
                      {recentSearches.map((recent, index) => (
                        <div key={index} className="flex items-center justify-between group">
                          <button
                            onClick={() => handleRecentClick(recent)}
                            className="flex-1 flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                          >
                            <Clock className="h-4 w-4 text-gray-400 flex-shrink-0" />
                            <span className="text-gray-700 dark:text-gray-300">{recent}</span>
                          </button>
                          <button
                            onClick={() => clearRecent(recent)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Trending Searches */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 flex items-center">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Trending
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                    {trendingSearches.map((trending, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(trending)}
                        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                      >
                        <Hash className="h-4 w-4 text-yellow-500 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300 text-sm truncate">{trending}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Quick Links */}
                <div>
                  <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3">Quick Access</h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => onNavigate?.('/feed')}
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <FileText className="h-5 w-5 text-blue-500" />
                      <span className="text-gray-700 dark:text-gray-300">Latest Posts</span>
                    </button>
                    <button
                      onClick={() => onNavigate?.('/groups')}
                      className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-left"
                    >
                      <Building className="h-5 w-5 text-green-500" />
                      <span className="text-gray-700 dark:text-gray-300">Active Groups</span>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}