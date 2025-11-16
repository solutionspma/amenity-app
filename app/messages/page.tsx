'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

export default function MessagesPage() {
  const [activeChat, setActiveChat] = useState<string>('conv1');
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();

  const conversations = [
    {
      id: 'conv1',
      name: "Pastor Marcus Johnson",
      username: "@pastor_marcus",
      lastMessage: "Blessings to you and your family! 🙏",
      time: "2m",
      unread: 0,
      avatar: "👨‍🦳",
      isOnline: true,
      verified: true,
      platform: 'amenity'
    },
    {
      id: 'conv2',
      name: "Grace Community Group",
      username: "@grace_community",
      lastMessage: "Sarah: Bible study tomorrow at 7 PM!",
      time: "15m",
      unread: 3,
      avatar: "👥",
      isOnline: false,
      verified: true,
      platform: 'amenity'
    },
    {
      id: 'conv3',
      name: "FB: Sarah Chen",
      username: "@sarah.chen.fb",
      lastMessage: "Would love to visit your church!",
      time: "2h",
      unread: 1,
      avatar: "📘",
      isOnline: false,
      verified: false,
      platform: 'facebook'
    }
  ];

  const messages = [
    {
      id: 'msg1',
      sender: "Pastor Marcus Johnson",
      message: "Hello! Thanks for reaching out about serving in ministry. Your heart for service is truly inspiring.",
      time: "2:30 PM",
      isMe: false
    },
    {
      id: 'msg2',
      sender: "Me",
      message: "I've been praying about it and feel called to help with youth ministry. The young people in our community need strong guidance.",
      time: "2:32 PM",
      isMe: true
    },
    {
      id: 'msg3',
      sender: "Pastor Marcus Johnson",
      message: "That's wonderful! We have a great team and would love your heart for young people. God is calling you to this ministry.",
      time: "2:35 PM",
      isMe: false
    },
    {
      id: 'msg4',
      sender: "Me",
      message: "When would be a good time to meet and discuss next steps? I'm available most weekdays after 6 PM.",
      time: "2:40 PM",
      isMe: true
    },
    {
      id: 'msg5',
      sender: "Pastor Marcus Johnson",
      message: "How about Wednesday at 7 PM? We can meet at the church and I'll introduce you to our youth team.",
      time: "2:42 PM",
      isMe: false
    },
    {
      id: 'msg6',
      sender: "Me",
      message: "Perfect! Looking forward to it. Should I prepare anything in advance?",
      time: "2:43 PM",
      isMe: true
    },
    {
      id: 'msg7',
      sender: "Pastor Marcus Johnson",
      message: "Just bring your heart and passion for young people. Blessings to you and your family! 🙏",
      time: "2:45 PM",
      isMe: false
    }
  ];

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const startCall = (type: string) => {
    console.log(`Starting ${type} call with ${activeConversation.name}`);
  };

  const activeConversation = conversations.find(c => c.id === activeChat) || conversations[0];
  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen" style={getBackdropStyle('messages')}>
      <AmenityHeader currentPage="/messages" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-12 gap-6 h-[calc(100vh-200px)]">
          
          {/* Conversations List */}
          <div className="col-span-4 bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-700">
            <div className="p-4 border-b border-gray-700">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Messages</h2>
                <button 
                  onClick={() => router.push('/messages/new')}
                  className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-full transition-colors"
                  title="New Message"
                >
                  ✍️
                </button>
              </div>
              <input 
                type="text" 
                placeholder="Search conversations..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-black/30 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:border-purple-500 focus:outline-none"
              />
            </div>
            
            <div className="overflow-y-auto h-full">
              {filteredConversations.map((conv) => (
                <div 
                  key={conv.id}
                  onClick={() => setActiveChat(conv.id)}
                  className={`p-4 border-b border-gray-700/50 hover:bg-white/5 cursor-pointer transition-colors ${activeChat === conv.id ? 'bg-white/10' : ''}`}
                >
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="text-2xl">{conv.avatar}</div>
                      {conv.isOnline && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-black"></div>
                      )}
                      {conv.platform === 'facebook' && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs">
                          f
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-white truncate">{conv.name}</h3>
                        {conv.verified && <span className="text-blue-400 text-sm">✓</span>}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-gray-400 text-sm truncate">{conv.lastMessage}</p>
                        <span className="text-gray-500 text-xs ml-2">{conv.time}</span>
                      </div>
                    </div>
                    {conv.unread > 0 && (
                      <div className="bg-purple-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {conv.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}

              {filteredConversations.length === 0 && (
                <div className="p-8 text-center">
                  <div className="text-4xl mb-2">💬</div>
                  <p className="text-gray-400">No conversations found</p>
                  {searchQuery && (
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="text-purple-400 hover:text-purple-300 text-sm mt-2"
                    >
                      Clear search
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="col-span-8 bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-700 flex flex-col">
            
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-700 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{activeConversation.avatar}</div>
                <div>
                  <div className="flex items-center space-x-2">
                    <h3 className="font-semibold text-white">{activeConversation.name}</h3>
                    {activeConversation.verified && <span className="text-blue-400">✓</span>}
                  </div>
                  <p className="text-gray-400 text-sm">
                    {activeConversation.isOnline ? (
                      <span className="text-green-400">● Online</span>
                    ) : (
                      'Last seen recently'
                    )}
                    {activeConversation.platform === 'facebook' && ' • Facebook User'}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button 
                  onClick={() => startCall('audio')}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors" 
                  title="Voice Call"
                >
                  📞
                </button>
                <button 
                  onClick={() => startCall('video')}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors" 
                  title="Video Call"
                >
                  📹
                </button>
                <button 
                  onClick={() => router.push(`/profiles/${activeConversation.username.slice(1)}`)}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors" 
                  title="View Profile"
                >
                  👤
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors" title="More Options">
                  ⋯
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    msg.isMe 
                      ? 'bg-purple-600 text-white' 
                      : 'bg-black/30 text-white border border-gray-600'
                  }`}>
                    <p className="break-words leading-relaxed">{msg.message}</p>
                    <div className={`text-xs mt-2 ${msg.isMe ? 'text-purple-200' : 'text-gray-400'}`}>
                      {msg.time}
                      {msg.isMe && (
                        <span className="ml-2 text-green-400">✓✓</span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-3">
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors" title="Attach File">
                  📎
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white p-2 rounded-full transition-colors" title="Voice Message">
                  🎤
                </button>
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder={`Message ${activeConversation.name}...`}
                  className="flex-1 bg-black/30 border border-gray-600 rounded-full px-4 py-3 text-white placeholder-gray-400 focus:border-purple-500 focus:outline-none"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className={`p-2 rounded-full transition-colors ${
                    newMessage.trim()
                      ? 'bg-purple-600 hover:bg-purple-700 text-white'
                      : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  }`}
                  title="Send Message"
                >
                  🚀
                </button>
              </div>
              
              {activeConversation.platform === 'facebook' && (
                <div className="mt-2 text-xs text-gray-400 text-center">
                  🔒 Messages with Facebook users are end-to-end encrypted
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <AmenityFooter />
    </div>
  );
}
