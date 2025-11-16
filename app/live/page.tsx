'use client';

import Link from 'next/link';
import SmartLogo from '@/components/SmartLogo';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

export default function LivePage() {
  const { getBackdropStyle } = useBackdrop();
  
  return (
    <div className="min-h-screen" style={getBackdropStyle('live')}>
      <AmenityHeader currentPage="/live" />
      
      {/* Live Status Bar */}
      <div className="bg-red-600/20 border-b border-red-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                156 Live Streams
              </span>
              <span className="text-white/80 text-sm">🔴 Wootube Live</span>
            </div>
            <button className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-2 rounded-lg font-medium hover:from-red-600 hover:to-red-700 transition-all">
              📹 Go Live Now
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-12 gap-6">
          {/* Main Live Stream */}
          <div className="col-span-8">
            <div className="bg-black rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-video bg-gray-900 relative">
                <img src="/images/team-meeting.jpg" className="w-full h-full object-cover" alt="Live Stream" />
                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
                  <span className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></span>
                  LIVE
                </div>
                <div className="absolute top-4 right-4 bg-black/50 text-white px-3 py-1 rounded-lg text-sm">
                  2,847 watching
                </div>
                
                {/* Stream Controls */}
                <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">▶️</button>
                    <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">🔊</button>
                    <button className="bg-white/20 hover:bg-white/30 text-white p-2 rounded-full">⚙️</button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg text-sm">❤️ 1.2K</button>
                    <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">🙏 Prayer</button>
                    <button className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg text-sm">💰 Donate</button>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <h1 className="text-2xl font-bold text-white mb-2">Sunday Evening Service - Grace Community Church</h1>
                <p className="text-gray-400 mb-4">Pastor Marcus Johnson • Started 45 minutes ago</p>
                <p className="text-gray-300">
                  Join us for our weekly Sunday evening service as we dive deep into the Book of Romans. 
                  Tonight we're exploring Romans 8:28 and how God works all things together for good.
                </p>
              </div>
            </div>
          </div>

          {/* Live Chat */}
          <div className="col-span-4">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700 h-full flex flex-col">
              <div className="p-4 border-b border-gray-700">
                <h3 className="text-lg font-semibold text-white flex items-center">
                  💬 Live Chat
                  <span className="ml-2 bg-green-500 text-xs px-2 py-1 rounded-full">2,847</span>
                </h3>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto space-y-3">
                {[
                  { name: "Sarah M.", message: "Amen! God is so good! 🙏", time: "now" },
                  { name: "David L.", message: "Thank you Pastor Marcus for this powerful message", time: "2m" },
                  { name: "Jennifer K.", message: "Praying for everyone watching tonight ❤️", time: "3m" },
                  { name: "Michael R.", message: "This is exactly what I needed to hear today", time: "5m" },
                  { name: "Lisa P.", message: "Romans 8:28 is my favorite verse! 📖", time: "7m" }
                ].map((chat, i) => (
                  <div key={i} className="text-sm">
                    <div className="flex items-start space-x-2">
                      <div className="w-6 h-6 bg-gradient-to-r from-amber-500 to-orange-600 rounded-full flex-shrink-0"></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-white">{chat.name}</span>
                          <span className="text-xs text-gray-500">{chat.time}</span>
                        </div>
                        <p className="text-gray-300 mt-1">{chat.message}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-4 border-t border-gray-700">
                <div className="flex space-x-2">
                  <input 
                    type="text" 
                    placeholder="Share your prayer or encouragement..." 
                    className="flex-1 bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white placeholder-gray-400 text-sm"
                  />
                  <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Other Live Streams */}
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-white mb-6">Other Live Streams</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Morning Prayer", church: "New Hope Baptist", viewers: 234 },
              { title: "Bible Study", church: "Faith Assembly", viewers: 567 },
              { title: "Worship Night", church: "City Church", viewers: 890 },
              { title: "Youth Service", church: "Hillsong Community", viewers: 445 }
            ].map((stream, i) => (
              <div key={i} className="bg-white/5 backdrop-blur-sm rounded-lg border border-gray-700 overflow-hidden">
                <div className="aspect-video bg-gray-800 relative">
                  <img src="/images/public-relations.jpg" className="w-full h-full object-cover" alt={stream.title} />
                  <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs flex items-center">
                    <span className="w-1.5 h-1.5 bg-white rounded-full mr-1 animate-pulse"></span>
                    LIVE
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                    {stream.viewers} watching
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold text-white mb-1">{stream.title}</h3>
                  <p className="text-sm text-gray-400">{stream.church}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <AmenityFooter />
    </div>
  );
}