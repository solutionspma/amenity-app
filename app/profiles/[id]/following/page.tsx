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
  category?: string;
}

export default function FollowingPage({ params }: { params: { id: string } }) {
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();

  useEffect(() => {
    const fetchFollowing = async () => {
      try {
        // Mock data for following
        const categories = ['creators', 'faith', 'lifestyle', 'tech', 'art'];
        const mockFollowing: User[] = Array.from({ length: 25 }, (_, i) => ({
          id: `following-${i}`,
          name: [
            'Pastor John Smith', 'Creative Studio', 'Tech Innovators', 'Lifestyle Hub',
            'Faith Community', 'Art Gallery', 'Music Producer', 'Fitness Coach',
            'Travel Guide', 'Food Network', 'Book Club', 'Photography Pro',
            'Wellness Center', 'Youth Ministry', 'Business Tips', 'Daily Devotion',
            'Creative Workshop', 'Life Coach', 'Inspiration Daily', 'Tech Reviews',
            'Fashion Trends', 'Health Tips', 'Prayer Circle', 'Study Group', 'Community News'
          ][i] || `Account ${i}`,
          username: `@account${i}`,
          avatar: '/logos/altar-life-logo.png',
          bio: [
            'Spreading the word of God through daily devotions and inspiration',
            'Creating amazing content for the digital generation',
            'Innovating technology solutions for modern problems',
            'Curating the best lifestyle content and tips',
            'Building a strong faith-based community together',
            'Showcasing incredible artwork from talented artists',
            'Producing music that touches hearts and souls',
            'Helping people achieve their fitness and health goals',
            'Exploring the world one adventure at a time',
            'Sharing delicious recipes and food experiences'
          ][i % 10] || 'Sharing valuable content with our community!',
          verified: Math.random() > 0.6,
          isFollowing: true,
          category: categories[i % categories.length]
        }));

        setFollowing(mockFollowing);
      } catch (error) {
        console.error('Error fetching following:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFollowing();
  }, [params.id]);

  const handleUnfollow = (userId: string) => {
    setFollowing(following.map(user => 
      user.id === userId 
        ? { ...user, isFollowing: false }
        : user
    ));
  };

  const categories = ['all', 'creators', 'faith', 'lifestyle', 'tech', 'art'];
  
  const filteredFollowing = following.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || user.category === selectedCategory;
    return matchesSearch && matchesCategory && user.isFollowing;
  });

  return (
    <div className="min-h-screen" style={getBackdropStyle('profile')}>
      <AmenityHeader currentPage={`/profiles/${params.id}/following`} />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors mb-4"
          >
            ← Back to Profile
          </button>
          <h1 className="text-4xl font-bold text-white mb-4">Following</h1>
          <p className="text-gray-300">Accounts this user follows</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search following..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-gray-600 rounded-full px-6 py-4 pl-12 text-white focus:border-purple-500 focus:outline-none"
            />
            <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-xl">
              🔍
            </span>
          </div>

          {/* Category Filter */}
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full font-medium transition-colors capitalize whitespace-nowrap ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/20 text-gray-400 hover:text-white hover:bg-white/10'
                }`}
              >
                {category === 'all' ? '🌍 All' : ''}
                {category === 'creators' ? '🎨 Creators' : ''}
                {category === 'faith' ? '🙏 Faith' : ''}
                {category === 'lifestyle' ? '✨ Lifestyle' : ''}
                {category === 'tech' ? '💻 Tech' : ''}
                {category === 'art' ? '🎭 Art' : ''}
                {!['all', 'creators', 'faith', 'lifestyle', 'tech', 'art'].includes(category) ? category : ''}
              </button>
            ))}
          </div>
        </div>

        {/* Following List */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-white text-xl flex items-center space-x-3">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
              <span>Loading following...</span>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredFollowing.map((user) => (
              <div key={user.id} className="bg-black/20 rounded-2xl p-6 border border-gray-700 hover:border-gray-600 transition-colors">
                <div className="flex items-center justify-between">
                  <div 
                    onClick={() => router.push(`/profiles/${user.id}`)}
                    className="flex items-center space-x-4 flex-1 cursor-pointer"
                  >
                    <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white text-xl font-bold">
                      {user.name.charAt(0)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-white font-semibold text-lg">{user.name}</h3>
                        {user.verified && <span className="text-blue-400">✓</span>}
                        {user.category && (
                          <span className="bg-purple-600/20 text-purple-300 text-xs px-2 py-1 rounded-full capitalize">
                            {user.category}
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 mb-1">{user.username}</p>
                      <p className="text-gray-300 text-sm leading-relaxed">{user.bio}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <button 
                      onClick={() => handleUnfollow(user.id)}
                      className="bg-gray-600 hover:bg-red-600 text-white px-6 py-2 rounded-full font-semibold transition-colors"
                    >
                      Following
                    </button>
                    <button 
                      onClick={() => router.push(`/messages/direct/${user.id}`)}
                      className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-full font-semibold transition-colors"
                    >
                      Message
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredFollowing.length === 0 && !loading && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">👤</div>
                <h3 className="text-xl font-semibold text-white mb-2">No accounts found</h3>
                <p className="text-gray-400">
                  {searchQuery || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filter' 
                    : 'This account is not following anyone yet'
                  }
                </p>
                {searchQuery || selectedCategory !== 'all' ? (
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setSelectedCategory('all');
                    }}
                    className="mt-4 text-purple-400 hover:text-purple-300 transition-colors"
                  >
                    Clear filters
                  </button>
                ) : null}
              </div>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 bg-black/20 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-4">Following Insights</h3>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400">
                {following.filter(u => u.isFollowing).length}
              </div>
              <div className="text-gray-400">Total Following</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400">
                {following.filter(u => u.verified && u.isFollowing).length}
              </div>
              <div className="text-gray-400">Verified Accounts</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400">
                {following.filter(u => u.category === 'faith' && u.isFollowing).length}
              </div>
              <div className="text-gray-400">Faith-Based</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-yellow-400">
                {following.filter(u => u.category === 'creators' && u.isFollowing).length}
              </div>
              <div className="text-gray-400">Content Creators</div>
            </div>
          </div>
        </div>

        {/* Suggested Accounts */}
        <div className="mt-12 bg-black/20 rounded-2xl p-8 border border-gray-700">
          <h3 className="text-xl font-bold text-white mb-6">Suggested for You</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {following.filter(u => !u.isFollowing).slice(0, 4).map((user) => (
              <div key={user.id} className="bg-black/30 rounded-xl p-4 border border-gray-700 hover:border-purple-500 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold">
                    {user.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-1">
                      <h4 className="text-white font-medium truncate">{user.name}</h4>
                      {user.verified && <span className="text-blue-400 text-sm">✓</span>}
                    </div>
                    <p className="text-gray-400 text-sm truncate">{user.username}</p>
                  </div>
                  <button 
                    onClick={() => setFollowing(following.map(u => 
                      u.id === user.id ? { ...u, isFollowing: true } : u
                    ))}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm px-3 py-1 rounded-full font-medium transition-colors"
                  >
                    Follow
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      <AmenityFooter />
    </div>
  );
}