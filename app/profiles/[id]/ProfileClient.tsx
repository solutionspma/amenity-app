'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { ImageUploadService } from '@/lib/services/image-upload';
import { PostService, type Post } from '@/lib/services/post-service';

interface UserProfile {
  id: string;
  name: string;
  username: string;
  bio: string;
  avatar: string;
  coverImage: string;
  followers: number;
  following: number;
  posts: number;
  verified: boolean;
  joinDate: string;
  isFollowing?: boolean;
  location?: string;
  website?: string;
}

export default function ProfileClient({ id }: { id: string }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [activeTab, setActiveTab] = useState('posts');
  const [loading, setLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [newPostContent, setNewPostContent] = useState('');
  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();

  useEffect(() => {
    setMounted(true);
  }, []);

  const fetchProfile = async () => {
    try {
      // Load uploaded images
      const userId = id === 'me' ? 'demo-user-id' : id;
      const uploadedProfileImage = ImageUploadService.getProfileImage(userId);
      const uploadedCoverImage = ImageUploadService.getCoverImage(userId);

      // Load saved profile data from localStorage
      let savedProfileData: any = null;
      if (typeof window !== 'undefined') {
        const savedProfile = localStorage.getItem('amenity_profile_backup');
        if (savedProfile) {
          try {
            savedProfileData = JSON.parse(savedProfile);
          } catch (e) {
            console.error('Error parsing saved profile:', e);
          }
        }
      }

      // Mock data for now - use saved data if available
      const mockProfile: UserProfile = {
        id: id,
        name: savedProfileData?.name || (id === 'me' ? 'Your Profile' : `User ${id}`),
        username: savedProfileData?.username || (id === 'me' ? '@yourhandle' : `@user${id}`),
        bio: savedProfileData?.bio || (id === 'me' 
          ? 'Welcome to your Amenity profile! Connect, create, and grow your community. ✨ Living my best life on the platform!' 
          : 'Sharing life moments and connecting with amazing people on Amenity. 🌟 Content creator | Lifestyle | Faith'),
        avatar: uploadedProfileImage || '/logos/altar-life-logo.png',
        coverImage: uploadedCoverImage || '/images/default-cover.jpg',
        followers: savedProfileData?.stats?.followers || 0,
        following: savedProfileData?.stats?.following || 1,
        posts: savedProfileData?.stats?.posts || 0,
        verified: Math.random() > 0.3,
        joinDate: 'January 2024',
        location: savedProfileData?.location || 'New York, NY',
        website: savedProfileData?.website || 'amenityapp.com',
        isFollowing: Math.random() > 0.5
      };

      // Load real posts from PostService
      const userPosts = PostService.getUserPosts(userId);
      
      setPosts(userPosts);
      setProfile(mockProfile);
      setIsFollowing(mockProfile.isFollowing || false);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();

    // Listen for storage changes
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'amenity_profile_backup' || e.key?.includes('amenity_')) {
        fetchProfile();
      }
    };

    const handleProfileUpdate = () => {
      fetchProfile();
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('profileUpdated', handleProfileUpdate);
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('profileUpdated', handleProfileUpdate);
      }
    };
  }, [id]);

  const handleFollow = async () => {
    // API call would go here
    setIsFollowing(!isFollowing);
    if (profile) {
      setProfile({
        ...profile,
        followers: isFollowing ? profile.followers - 1 : profile.followers + 1
      });
    }
  };

  const handleMessage = () => {
    console.log('Opening message for user:', id);
    console.log('Router object:', router);
    console.log('Mounted state:', mounted);
    
    if (!mounted) {
      console.warn('Component not mounted yet, retrying in 100ms');
      setTimeout(() => handleMessage(), 100);
      return;
    }
    
    try {
      console.log(`Attempting router.push to /messages/direct/${id}`);
      router.push(`/messages/direct/${id}`);
      console.log('Router.push called successfully');
    } catch (error) {
      console.error('Error navigating to messages:', error);
      // Fallback navigation
      window.location.href = `/messages/direct/${id}`;
    }
  };

  const handlePostLike = (postId: string) => {
    const userId = id === 'me' ? 'demo-user-id' : id;
    PostService.toggleLike(userId, postId);
    
    // Update UI
    setPosts(posts.map(post => 
      post.id === postId 
        ? { 
            ...post, 
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          }
        : post
    ));
  };

  const handleShare = (postId: string) => {
    // Share functionality
    if (navigator.share) {
      navigator.share({
        title: `${profile?.name}'s post on Amenity`,
        text: posts.find(p => p.id === postId)?.content,
        url: `${window.location.origin}/profiles/${id}/posts/${postId}`
      });
    }
  };

  const handleCreatePost = () => {
    if (!newPostContent.trim()) return;
    
    const userId = 'demo-user-id';
    
    // Get profile data for post author info
    const savedProfile = typeof window !== 'undefined' ? localStorage.getItem('amenity_profile_backup') : null;
    let authorName = 'Your Profile';
    let authorUsername = '@yourhandle';
    
    if (savedProfile) {
      try {
        const parsed = JSON.parse(savedProfile);
        authorName = parsed.name || authorName;
        authorUsername = parsed.username || authorUsername;
      } catch (e) {
        console.error('Error parsing profile:', e);
      }
    }

    const profileImage = ImageUploadService.getProfileImage(userId);
    
    const newPost = PostService.createPost(
      userId,
      newPostContent,
      authorName,
      authorUsername,
      profileImage || '/logos/altar-life-logo.png'
    );
    
    // Add to posts list
    setPosts([newPost, ...posts]);
    
    // Clear form and close modal
    setNewPostContent('');
    setShowCreatePost(false);
  };

  const navigateToFollowers = () => {
    console.log('Navigating to followers for:', id);
    console.log('Router object:', router);
    console.log('Mounted state:', mounted);
    
    if (!mounted) {
      console.warn('Component not mounted yet, retrying in 100ms');
      setTimeout(() => navigateToFollowers(), 100);
      return;
    }
    
    try {
      console.log(`Attempting router.push to /profiles/${id}/followers`);
      router.push(`/profiles/${id}/followers`);
      console.log('Router.push called successfully');
    } catch (error) {
      console.error('Error navigating to followers:', error);
      // Fallback navigation
      window.location.href = `/profiles/${id}/followers`;
    }
  };

  const navigateToFollowing = () => {
    console.log('Navigating to following for:', id);
    console.log('Router object:', router);
    console.log('Mounted state:', mounted);
    
    if (!mounted) {
      console.warn('Component not mounted yet, retrying in 100ms');
      setTimeout(() => navigateToFollowing(), 100);
      return;
    }
    
    try {
      console.log(`Attempting router.push to /profiles/${id}/following`);
      router.push(`/profiles/${id}/following`);
      console.log('Router.push called successfully');
    } catch (error) {
      console.error('Error navigating to following:', error);
      // Fallback navigation
      window.location.href = `/profiles/${id}/following`;
    }
  };

  const navigateToSettings = () => {
    console.log('Navigating to profile settings...');
    console.log('Router object:', router);
    console.log('Mounted state:', mounted);
    
    if (!mounted) {
      console.warn('Component not mounted yet, retrying in 100ms');
      setTimeout(() => navigateToSettings(), 100);
      return;
    }
    
    try {
      console.log('Attempting router.push to /profiles/settings');
      router.push('/profiles/settings');
      console.log('Router.push called successfully');
    } catch (error) {
      console.error('Error navigating to settings:', error);
      // Fallback navigation
      window.location.href = '/profiles/settings';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={getBackdropStyle('profile')}>
        <AmenityHeader currentPage={`/profiles/${id}`} />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span>Loading profile...</span>
          </div>
        </div>
        <AmenityFooter />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen" style={getBackdropStyle('profile')}>
        <AmenityHeader currentPage={`/profiles/${id}`} />
        <div className="flex flex-col items-center justify-center h-screen space-y-4">
          <div className="text-white text-6xl">😔</div>
          <div className="text-white text-xl">Profile not found</div>
          <button 
            onClick={() => router.back()}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
          >
            Go Back
          </button>
        </div>
        <AmenityFooter />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={getBackdropStyle('profile')}>
      <AmenityHeader currentPage={`/profiles/${id}`} />
      <main className="max-w-4xl mx-auto px-4 py-8">
      {/* Cover Image */}
      <div className="relative h-64 rounded-2xl mb-8 overflow-hidden">
        {profile.coverImage && profile.coverImage !== '/images/default-cover.jpg' ? (
          <img
            src={profile.coverImage}
            alt="Cover"
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600"></div>
        )}
        <div className="absolute inset-0 bg-black/20"></div>
        {id === 'me' && (
          <button 
            onClick={() => {
              console.log('Change cover clicked');
              if (router && typeof router.push === 'function') {
                router.push('/profiles/settings');
              } else {
                window.location.href = '/profiles/settings';
              }
            }}
            className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
          >
            📸 Change Cover
          </button>
        )}
      </div>

      {/* Profile Header */}
      <div className="relative -mt-20 mb-8">
        <div className="flex flex-col md:flex-row items-center md:items-end space-y-4 md:space-y-0 md:space-x-6">
          <div className="relative">
            {profile.avatar && profile.avatar !== '/logos/altar-life-logo.png' ? (
              <img
                src={profile.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full border-4 border-white flex items-center justify-center text-white text-4xl font-bold">
                {profile.name.charAt(0)}
              </div>
            )}
            {id === 'me' && (
              <button 
                onClick={() => {
                  console.log('Change profile picture clicked');
                  if (router && typeof router.push === 'function') {
                    router.push('/profiles/settings');
                  } else {
                    window.location.href = '/profiles/settings';
                  }
                }}
                className="absolute bottom-2 right-2 bg-purple-600 hover:bg-purple-700 rounded-full p-3 text-white text-sm transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:shadow-2xl animate-pulse hover:animate-none ring-2 ring-purple-400/30 hover:ring-purple-300/50"
                style={{
                  boxShadow: '0 0 20px rgba(147, 51, 234, 0.4), 0 0 40px rgba(147, 51, 234, 0.2)'
                }}
              >
                📸
              </button>
            )}
          </div>
          <div className="flex-1 text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start space-x-2 mb-2">
              <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
              {profile.verified && <span className="text-blue-400 text-2xl">✓</span>}
            </div>
            <p className="text-gray-300 text-lg mb-1">{profile.username}</p>
            <p className="text-gray-400 mt-2 max-w-md leading-relaxed">{profile.bio}</p>
            <div className="flex items-center justify-center md:justify-start space-x-4 mt-3 text-sm text-gray-400">
              {profile.location && (
                <span className="flex items-center space-x-1">
                  <span>📍</span>
                  <span>{profile.location}</span>
                </span>
              )}
              {profile.website && (
                <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center space-x-1 hover:text-blue-400 transition-colors">
                  <span>🔗</span>
                  <span>{profile.website}</span>
                </a>
              )}
              <span className="flex items-center space-x-1">
                <span>📅</span>
                <span>Joined {profile.joinDate}</span>
              </span>
            </div>
          </div>
          <div className="flex space-x-3">
            {id !== 'me' ? (
              <>
                <button 
                  onClick={handleFollow}
                  className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                    isFollowing 
                      ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  {isFollowing ? 'Following' : 'Follow'}
                </button>
                <button 
                  onClick={() => {
                    console.log('Message button clicked!');
                    handleMessage();
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                >
                  Message
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-semibold transition-colors">
                  ⚙️
                </button>
              </>
            ) : (
              <>
                <button 
                  onClick={() => {
                    console.log('Edit Profile button clicked!');
                    console.log('Will navigate to /profiles/settings');
                    // Try router first, fallback to window.location
                    if (router && typeof router.push === 'function') {
                      console.log('Using router.push');
                      navigateToSettings();
                    } else {
                      console.log('Using window.location fallback');
                      window.location.href = '/profiles/settings';
                    }
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                >
                  Edit Profile
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-semibold transition-colors">
                  ⚙️
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="flex justify-center space-x-8 mb-8 bg-black/20 rounded-2xl p-6">
        <button 
          onClick={() => setActiveTab('posts')}
          className="text-center hover:bg-white/5 rounded-lg p-2 transition-colors"
        >
          <div className="text-2xl font-bold text-white">{profile.posts.toLocaleString()}</div>
          <div className="text-gray-400">Posts</div>
        </button>
        <button 
          onClick={() => {
            console.log('Followers button clicked!');
            if (router && typeof router.push === 'function') {
              console.log('Using router.push for followers');
              navigateToFollowers();
            } else {
              console.log('Using window.location fallback for followers');
              window.location.href = `/profiles/${id}/followers`;
            }
          }}
          className="text-center hover:bg-white/5 rounded-lg p-2 transition-colors"
        >
          <div className="text-2xl font-bold text-white">{profile.followers.toLocaleString()}</div>
          <div className="text-gray-400">Followers</div>
        </button>
        <button 
          onClick={() => {
            console.log('Following button clicked!');
            if (router && typeof router.push === 'function') {
              console.log('Using router.push for following');
              navigateToFollowing();
            } else {
              console.log('Using window.location fallback for following');
              window.location.href = `/profiles/${id}/following`;
            }
          }}
          className="text-center hover:bg-white/5 rounded-lg p-2 transition-colors"
        >
          <div className="text-2xl font-bold text-white">{profile.following.toLocaleString()}</div>
          <div className="text-gray-400">Following</div>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 mb-8 bg-black/20 rounded-xl p-1">
        {['posts', 'about', 'media', 'settings'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-colors capitalize ${
              activeTab === tab
                ? 'bg-purple-600 text-white'
                : 'text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            {tab === 'posts' && '📝'} {tab === 'about' && 'ℹ️'} {tab === 'media' && '🎬'} {tab === 'settings' && '⚙️'} {tab}
          </button>
        ))}
      </div>

      {/* Content based on active tab */}
      {activeTab === 'posts' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">Recent Posts</h2>
            <div className="flex space-x-3">
              <button 
                onClick={() => router.push('/feed')}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
              >
                🌍 View Feed
              </button>
              {id === 'me' && (
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-6 py-2 rounded-full font-semibold transition-all"
                >
                  ➕ Create Post
                </button>
              )}
            </div>
          </div>

          {/* Create Post Modal */}
          {showCreatePost && (
            <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
              <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-700 rounded-2xl p-6 max-w-2xl w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-2xl font-bold text-white">Create New Post</h3>
                  <button 
                    onClick={() => setShowCreatePost(false)}
                    className="text-gray-400 hover:text-white text-2xl"
                  >
                    ×
                  </button>
                </div>
                
                <textarea
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder="What's on your mind? Share with your community..."
                  className="w-full bg-black/50 border border-gray-700 rounded-xl p-4 text-white placeholder-gray-500 min-h-[150px] focus:outline-none focus:border-purple-500 transition-colors"
                  autoFocus
                />
                
                <div className="flex justify-end space-x-3 mt-4">
                  <button 
                    onClick={() => setShowCreatePost(false)}
                    className="px-6 py-2 rounded-full bg-gray-700 hover:bg-gray-600 text-white font-medium transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleCreatePost}
                    disabled={!newPostContent.trim()}
                    className="px-6 py-2 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Post
                  </button>
                </div>
              </div>
            </div>
          )}

          {posts.length === 0 ? (
            <div className="bg-black/20 rounded-2xl p-12 border border-gray-700 text-center">
              <div className="text-6xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-2">No posts yet</h3>
              <p className="text-gray-400 mb-6">
                {id === 'me' 
                  ? "Start sharing your thoughts with the community! Click 'Create Post' to get started."
                  : "This user hasn't posted anything yet."}
              </p>
              {id === 'me' && (
                <button 
                  onClick={() => setShowCreatePost(true)}
                  className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-8 py-3 rounded-full font-semibold transition-all"
                >
                  Create Your First Post
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {posts.map((post) => (
            <div key={post.id} className="bg-black/30 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                  {profile.name.charAt(0)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-white">{profile.name}</span>
                    {profile.verified && <span className="text-blue-400">✓</span>}
                  </div>
                  <span className="text-gray-400 text-sm">{new Date(post.timestamp).toLocaleDateString()}</span>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors">
                  ⋯
                </button>
              </div>
              
              <p 
                onClick={() => router.push(`/profiles/${id}/posts/${post.id}`)}
                className="text-white mb-4 leading-relaxed cursor-pointer hover:text-gray-200 transition-colors"
              >
                {post.content}
              </p>
              
              {post.image && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-48 rounded-xl mb-4 flex items-center justify-center border border-gray-700">
                  <span className="text-gray-400 text-lg">📷 Image Content</span>
                </div>
              )}

              {post.video && (
                <div className="bg-gradient-to-br from-gray-800 to-gray-900 h-48 rounded-xl mb-4 flex items-center justify-center border border-gray-700">
                  <span className="text-gray-400 text-lg">🎥 Video Content</span>
                </div>
              )}
              
              <div className="flex items-center justify-between pt-4 border-t border-gray-700">
                <div className="flex space-x-6">
                  <button 
                    onClick={() => handlePostLike(post.id)}
                    className={`flex items-center space-x-2 transition-colors ${
                      post.liked ? 'text-red-400' : 'text-gray-400 hover:text-red-400'
                    }`}
                  >
                    <span>{post.liked ? '❤️' : '🤍'}</span>
                    <span>{post.likes}</span>
                  </button>
                  <button 
                    onClick={() => router.push(`/profiles/${id}/posts/${post.id}`)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-blue-400 transition-colors"
                  >
                    <span>💬</span>
                    <span>{post.comments}</span>
                  </button>
                  <button 
                    onClick={() => handleShare(post.id)}
                    className="flex items-center space-x-2 text-gray-400 hover:text-green-400 transition-colors"
                  >
                    <span>🔄</span>
                    <span>{post.shares}</span>
                  </button>
                </div>
                <button className="text-gray-400 hover:text-yellow-400 transition-colors">
                  🔖
                </button>
              </div>
            </div>
          ))}
            </div>
          )}

      {activeTab === 'about' && (
        <div className="bg-black/20 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-2xl font-bold text-white mb-6">About {profile.name}</h3>
          <div className="space-y-6">
            <div>
              <h4 className="text-lg font-semibold text-white mb-2">Bio</h4>
              <p className="text-gray-300 leading-relaxed">{profile.bio}</p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Details</h4>
                <div className="space-y-3">
                  {profile.location && (
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">📍</span>
                      <span className="text-gray-300">{profile.location}</span>
                    </div>
                  )}
                  {profile.website && (
                    <div className="flex items-center space-x-3">
                      <span className="text-gray-400">🔗</span>
                      <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
                        {profile.website}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center space-x-3">
                    <span className="text-gray-400">📅</span>
                    <span className="text-gray-300">Joined {profile.joinDate}</span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="text-lg font-semibold text-white mb-3">Activity</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Total Posts</span>
                    <span className="text-white font-semibold">{profile.posts.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Followers</span>
                    <span className="text-white font-semibold">{profile.followers.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Following</span>
                    <span className="text-white font-semibold">{profile.following.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'media' && (
        <div>
          <h3 className="text-2xl font-bold text-white mb-6">Media Gallery</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="aspect-square bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border border-gray-700 hover:border-gray-600 transition-colors cursor-pointer">
                <span className="text-gray-400 text-2xl">
                  {i % 2 === 0 ? '📷' : '🎥'}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'settings' && id === 'me' && (
        <div className="space-y-6">
          <h3 className="text-2xl font-bold text-white mb-6">Profile Settings</h3>
          <div className="grid md:grid-cols-2 gap-6">
            <button 
              onClick={navigateToSettings}
              className="bg-black/30 p-6 rounded-2xl border border-gray-700 hover:border-purple-500 transition-colors text-left"
            >
              <div className="text-2xl mb-2">👤</div>
              <h4 className="text-lg font-semibold text-white mb-2">Edit Profile</h4>
              <p className="text-gray-400">Update your profile information, bio, and images</p>
            </button>
            <button className="bg-black/30 p-6 rounded-2xl border border-gray-700 hover:border-blue-500 transition-colors text-left">
              <div className="text-2xl mb-2">🔒</div>
              <h4 className="text-lg font-semibold text-white mb-2">Privacy</h4>
              <p className="text-gray-400">Manage who can see your content and contact you</p>
            </button>
            <button className="bg-black/30 p-6 rounded-2xl border border-gray-700 hover:border-green-500 transition-colors text-left">
              <div className="text-2xl mb-2">🔔</div>
              <h4 className="text-lg font-semibold text-white mb-2">Notifications</h4>
              <p className="text-gray-400">Control what notifications you receive</p>
            </button>
            <button className="bg-black/30 p-6 rounded-2xl border border-gray-700 hover:border-yellow-500 transition-colors text-left">
              <div className="text-2xl mb-2">💰</div>
              <h4 className="text-lg font-semibold text-white mb-2">Monetization</h4>
              <p className="text-gray-400">Set up earnings and payment preferences</p>
            </button>
          </div>
        </div>
      )}
      </main>
      <AmenityFooter />
    </div>
  );
}
