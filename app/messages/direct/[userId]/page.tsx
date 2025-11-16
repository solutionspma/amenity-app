'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

export default function DirectMessagePage() {
  const [newMessage, setNewMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();
  const params = useParams();
  const userId = params?.userId as string;

  // Mock user data - in a real app, this would come from an API
  const user = {
    id: userId,
    name: userId === 'pastor_marcus' ? "Pastor Marcus Johnson" : 
          userId === 'sarah_w' ? "Sarah Williams" :
          userId === 'david_c' ? "David Chen" : "Unknown User",
    username: `@${userId}`,
    avatar: userId === 'pastor_marcus' ? "👨‍🦳" : 
            userId === 'sarah_w' ? "👩" : 
            userId === 'david_c' ? "👨" : "👤",
    isOnline: true,
    verified: userId === 'pastor_marcus'
  };

  useEffect(() => {
    // Load messages for this direct conversation
    const mockMessages = [
      {
        id: 'dm1',
        sender: user.name,
        message: "Hello! Thanks for reaching out. How can I help you today?",
        time: "2:30 PM",
        isMe: false
      },
      {
        id: 'dm2',
        sender: "Me",
        message: "Hi! I've been thinking about getting more involved in the church community.",
        time: "2:32 PM",
        isMe: true
      },
      {
        id: 'dm3',
        sender: user.name,
        message: "That's wonderful! There are many ways to serve. What areas interest you most?",
        time: "2:35 PM",
        isMe: false
      }
    ];
    setMessages(mockMessages);
  }, [userId, user.name]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message = {
        id: `dm_${Date.now()}`,
        sender: "Me",
        message: newMessage,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: true
      };
      setMessages([...messages, message]);
      setNewMessage('');
    }
  };

  const startCall = (type: string) => {
    console.log(`Starting ${type} call with ${user.name}`);
  };

  return (
    <div className="min-h-screen" style={getBackdropStyle('messages')}>
      <AmenityHeader currentPage="/messages" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="bg-black/20 backdrop-blur-sm rounded-2xl border border-gray-700 flex flex-col h-[calc(100vh-200px)]">
          
          {/* Chat Header */}
          <div className="p-4 border-b border-gray-700 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/messages')}
                className="text-gray-400 hover:text-white transition-colors mr-2"
              >
                ← Back
              </button>
              <div className="text-2xl">{user.avatar}</div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="font-semibold text-white">{user.name}</h3>
                  {user.verified && <span className="text-blue-400">✓</span>}
                </div>
                <p className="text-gray-400 text-sm">
                  {user.isOnline ? (
                    <span className="text-green-400">● Online</span>
                  ) : (
                    'Last seen recently'
                  )}
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
                onClick={() => router.push(`/profiles/${userId}`)}
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
                placeholder={`Message ${user.name}...`}
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
          </div>
        </div>
      </div>

      <AmenityFooter />
    </div>
  );
}