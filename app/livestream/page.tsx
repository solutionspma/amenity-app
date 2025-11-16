'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

interface LiveStream {
  id: string;
  title: string;
  description: string;
  streamer: {
    name: string;
    avatar: string;
    verified: boolean;
    type: 'pastor' | 'church' | 'individual';
  };
  thumbnail: string;
  viewers: number;
  category: string;
  tags: string[];
  isLive: boolean;
  startTime: string;
  duration?: string;
}

export default function LivestreamPage() {
  const [streams, setStreams] = useState<LiveStream[]>([]);
  const [selectedStream, setSelectedStream] = useState<LiveStream | null>(null);
  const [chatMessages, setChatMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isFollowing, setIsFollowing] = useState(false);
  const [donations, setDonations] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Mock livestream data
    const mockStreams: LiveStream[] = [
      {
        id: '1',
        title: 'Sunday Morning Service - Faith Community Church',
        description: 'Join us for our Sunday worship service with Pastor Marcus Johnson. Today\'s message: "Walking in Faith During Uncertain Times"',
        streamer: {
          name: 'Faith Community Church',
          avatar: '/api/placeholder/40/40',
          verified: true,
          type: 'church'
        },
        thumbnail: '/api/placeholder/800/450',
        viewers: 1247,
        category: 'Worship Service',
        tags: ['worship', 'sermon', 'community'],
        isLive: true,
        startTime: '2 hours ago'
      },
      {
        id: '2',
        title: 'Wednesday Night Bible Study - Romans Chapter 8',
        description: 'Deep dive into Romans 8 with interactive discussion and prayer',
        streamer: {
          name: 'Pastor Sarah Williams',
          avatar: '/api/placeholder/40/40',
          verified: true,
          type: 'pastor'
        },
        thumbnail: '/api/placeholder/800/450',
        viewers: 389,
        category: 'Bible Study',
        tags: ['bible', 'study', 'romans'],
        isLive: true,
        startTime: '45 minutes ago'
      },
      {
        id: '3',
        title: 'Youth Group Worship Night',
        description: 'Contemporary worship and testimonies from our youth',
        streamer: {
          name: 'Grace Youth Ministry',
          avatar: '/api/placeholder/40/40',
          verified: false,
          type: 'church'
        },
        thumbnail: '/api/placeholder/800/450',
        viewers: 156,
        category: 'Youth Ministry',
        tags: ['youth', 'worship', 'testimonies'],
        isLive: true,
        startTime: '1 hour ago'
      }
    ];

    const mockChatMessages = [
      { id: 1, user: 'John_Faith', message: 'Amen! Powerful message today 🙏', timestamp: '2m ago', isVerified: false },
      { id: 2, user: 'Sarah_G', message: 'Thank you Pastor Marcus! This really spoke to my heart', timestamp: '3m ago', isVerified: false },
      { id: 3, user: 'GraceChurch_Official', message: 'Welcome everyone! Please share prayer requests in the comments', timestamp: '5m ago', isVerified: true },
      { id: 4, user: 'Mike_Believer', message: 'Praying for healing for my mother', timestamp: '7m ago', isVerified: false },
      { id: 5, user: 'Jennifer_Hope', message: 'God bless this ministry! 💕', timestamp: '10m ago', isVerified: false }
    ];

    setStreams(mockStreams);
    setSelectedStream(mockStreams[0]);
    setChatMessages(mockChatMessages);
  }, []);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    const message = {
      id: Date.now(),
      user: 'You',
      message: newMessage,
      timestamp: 'now',
      isVerified: false
    };
    
    setChatMessages(prev => [message, ...prev]);
    setNewMessage('');
  };

  const handleDonation = (amount: number) => {
    setDonations(prev => prev + amount);
    
    const donationMessage = {
      id: Date.now(),
      user: 'You',
      message: `💰 Donated $${amount}! God bless!`,
      timestamp: 'now',
      isVerified: false,
      isDonation: true
    };
    
    setChatMessages(prev => [donationMessage, ...prev]);
  };

  if (!selectedStream) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-700 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-8">
              <Link href="/" className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                ✨ Amenity
              </Link>
              
              <div className="hidden md:flex space-x-6">
                <Link href="/feed" className="text-gray-300 hover:text-white">Feed</Link>
                <Link href="/groups" className="text-gray-300 hover:text-white">Groups</Link>
                <Link href="/livestream" className="text-yellow-400 font-medium">Live</Link>
                <Link href="/marketplace" className="text-gray-300 hover:text-white">Store</Link>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link 
                href="/livestream/studio" 
                className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-red-400 hover:to-pink-400 transition-all"
              >
                🔴 Go Live
              </Link>
              
              <Link href="/profiles/me" className="w-8 h-8 rounded-full bg-gradient-to-r from-yellow-400 to-orange-500 flex items-center justify-center text-black font-bold">
                M
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid lg:grid-cols-4 gap-6">
          
          {/* Main Video Player */}
          <div className="lg:col-span-3">
            <div className="bg-black rounded-xl overflow-hidden aspect-video relative">
              {/* Video Player */}
              <video 
                ref={videoRef}
                className="w-full h-full object-cover"
                poster={selectedStream.thumbnail}
                controls
                autoPlay
                muted
              >
                <source src="/api/placeholder-video" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              
              {/* Live Indicator */}
              <div className="absolute top-4 left-4 flex items-center space-x-2">
                <div className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-bold flex items-center space-x-1">
                  <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  <span>LIVE</span>
                </div>
                <div className="bg-black/60 backdrop-blur-sm text-white px-3 py-1 rounded-full text-sm">
                  👁️ {selectedStream.viewers.toLocaleString()} watching
                </div>
              </div>

              {/* Stream Controls Overlay */}
              <div className="absolute bottom-4 right-4 flex space-x-2">
                <button className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/80 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                </button>
                
                <button className="bg-black/60 backdrop-blur-sm text-white p-2 rounded-lg hover:bg-black/80 transition-colors">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Stream Info */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 mt-4">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 className="text-2xl font-bold text-white mb-2">{selectedStream.title}</h1>
                  <p className="text-gray-300 mb-4">{selectedStream.description}</p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <img 
                        src={selectedStream.streamer.avatar} 
                        alt={selectedStream.streamer.name}
                        className="w-8 h-8 rounded-full"
                      />
                      <span className="text-white font-medium">{selectedStream.streamer.name}</span>
                      {selectedStream.streamer.verified && (
                        <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                        </svg>
                      )}
                    </div>
                    
                    <div className="bg-purple-600/20 text-purple-400 px-3 py-1 rounded-full">
                      {selectedStream.category}
                    </div>
                    
                    <div className="text-gray-400">
                      Started {selectedStream.startTime}
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    {selectedStream.tags.map((tag) => (
                      <span key={tag} className="text-yellow-400 text-sm">#{tag}</span>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3 ml-4">
                  <button
                    onClick={() => setIsFollowing(!isFollowing)}
                    className={`px-6 py-2 rounded-lg font-medium transition-all ${
                      isFollowing
                        ? 'bg-gray-600 text-white hover:bg-gray-700'
                        : 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black hover:from-yellow-400 hover:to-orange-400'
                    }`}
                  >
                    {isFollowing ? 'Following' : 'Follow'}
                  </button>
                  
                  <button className="bg-white/10 text-white px-6 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors">
                    <svg className="w-5 h-5 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                    </svg>
                    Share
                  </button>
                </div>
              </div>

              {/* Quick Donations */}
              <div className="border-t border-white/20 pt-4">
                <h3 className="text-white font-medium mb-3">Support This Ministry</h3>
                <div className="flex space-x-3">
                  {[5, 10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      onClick={() => handleDonation(amount)}
                      className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 rounded-lg font-medium hover:from-green-400 hover:to-emerald-400 transition-all"
                    >
                      ${amount}
                    </button>
                  ))}
                  <button className="bg-white/10 text-white px-4 py-2 rounded-lg font-medium hover:bg-white/20 transition-colors">
                    Custom
                  </button>
                </div>
                {donations > 0 && (
                  <p className="text-green-400 text-sm mt-2">💚 You've donated ${donations} today! Thank you!</p>
                )}
              </div>
            </div>
          </div>

          {/* Chat Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/20">
                <h3 className="text-white font-bold flex items-center">
                  💬 Live Chat
                  <span className="ml-2 text-sm text-gray-400">({selectedStream.viewers} viewers)</span>
                </h3>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {chatMessages.map((msg) => (
                  <div key={msg.id} className={`${msg.isDonation ? 'bg-green-500/20 border border-green-500/50 rounded-lg p-2' : ''}`}>
                    <div className="flex items-start space-x-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        msg.isVerified ? 'bg-yellow-500 text-black' : 'bg-purple-500 text-white'
                      }`}>
                        {msg.user.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-1">
                          <span className="text-white font-medium text-sm">{msg.user}</span>
                          {msg.isVerified && (
                            <svg className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                            </svg>
                          )}
                          <span className="text-gray-500 text-xs">{msg.timestamp}</span>
                        </div>
                        <p className="text-gray-300 text-sm break-words">{msg.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Chat Input */}
              <div className="p-4 border-t border-white/20">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-4 py-2 rounded-lg font-medium hover:from-yellow-400 hover:to-orange-400 transition-all"
                  >
                    Send
                  </button>
                </div>
                
                <div className="flex space-x-2 mt-2">
                  <button className="text-gray-400 hover:text-white text-sm">🙏 Pray</button>
                  <button className="text-gray-400 hover:text-white text-sm">❤️ Love</button>
                  <button className="text-gray-400 hover:text-white text-sm">🔥 Fire</button>
                  <button className="text-gray-400 hover:text-white text-sm">✨ Amen</button>
                </div>
              </div>
            </div>

            {/* More Live Streams */}
            <div className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 mt-6 p-4">
              <h3 className="text-white font-bold mb-4 flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2 animate-pulse"></span>
                Other Live Streams
              </h3>
              
              <div className="space-y-3">
                {streams.filter(stream => stream.id !== selectedStream.id).map((stream) => (
                  <div 
                    key={stream.id}
                    onClick={() => setSelectedStream(stream)}
                    className="flex items-center space-x-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer transition-colors"
                  >
                    <div className="relative">
                      <img 
                        src={stream.thumbnail} 
                        alt={stream.title}
                        className="w-16 h-10 rounded object-cover"
                      />
                      <div className="absolute -top-1 -right-1 bg-red-600 text-white text-xs px-1 rounded">
                        LIVE
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-white font-medium text-sm truncate">{stream.title}</h4>
                      <p className="text-gray-400 text-xs">{stream.streamer.name}</p>
                      <p className="text-gray-500 text-xs">{stream.viewers} watching</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}