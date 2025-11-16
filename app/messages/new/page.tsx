'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

export default function NewMessagePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [messageText, setMessageText] = useState('');
  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();

  const users = [
    {
      id: 'user1',
      name: "Pastor Marcus Johnson",
      username: "@pastor_marcus",
      avatar: "👨‍🦳",
      isOnline: true,
      verified: true,
      privacy: 'public',
      platform: 'amenity'
    },
    {
      id: 'user2', 
      name: "Sarah Williams",
      username: "@sarah_w",
      avatar: "👩",
      isOnline: false,
      verified: false,
      privacy: 'public',
      platform: 'amenity'
    },
    {
      id: 'user3',
      name: "David Chen",
      username: "@david_c",
      avatar: "👨",
      isOnline: true,
      verified: false,
      privacy: 'public',
      platform: 'amenity'
    },
    {
      id: 'user4',
      name: "FB: Maria Rodriguez",
      username: "@maria.rodriguez.fb",
      avatar: "📘",
      isOnline: false,
      verified: false,
      privacy: 'public',
      platform: 'facebook'
    },
    {
      id: 'user5',
      name: "Grace Community Group",
      username: "@grace_community",
      avatar: "👥",
      isOnline: false,
      verified: true,
      privacy: 'public',
      platform: 'amenity'
    }
  ];

  const filteredUsers = users.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleUserSelection = (userId: string) => {
    setSelectedUsers(prev =>
      prev.includes(userId)
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const startConversation = () => {
    if (selectedUsers.length > 0) {
      // In a real app, you'd create the conversation and redirect
      console.log('Starting conversation with:', selectedUsers);
      router.push('/messages');
    }
  };

  const selectedUserObjects = users.filter(user => selectedUsers.includes(user.id));

  return (
    <div className="min-h-screen" style={getBackdropStyle('messages')}>
      <AmenityHeader currentPage="/messages" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">New Message</h1>
              <p className="text-gray-400">Start a conversation with church members and friends</p>
            </div>
            <button
              onClick={() => router.back()}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-full transition-colors"
            >
              Cancel
            </button>
          </div>

          {/* Selected Users */}
          {selectedUsers.length > 0 && (
            <div className="mb-4">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Selected ({selectedUsers.length}):</h3>
              <div className="flex flex-wrap gap-2">
                {selectedUserObjects.map(user => (
                  <div key={user.id} className="bg-purple-600/20 border border-purple-500 rounded-full px-3 py-1 flex items-center space-x-2">
                    <span className="text-sm">{user.avatar}</span>
                    <span className="text-white text-sm">{user.name}</span>
                    <button
                      onClick={() => toggleUserSelection(user.id)}
                      className="text-gray-300 hover:text-white ml-1"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Search */}
          <div className="mb-6">
            <input
              type="text"
              placeholder="Search for people to message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
            />
          </div>

          {/* User List */}
          <div className="space-y-2 mb-6">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => toggleUserSelection(user.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-colors ${
                  selectedUsers.includes(user.id)
                    ? 'bg-purple-600/20 border-purple-500'
                    : 'bg-black/20 border-gray-700 hover:bg-white/5'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <div className="text-2xl">{user.avatar}</div>
                    {user.isOnline && (
                      <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                    )}
                    {user.platform === 'facebook' && (
                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                        f
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-white">{user.name}</h3>
                      {user.verified && <span className="text-blue-400 text-sm">✓</span>}
                      {user.privacy === 'private' && <span className="text-gray-400 text-sm">🔒</span>}
                    </div>
                    <p className="text-gray-400 text-sm">
                      {user.username}
                      {user.platform === 'facebook' && ' • Facebook User'}
                    </p>
                  </div>
                  <div className="flex items-center">
                    {selectedUsers.includes(user.id) ? (
                      <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">✓</span>
                      </div>
                    ) : (
                      <div className="w-6 h-6 border-2 border-gray-500 rounded-full"></div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {filteredUsers.length === 0 && searchQuery && (
              <div className="text-center py-8">
                <div className="text-4xl mb-2">🔍</div>
                <p className="text-gray-400">No users found matching "{searchQuery}"</p>
                <button
                  onClick={() => setSearchQuery('')}
                  className="text-purple-400 hover:text-purple-300 text-sm mt-2"
                >
                  Clear search
                </button>
              </div>
            )}
          </div>

          {/* Message Preview */}
          {selectedUsers.length > 0 && (
            <div className="mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-2">Message (Optional):</h3>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Type your message..."
                rows={3}
                className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none resize-none"
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-400">
              {selectedUsers.length === 0 && "Select people to start a conversation"}
              {selectedUsers.length === 1 && "Ready to start direct message"}
              {selectedUsers.length > 1 && `Ready to create group with ${selectedUsers.length} people`}
            </div>
            <button
              onClick={startConversation}
              disabled={selectedUsers.length === 0}
              className={`px-6 py-3 rounded-full font-semibold transition-colors ${
                selectedUsers.length > 0
                  ? 'bg-purple-600 hover:bg-purple-700 text-white'
                  : 'bg-gray-600 text-gray-400 cursor-not-allowed'
              }`}
            >
              {selectedUsers.length <= 1 ? 'Start Chat' : 'Create Group'}
            </button>
          </div>

          {/* Cross-platform Notice */}
          {selectedUserObjects.some(user => user.platform === 'facebook') && (
            <div className="mt-4 p-3 bg-blue-600/10 border border-blue-500/30 rounded-lg">
              <p className="text-blue-300 text-sm">
                🔒 This conversation includes Facebook users. All messages will be end-to-end encrypted and follow cross-platform privacy protocols.
              </p>
            </div>
          )}

        </div>
      </div>

      <AmenityFooter />
    </div>
  );
}