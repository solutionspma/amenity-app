'use client';

import { useState, useEffect } from 'react';
import {
  UserGroupIcon,
  TrophyIcon,
  ChatBubbleLeftRightIcon,
  HeartIcon,
  ShareIcon,
  SparklesIcon,
  FireIcon
} from '@heroicons/react/24/outline';

interface Challenge {
  id: string;
  title: string;
  description: string;
  prize: string;
  participants: number;
  deadline: string;
  type: 'video' | 'photo' | 'live' | 'community';
  featured: boolean;
}

interface CommunitySpace {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  is_private: boolean;
  recent_activity: string;
}

export default function SocialHub() {
  const [activeTab, setActiveTab] = useState('challenges');
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [communities, setCommunities] = useState<CommunitySpace[]>([]);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = () => {
    // Mock data for challenges
    const mockChallenges: Challenge[] = [
      {
        id: '1',
        title: '#CreatorGrowth30',
        description: 'Share your best creator tip and help the community grow together!',
        prize: '$500 + Featured spot on Amenity',
        participants: 234,
        deadline: '2025-11-30',
        type: 'video',
        featured: true
      },
      {
        id: '2',
        title: 'Ministry Monday',
        description: 'Share how technology has enhanced your ministry work',
        prize: 'Ministry spotlight + $200',
        participants: 89,
        deadline: '2025-11-25',
        type: 'photo',
        featured: false
      },
      {
        id: '3',
        title: 'AI Creator Tools',
        description: 'Show how JAY-I has helped optimize your content creation',
        prize: 'Premium features for 6 months',
        participants: 156,
        deadline: '2025-12-15',
        type: 'live',
        featured: true
      }
    ];

    const mockCommunities: CommunitySpace[] = [
      {
        id: '1',
        name: 'Tech Ministry Leaders',
        description: 'Connecting ministry leaders who use technology to spread the Gospel',
        members: 1247,
        category: 'Ministry',
        is_private: false,
        recent_activity: '15 new posts today'
      },
      {
        id: '2',
        name: 'Creator Economy Tips',
        description: 'Share strategies and tips for growing your creator business',
        members: 2890,
        category: 'Business',
        is_private: false,
        recent_activity: '23 new posts today'
      },
      {
        id: '3',
        name: 'AI Content Creators',
        description: 'Exploring how AI tools like JAY-I can enhance content creation',
        members: 987,
        category: 'Technology',
        is_private: false,
        recent_activity: '8 new posts today'
      }
    ];

    setChallenges(mockChallenges);
    setCommunities(mockCommunities);
  };

  const joinChallenge = (challengeId: string) => {
    setChallenges(challenges.map(c => 
      c.id === challengeId 
        ? { ...c, participants: c.participants + 1 }
        : c
    ));
  };

  const joinCommunity = (communityId: string) => {
    setCommunities(communities.map(c => 
      c.id === communityId 
        ? { ...c, members: c.members + 1 }
        : c
    ));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="text-center py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Social Hub</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Connect with fellow creators, participate in challenges, and join communities 
          that help you grow your creator journey on Amenity.
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex space-x-8">
          {[
            { id: 'challenges', name: 'Creator Challenges', icon: TrophyIcon },
            { id: 'communities', name: 'Communities', icon: UserGroupIcon },
            { id: 'collaborations', name: 'Collaborations', icon: ChatBubbleLeftRightIcon }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-purple-500 text-purple-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.name}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <div className="py-6">
        {activeTab === 'challenges' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Active Challenges</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Create Challenge
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {challenges.map((challenge) => (
                <div 
                  key={challenge.id} 
                  className={`bg-white rounded-lg shadow-sm border-2 transition-all hover:shadow-md ${
                    challenge.featured 
                      ? 'border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50' 
                      : 'border-gray-200'
                  }`}
                >
                  <div className="p-6">
                    {/* Challenge Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{challenge.title}</h3>
                          {challenge.featured && (
                            <FireIcon className="w-4 h-4 text-orange-500" />
                          )}
                        </div>
                        <p className="text-gray-600 text-sm mb-3">{challenge.description}</p>
                      </div>
                    </div>

                    {/* Challenge Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Prize:</span>
                        <span className="font-medium text-green-600">{challenge.prize}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Participants:</span>
                        <span className="font-medium text-gray-900">{challenge.participants}</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Deadline:</span>
                        <span className="font-medium text-red-600">
                          {new Date(challenge.deadline).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-500">Type:</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          challenge.type === 'video' ? 'bg-blue-100 text-blue-700' :
                          challenge.type === 'photo' ? 'bg-green-100 text-green-700' :
                          challenge.type === 'live' ? 'bg-red-100 text-red-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {challenge.type.toUpperCase()}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-2">
                      <button
                        onClick={() => joinChallenge(challenge.id)}
                        className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                      >
                        Join Challenge
                      </button>
                      <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                        <ShareIcon className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'communities' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Creator Communities</h2>
              <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                Create Community
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {communities.map((community) => (
                <div key={community.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{community.name}</h3>
                        {community.is_private && (
                          <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded-full text-xs font-medium">
                            Private
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 text-sm mb-3">{community.description}</p>
                    </div>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Members:</span>
                      <span className="font-medium text-gray-900">{community.members.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Category:</span>
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                        {community.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-500">Activity:</span>
                      <span className="font-medium text-green-600">{community.recent_activity}</span>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <button
                      onClick={() => joinCommunity(community.id)}
                      className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      Join Community
                    </button>
                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                      <HeartIcon className="w-4 h-4 text-gray-600" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'collaborations' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Collaboration Hub</h2>
            
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg p-8 text-white text-center">
              <SparklesIcon className="w-12 h-12 mx-auto mb-4 opacity-80" />
              <h3 className="text-2xl font-bold mb-2">Coming Soon!</h3>
              <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
                The collaboration system is being enhanced with AI-powered creator matching, 
                automated partnership suggestions, and revenue sharing tools.
              </p>
              <button className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-50 transition-colors">
                Join Waitlist
              </button>
            </div>

            {/* Preview Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  title: 'AI Creator Matching',
                  description: 'Find perfect collaboration partners based on audience overlap and content style',
                  icon: SparklesIcon
                },
                {
                  title: 'Revenue Sharing',
                  description: 'Automated revenue distribution for collaborative content',
                  icon: TrophyIcon
                },
                {
                  title: 'Project Management',
                  description: 'Built-in tools to manage collaborative projects from idea to launch',
                  icon: ChatBubbleLeftRightIcon
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 text-center">
                  <feature.icon className="w-8 h-8 text-purple-600 mx-auto mb-4" />
                  <h3 className="font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600 text-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}