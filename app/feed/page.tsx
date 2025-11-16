'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { PostService } from '@/lib/services/post-service';
import { ImageUploadService } from '@/lib/services/image-upload';

interface Post {
  id: string;
  authorName: string;
  authorAvatar: string;
  content: string;
  image?: string;
  timestamp: number;
  likes: number;
  comments: number;
  shares: number;
  liked?: boolean;
}

export default function FeedPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [profileData, setProfileData] = useState<any>(null);
  const [profileImage, setProfileImage] = useState<string>('');
  const { getBackdropStyle } = useBackdrop();

  const loadProfileData = () => {
    if (typeof window === 'undefined') return;

    // Load user profile
    const saved = localStorage.getItem('amenity_profile_backup');
    if (saved) {
      const profile = JSON.parse(saved);
      setProfileData(profile);
    }

    // Load profile image
    const userId = localStorage.getItem('amenity_user_id') || 'demo-user-id';
    const img = ImageUploadService.getProfileImage(userId);
    if (img) setProfileImage(img);

    // Load posts
    const feedPosts = PostService.getGlobalFeed();
    setPosts(feedPosts);
  };

  useEffect(() => {
    loadProfileData();

    // Listen for storage changes (when profile is updated in settings)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'amenity_profile_backup' || e.key?.includes('amenity_')) {
        loadProfileData();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom profile update event (same window)
    const handleProfileUpdate = () => {
      loadProfileData();
    };
    window.addEventListener('profileUpdated', handleProfileUpdate);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('profileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleLike = (postId: string) => {
    PostService.toggleLike(postId);
    const updated = PostService.getGlobalFeed();
    setPosts(updated);
  };

  const formatTime = (timestamp: number) => {
    const diff = Date.now() - timestamp;
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 1) return 'Just now';
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <div className="min-h-screen" style={getBackdropStyle('feed')}>
      <AmenityHeader currentPage="/feed" />

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Left Sidebar - Profile */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-center">
                {profileImage ? (
                  <img 
                    src={profileImage} 
                    alt="Profile" 
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover border-2 border-white/30"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold text-2xl mx-auto mb-4">
                    {(profileData?.name || 'U').charAt(0).toUpperCase()}
                  </div>
                )}
                <h3 className="text-white font-bold text-lg">{profileData?.name || 'Your Profile'}</h3>
                {profileData?.bio && (
                  <p className="text-gray-300 text-sm mt-2">{profileData.bio}</p>
                )}
                {profileData?.location && (
                  <p className="text-gray-400 text-xs mt-1">📍 {profileData.location}</p>
                )}
                
                <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                  <div>
                    <div className="text-white font-bold">{profileData?.stats?.followers || 0}</div>
                    <div className="text-gray-400 text-xs">Followers</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{profileData?.stats?.following || 1}</div>
                    <div className="text-gray-400 text-xs">Following</div>
                  </div>
                  <div>
                    <div className="text-white font-bold">{profileData?.stats?.posts || 0}</div>
                    <div className="text-gray-400 text-xs">Posts</div>
                  </div>
                </div>

                <Link 
                  href="/profiles/me"
                  className="mt-4 block w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold py-2 rounded-lg hover:opacity-90 transition-opacity"
                >
                  View Profile
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mt-6 bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
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
          </div>

          {/* Main Feed */}
          <div className="lg:col-span-3">
            <div className="space-y-6">
              
              {/* Posts Feed */}
              {posts.length === 0 ? (
                <div className="bg-white/10 backdrop-blur-md rounded-xl p-12 border border-white/20 text-center">
                  <div className="text-6xl mb-4">📱</div>
                  <h3 className="text-white font-bold text-xl mb-2">No Posts Yet</h3>
                  <p className="text-gray-400 mb-6">Start sharing your thoughts and connect with the community!</p>
                  <Link 
                    href="/profiles/me"
                    className="inline-block bg-gradient-to-r from-yellow-400 to-orange-500 text-black font-bold px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Create Your First Post
                  </Link>
                </div>
              ) : (
                posts.map((post) => (
                  <div key={post.id} className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
                    {/* Post Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      {post.authorAvatar ? (
                        <img src={post.authorAvatar} alt={post.authorName} className="w-12 h-12 rounded-full object-cover" />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
                          {post.authorName.charAt(0)}
                        </div>
                      )}
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="text-white font-bold">{post.authorName}</h4>
                          <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                          </svg>
                        </div>
                        <p className="text-gray-400 text-sm">{formatTime(post.timestamp)}</p>
                      </div>
                    </div>

                    {/* Post Content */}
                    <p className="text-white mb-4 whitespace-pre-wrap">{post.content}</p>

                    {/* Post Image */}
                    {post.image && (
                      <div className="mb-4 rounded-lg overflow-hidden">
                        <img src={post.image} alt="Post" className="w-full h-auto" />
                      </div>
                    )}

                    {/* Post Actions */}
                    <div className="flex items-center space-x-6 pt-4 border-t border-white/10">
                      <button 
                        onClick={() => handleLike(post.id)}
                        className={`flex items-center space-x-2 ${post.liked ? 'text-red-400' : 'text-gray-400'} hover:text-red-400 transition-colors`}
                      >
                        <svg className="w-5 h-5" fill={post.liked ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span className="font-semibold">{post.likes}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span className="font-semibold">{post.comments}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                        </svg>
                        <span className="font-semibold">{post.shares}</span>
                      </button>

                      <button className="flex items-center space-x-2 text-gray-400 hover:text-yellow-400 transition-colors ml-auto">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

        </div>
      </div>

      <AmenityFooter />
    </div>
  );
}
