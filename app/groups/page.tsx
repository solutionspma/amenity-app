'use client';

import { useState } from 'react';
import Link from 'next/link';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { useBackdrop } from '@/contexts/BackdropContext';

interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  image: string;
  category: 'ministry' | 'bible-study' | 'youth' | 'prayer' | 'community' | 'missions';
  isJoined: boolean;
  isPrivate: boolean;
  pastor?: string;
  lastActivity: string;
}

export default function GroupsPage() {
  const { getBackdropStyle } = useBackdrop();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const mockGroups: Group[] = [
    {
      id: '1',
      name: 'Sunday Service Fellowship',
      description: 'Connect with fellow believers after our weekly service. Share testimonies, prayer requests, and build lasting friendships.',
      memberCount: 247,
      image: '/images/groups/sunday-fellowship.jpg',
      category: 'ministry',
      isJoined: true,
      isPrivate: false,
      pastor: 'Pastor Johnson',
      lastActivity: '2 hours ago'
    },
    {
      id: '2', 
      name: 'Bible Study Warriors',
      description: 'Deep dive into Scripture with guided study sessions. Growing in faith through Gods Word together.',
      memberCount: 89,
      image: '/images/groups/bible-study.jpg',
      category: 'bible-study',
      isJoined: false,
      isPrivate: false,
      pastor: 'Elder Smith',
      lastActivity: '5 hours ago'
    },
    {
      id: '3',
      name: 'Youth Alive Ministry',
      description: 'Teens and young adults building faith, friendship, and future together. Fun events, service projects, and spiritual growth.',
      memberCount: 156,
      image: '/images/groups/youth-ministry.jpg',
      category: 'youth',
      isJoined: true,
      isPrivate: false,
      pastor: 'Pastor Maria',
      lastActivity: '1 day ago'
    },
    {
      id: '4',
      name: 'Prayer Warriors Circle',
      description: 'Dedicated intercessors covering our church and community in prayer. Join us in seeking Gods face together.',
      memberCount: 67,
      image: '/images/groups/prayer-circle.jpg',
      category: 'prayer',
      isJoined: false,
      isPrivate: true,
      pastor: 'Deacon Williams',
      lastActivity: '3 hours ago'
    },
    {
      id: '5',
      name: 'Community Outreach Team',
      description: 'Serving our neighbors with love in action. Food drives, homeless ministry, and community events.',
      memberCount: 134,
      image: '/images/groups/community-outreach.jpg',
      category: 'community',
      isJoined: false,
      isPrivate: false,
      pastor: 'Sister Janet',
      lastActivity: '6 hours ago'
    },
    {
      id: '6',
      name: 'Global Missions Support',
      description: 'Supporting missionaries worldwide through prayer, funding, and care packages. Expanding Gods kingdom globally.',
      memberCount: 45,
      image: '/images/groups/missions.jpg',
      category: 'missions',
      isJoined: true,
      isPrivate: false,
      pastor: 'Pastor Rodriguez',
      lastActivity: '4 hours ago'
    }
  ];

  const categories = [
    { id: 'all', name: 'All Groups', icon: '🏠' },
    { id: 'ministry', name: 'Ministry', icon: '⛪' },
    { id: 'bible-study', name: 'Bible Study', icon: '📖' },
    { id: 'youth', name: 'Youth', icon: '🌟' },
    { id: 'prayer', name: 'Prayer', icon: '🙏' },
    { id: 'community', name: 'Community', icon: '🤝' },
    { id: 'missions', name: 'Missions', icon: '🌍' }
  ];

  const filteredGroups = mockGroups.filter(group => {
    const matchesSearch = group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         group.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || group.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getCategoryColor = (category: string) => {
    const colors = {
      ministry: 'bg-purple-500',
      'bible-study': 'bg-blue-500',
      youth: 'bg-green-500',
      prayer: 'bg-yellow-500',
      community: 'bg-red-500',
      missions: 'bg-indigo-500'
    };
    return colors[category as keyof typeof colors] || 'bg-gray-500';
  };

  return (
    <div className="min-h-screen" style={getBackdropStyle('groups')}>
      <AmenityHeader currentPage="/groups" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Faith Groups</h1>
              <p className="text-gray-300">
                Connect with believers, grow in faith, and serve together in community
              </p>
            </div>
            <Link 
              href="/groups/create"
              className="mt-4 md:mt-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
            >
              ✨ Create Group
            </Link>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search groups..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 rounded-lg bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category.id
                      ? 'bg-white text-black'
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  <span>{category.icon}</span>
                  <span>{category.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Groups Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredGroups.map((group) => (
            <div
              key={group.id}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 overflow-hidden hover:bg-white/20 transition-all transform hover:scale-105"
            >
              <div className="relative h-48">
                <div 
                  className="w-full h-full bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center"
                  style={{
                    backgroundImage: `url(${group.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="text-6xl opacity-50">
                    {group.category === 'ministry' && '⛪'}
                    {group.category === 'bible-study' && '📖'}
                    {group.category === 'youth' && '🌟'}
                    {group.category === 'prayer' && '🙏'}
                    {group.category === 'community' && '🤝'}
                    {group.category === 'missions' && '🌍'}
                  </div>
                </div>
                <div className="absolute top-4 left-4">
                  <span className={`${getCategoryColor(group.category)} text-white px-2 py-1 rounded-full text-xs font-medium`}>
                    {group.category.charAt(0).toUpperCase() + group.category.slice(1).replace('-', ' ')}
                  </span>
                </div>
                {group.isPrivate && (
                  <div className="absolute top-4 right-4">
                    <span className="bg-black/50 text-white px-2 py-1 rounded-full text-xs">
                      🔒 Private
                    </span>
                  </div>
                )}
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{group.name}</h3>
                <p className="text-gray-300 text-sm mb-4 line-clamp-3">{group.description}</p>
                
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-400">
                    <span>👥 {group.memberCount} members</span>
                    <span>⏰ {group.lastActivity}</span>
                  </div>
                </div>
                
                {group.pastor && (
                  <div className="text-sm text-gray-400 mb-4">
                    Led by {group.pastor}
                  </div>
                )}
                
                <div className="flex space-x-2">
                  {group.isJoined ? (
                    <>
                      <Link
                        href={`/groups/${group.id}`}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:from-green-600 hover:to-green-700 transition-all"
                      >
                        ✅ View Group
                      </Link>
                      <button className="bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors">
                        📤
                      </button>
                    </>
                  ) : (
                    <>
                      <button className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white py-2 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all">
                        ➕ Join Group
                      </button>
                      <Link
                        href={`/groups/${group.id}`}
                        className="bg-white/10 text-white py-2 px-4 rounded-lg hover:bg-white/20 transition-colors text-center"
                      >
                        👁️
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-bold text-white mb-2">No groups found</h3>
            <p className="text-gray-400 mb-6">
              Try adjusting your search or category filter
            </p>
            <Link
              href="/groups/create"
              className="inline-block bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              Create the first group
            </Link>
          </div>
        )}
      </div>

      <AmenityFooter />
    </div>
  );
}