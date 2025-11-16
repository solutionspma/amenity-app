'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { PostService, type Post as ServicePost } from '@/lib/services/post-service';

interface Post {
  id: string;
  author: {
    name: string;
    avatar: string;
    verified: boolean;
    type: 'pastor' | 'church' | 'individual' | 'creator';
  };
  content: string;
  media?: {
    type: 'image' | 'video';
    url: string;
    thumbnail?: string;
  }[];
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  prayers: number;
  isLiked: boolean;
  isPrayed: boolean;
  tags?: string[];
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newPost, setNewPost] = useState('');
  const [activeTab, setActiveTab] = useState<'following' | 'discover' | 'live'>('following');
  const { getBackdropStyle } = useBackdrop();

  useEffect(() => {
    // Load real posts from your profile (admin user)
    // These will be shown to everyone as the global feed
    const globalPosts = PostService.getGlobalFeed();
    
    // Convert to feed format
    const feedPosts: Post[] = globalPosts.map(post => ({
      id: post.id,
      author: {
        name: post.authorName,
        avatar: post.authorAvatar,
        verified: true,
        type: 'pastor' as const
      },
      content: post.content,
      media: post.image ? [{
        type: 'image' as const,
        url: post.image
      }] : undefined,
      timestamp: formatTimestamp(post.timestamp),
      likes: post.likes,
      comments: post.comments,
      shares: post.shares,
      prayers: 0,
      isLiked: post.liked || false,
      isPrayed: false,
      tags: []
    }));

    setPosts(feedPosts);
  }, []);

  const formatTimestamp = (isoString: string): string => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };
    
    setPosts(mockPosts);
  }, []);

  const handlePostSubmit = () => {
    if (!newPost.trim()) return;
    
    // TODO: API call to create post
    console.log('Creating new post:', newPost);
    setNewPost('');
  };

  const handleLike = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isLiked: !post.isLiked,
            likes: post.isLiked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handlePrayer = (postId: string) => {
    setPosts(prev => prev.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            isPrayed: !post.isPrayed,
            prayers: post.isPrayed ? post.prayers - 1 : post.prayers + 1
          }
        : post
    ));
  };

  return (
    <div className="min-h-screen" style={getBackdropStyle('feed')}>
      <AmenityHeader currentPage="/feed" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-xl mx-auto mb-4">
                  M
                </div>
                <h3 className="text-white font-bold">Pastor Marcus Johnson</h3>
                <p className="text-gray-400 text-sm">Senior Pastor</p>
                <p className="text-gray-400 text-sm">Faith Community Church</p>
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-white font-bold">1.2K</div>
                    <div className="text-gray-400 text-xs">Followers</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">847</div>
                    <div className="text-gray-400 text-xs">Following</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">156</div>
                    <div className="text-gray-400 text-xs">Posts</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Link href="/livestream/studio" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-red-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-red-400" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                  <span>Go Live</span>
                </Link>
                
                <Link href="/creator/upload" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-blue-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <span>Upload Video</span>
                </Link>
                
                <Link href="/groups/create" className="flex items-center space-x-3 text-gray-300 hover:text-white transition-colors">
                  <div className="w-8 h-8 bg-green-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </div>
                  <span>Create Group</span>
                </Link>
              </div>
            </div>

            {/* Trending Topics */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4">Trending</h3>
              <div className="space-y-2">
                {['#SundayService', '#PrayerRequest', '#BibleStudy', '#Worship', '#Faith'].map((tag) => (
                  <div key={tag} className="text-yellow-400 hover:text-yellow-300 cursor-pointer">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-2 space-y-6">
            {/* Feed Tabs */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
              <div className="flex border-b border-white/10">
                {[
                  { key: 'following', label: 'Following', icon: '👥' },
                  { key: 'discover', label: 'Discover', icon: '🌟' },
                  { key: 'live', label: 'Live', icon: '🔴' }
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={`flex-1 flex items-center justify-center space-x-2 p-4 font-medium transition-colors ${
                      activeTab === tab.key 
                        ? 'text-yellow-400 border-b-2 border-yellow-400' 
                        : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Create Post */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="flex space-x-4">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
                  M
                </div>
                <div className="flex-1">
                  <textarea
                    value={newPost}
                    onChange={(e) => setNewPost(e.target.value)}
                    placeholder="Share your faith journey, prayer requests, or encouragement..."
                    className="w-full bg-transparent text-white placeholder-gray-400 resize-none border-none outline-none"
                    rows={3}
                  />
                  <div className="flex items-center justify-between mt-4">
                    <div className="flex space-x-4">
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                      <button className="text-gray-400 hover:text-white transition-colors">
                        🙏
                      </button>
                    </div>
                    <button
                      onClick={handlePostSubmit}
                      disabled={!newPost.trim()}
                      className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-2 rounded-lg font-medium hover:from-yellow-400 hover:to-orange-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Post
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Feed Posts */}
            <div className="space-y-6">
              {posts.map((post) => (
                <div key={post.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                  {/* Post Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <img 
                        src={post.author.avatar} 
                        alt={post.author.name}
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-medium">{post.author.name}</h4>
                          {post.author.verified && (
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          )}
                        </div>
                        <p className="text-gray-400 text-sm">{post.timestamp}</p>
                      </div>
                    </div>
                    <button className="text-gray-400 hover:text-white">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 6a2 2 0 110-4 2 2 0 010 4zM12 14a2 2 0 110-4 2 2 0 010 4zM12 22a2 2 0 110-4 2 2 0 010 4z"/>
                      </svg>
                    </button>
                  </div>

                  {/* Post Content */}
                  <div className="mb-4">
                    <p className="text-white leading-relaxed">{post.content}</p>
                    {post.tags && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {post.tags.map((tag) => (
                          <span key={tag} className="text-yellow-400 text-sm cursor-pointer hover:text-yellow-300">
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Post Media */}
                  {post.media && post.media.length > 0 && (
                    <div className="mb-4 rounded-lg overflow-hidden">
                      <img 
                        src={post.media[0].url} 
                        alt="Post media"
                        className="w-full h-64 object-cover"
                      />
                    </div>
                  )}

                  {/* Post Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <div className="flex space-x-6">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.isLiked ? 'text-red-400' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <svg className="w-5 h-5" fill={post.isLiked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{post.likes}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{post.comments}</span>
                      </button>

                      <button 
                        onClick={() => handlePrayer(post.id)}
                        className={`flex items-center space-x-2 transition-colors ${
                          post.isPrayed ? 'text-yellow-400' : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        <span className="text-lg">🙏</span>
                        <span>{post.prayers}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                        </svg>
                        <span>{post.shares}</span>
                      </button>
                    </div>

                    <button className="text-gray-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Live Streams */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Live Now
              </h3>
              <div className="space-y-3">
                {[
                  { title: 'Sunday Service', church: 'Grace Baptist', viewers: 234 },
                  { title: 'Bible Study', church: 'Faith Center', viewers: 89 },
                  { title: 'Prayer Meeting', church: 'New Hope', viewers: 45 }
                ].map((stream, index) => (
                  <div key={index} className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors">
                    <div className="w-12 h-8 bg-red-600 rounded flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium text-sm truncate">{stream.title}</p>
                      <p className="text-gray-400 text-xs">{stream.church} • {stream.viewers} watching</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Suggested Follows */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4">Suggested for You</h3>
              <div className="space-y-4">
                {[
                  { name: 'Joyce Meyer Ministries', type: 'Ministry', followers: '2.1M' },
                  { name: 'Hillsong Church', type: 'Church', followers: '1.8M' },
                  { name: 'TD Jakes', type: 'Pastor', followers: '956K' }
                ].map((suggestion, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center text-white font-bold">
                        {suggestion.name.charAt(0)}
                      </div>
                      <div>
                        <p className="text-white font-medium text-sm">{suggestion.name}</p>
                        <p className="text-gray-400 text-xs">{suggestion.type} • {suggestion.followers} followers</p>
                      </div>
                    </div>
                    <button className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-3 py-1 rounded-lg text-sm font-medium hover:from-yellow-400 hover:to-orange-400 transition-all">
                      Follow
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Prayer Requests */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <h3 className="text-white font-bold mb-4 flex items-center">
                🙏 Prayer Wall
              </h3>
              <div className="space-y-3">
                {[
                  'Healing for my grandmother',
                  'Job interview tomorrow',
                  'Safe travels for mission trip',
                  'Unity in our church'
                ].map((request, index) => (
                  <div key={index} className="bg-white/5 rounded-lg p-3">
                    <p className="text-white text-sm">{request}</p>
                    <button className="text-yellow-400 text-xs mt-1 hover:text-yellow-300">
                      🙏 Pray for this
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <AmenityFooter />
    </div>
  );
}