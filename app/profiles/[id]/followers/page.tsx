'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

interface User {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  verified: boolean;
  isFollowing?: boolean;
  mutualFollowers?: number;
}

export default function FollowersPage({ params }: { params: { id: string } }) {
  const [followers, setFollowers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();

  useEffect(() => {
    const fetchFollowers = async () => {
      try {
        // Mock data for followers
        const mockFollowers: User[] = Array.from({ length: 20 }, (_, i) => ({
          id: `follower-${i}`,
          name: [
            'Sarah Johnson', 'Michael Chen', 'Emily Davis', 'David Rodriguez',
            'Jessica Wilson', 'Alex Thompson', 'Maria Garcia', 'James Miller',
            'Ashley Brown', 'Ryan Taylor', 'Nicole Anderson', 'Kevin Lee',
            'Samantha Jones', 'Brandon Clark', 'Rachel Martinez', 'Tyler Moore',
            'Amanda White', 'Jason Hall', 'Michelle Lewis', 'Daniel Walker'
          ][i] || `User ${i}`,
          username: `@user${i}`,
          avatar: '/logos/altar-life-logo.png',
          bio: [
            'Content creator | Faith & lifestyle',
            'Coffee lover ☕ | Spreading positivity',
            'Artist & dreamer 🎨 | Living authentically',
            'Tech enthusiast | Building the future',
            'Fitness coach | Healthy living advocate',
            'Writer | Storyteller | Faith-driven',
            'Photographer 📸 | Capturing moments',
            'Entrepreneur | Inspiring others',
            'Music lover 🎵 | Creative soul',
            'Travel blogger | Adventure seeker'
          ][i % 10] || 'Living life to the fullest on Amenity!',
          verified: Math.random() > 0.7,
          isFollowing: Math.random() > 0.4,
          mutualFollowers: Math.floor(Math.random() * 50)
        }));

        setFollowers(mockFollowers);
      } catch (error) {
        console.error('Error fetching followers:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowers();
  }, [params.id]);

  const handleFollow = (userId: string) => {
    setFollowers(followers.map(follower => 
      follower.id === userId 
        ? { ...follower, isFollowing: !follower.isFollowing }
        : follower
    ));
  };

  const filteredFollowers = followers.filter(follower =>
    follower.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    follower.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={getBackdropStyle('profile')}>
      <AmenityHeader currentPage={`/profiles/${params.id}/followers`} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors mb-4"
          >
            ← Back to Profile
          </button>
          <h1 className="text-4xl font-bold text-white mb-4">Followers</h1>
          <p className="text-gray-300">People who follow this account</p>
        </div>

        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search followers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-gray-600 rounded-full px-6 py-4 pl-12 text-white focus:border-purple-500 focus:outline-none"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>
          </div>
        </div>

        {/* Followers List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white text-xl flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span>Loading followers...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFollowers.map((follower) => (
              <div key={follower.id} className="bg-black/20 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => router.push(`/profiles/${follower.id}`)}
                    className="flex items-center space-x-4 flex-1 cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {follower.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-semibold text-lg">{follower.name}</h3>
                        {follower.verified && <span className="text-blue-400">✓</span>}
                      </div>
                      <p className="text-gray-400 mb-1">{follower.username}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{follower.bio}</p>
                      {follower.mutualFollowers && follower.mutualFollowers > 0 && (
                        <p className="text-gray-500 text-xs mt-2">
                          Followed by {follower.mutualFollowers} people you follow
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleFollow(follower.id)}
                      className={`px-6 py-2 rounded-full font-semibold transition-colors ${
                        follower.isFollowing 
                          ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                          : 'bg-blue-600 hover:bg-blue-700 text-white'
                      }`}
                    >
                      {follower.isFollowing ? 'Following' : 'Follow'}
                    </button>
                    <button 
                      onClick={() => router.push(`/messages/direct/${follower.id}`)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold transition-colors"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredFollowers.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👥</div>
                <h3 className="text-xl font-semibold text-white mb-2">No followers found</h3>
                <p className="text-gray-400">
                  {searchQuery ? 'Try a different search term' : 'This account has no followers yet'}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-black/20 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Follower Insights</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">{followers.length}</div>
              <div className="text-gray-400">Total Followers</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {followers.filter(f => f.isFollowing).length}
              </div>
              <div className="text-gray-400">Mutual Follows</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {followers.filter(f => f.verified).length}
              </div>
              <div className="text-gray-400">Verified Followers</div>
            </div>
          </div>
        </div>
      </main>

      <AmenityFooter />
    </div>
  );
}