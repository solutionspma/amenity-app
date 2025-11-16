'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { useBackdrop } from '@/contexts/BackdropContext';
import { ProfileInitService } from '@/lib/services/profile-init';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();

  useEffect(() => {
    // Check if user is signed in
    if (typeof window !== 'undefined') {
      const signedIn = localStorage.getItem('amenity_signed_in') === 'true';
      if (signedIn) {
        // Ensure profile exists
        const email = localStorage.getItem('amenity_user_email') || 'user@amenity.church';
        const existingProfile = ProfileInitService.getCurrentProfile();
        if (!existingProfile) {
          ProfileInitService.initializeProfile('demo-user-id', email);
        }
        
        // Redirect to their profile/feed
        router.push('/profiles/me');
      } else {
        setIsChecking(false);
      }
    }
  }, [router]);

  if (isChecking) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-black to-pink-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white">Loading Amenity Platform...</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="min-h-screen relative"
      style={getBackdropStyle('homepage')}
    >
      <AmenityHeader currentPage="/" />
      


      {/* Hero Section */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
              Experience
              <span className="block text-yellow-400 dark:text-yellow-300">
                Reborn
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-4xl mx-auto leading-relaxed">
              The complete faith ecosystem. Social network, video platform, livestreaming, 
              marketplace, subscriptions, and more - all built for the modern church and creators of faith.
            </p>

            <div className="grid md:grid-cols-3 gap-8 mb-16">
              <Link href="/groups" className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all cursor-pointer transform hover:scale-105">
                <div className="text-4xl mb-4">🙏</div>
                <h3 className="text-2xl font-bold text-white mb-4">Social Ministry</h3>
                <p className="text-gray-300">Build communities, connect with your congregation, and share testimonies across all devices.</p>
              </Link>
              
              <Link href="/live" className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all cursor-pointer transform hover:scale-105">
                <div className="text-4xl mb-4">📹</div>
                <h3 className="text-2xl font-bold text-white mb-4">Wootube & Streaming</h3>
                <p className="text-gray-300">Upload sermons, go live, create shorts, and reach millions with your message.</p>
              </Link>
              
              <Link href="/marketplace" className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all cursor-pointer transform hover:scale-105">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-2xl font-bold text-white mb-4">Full Monetization</h3>
                <p className="text-gray-300">Subscriptions, donations, marketplace, ads - everything you need to fund your ministry.</p>
              </Link>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/auth/register" 
                className="bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-400 dark:hover:bg-yellow-500 text-black px-12 py-4 rounded-xl text-xl font-bold transition-all transform hover:scale-105"
              >
                Get Started Today 🚀
              </Link>
              
              <Link 
                href="/dashboard" 
                className="border-2 border-pink-500/50 text-white px-12 py-4 rounded-xl text-xl font-bold hover:bg-pink-500/20 transition-all"
              >
                For Dashboard
              </Link>
            </div>
          </div>
        </div>

        {/* Platform Features */}
        <div className="bg-black/30 py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-5xl font-bold text-center text-white mb-16">
              Complete Platform Ecosystem
            </h2>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: '👥', title: 'Groups & Communities', desc: 'Church groups, Bible studies, prayer circles', href: '/groups' },
                { icon: '💬', title: 'Real-time Messaging', desc: 'DMs, group chats, community discussions', href: '/messages' },
                { icon: '📺', title: 'Live Streaming', desc: 'Professional streaming tools with chat & donations', href: '/live' },
                { icon: '🛍️', title: 'Digital Marketplace', desc: 'Sell sermons, courses, books, merchandise', href: '/marketplace' },
                { icon: '💳', title: 'Subscriptions & Tithes', desc: 'Recurring billing, tithe management, payouts', href: '/marketplace' },
                { icon: '📊', title: 'Advanced Analytics', desc: 'Audience insights, revenue tracking, growth metrics', href: '/dashboard' },
                { icon: '🎯', title: 'Ad Network', desc: 'DSP/SSP advertising with campaign management', href: '/marketplace' },
                { icon: '⚡', title: 'Creator Tools', desc: 'Upload studio, video editor, monetization hub', href: '/dashboard' }
              ].map((feature, index) => (
                <Link key={index} href={feature.href} className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700/50 hover:border-yellow-500/50 transition-all cursor-pointer transform hover:scale-105">
                  <div className="text-3xl mb-4">{feature.icon}</div>
                  <h3 className="text-lg font-bold text-white mb-2">{feature.title}</h3>
                  <p className="text-gray-400 text-sm">{feature.desc}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h2 className="text-4xl md:text-6xl font-bold text-white mb-8">
              Ready to Transform Your Ministry?
            </h2>
            <p className="text-xl text-gray-300 mb-12">
              Join thousands of churches and leaders already using Amenity to reach more people, 
              build stronger communities, and grow their impact.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Link 
                href="/auth/register" 
                className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-10 py-4 rounded-xl text-xl font-bold hover:from-yellow-400 hover:to-orange-400 transition-all transform hover:scale-105"
              >
                Create Free Account
              </Link>
              
              <Link 
                href="/subscriptions/plans" 
                className="border-2 border-yellow-500 text-yellow-500 px-10 py-4 rounded-xl text-xl font-bold hover:bg-yellow-500 hover:text-black transition-all"
              >
                View Plans & Pricing
              </Link>
            </div>
          </div>
        </div>
        {/* Background Editor Section */}
        <div className="py-20 bg-black/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold text-white mb-8">
                🎨 Module X Mach II Design Engine
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                The most powerful faith-based design system ever created. Change backgrounds, colors, layouts - everything in real-time.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-6 text-center">🌟 Amazing Background Editor</h3>
              
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <button className="group bg-gradient-to-br from-purple-900 to-pink-900 rounded-lg p-6 border-2 border-transparent hover:border-amber-500 transition-all">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌅</div>
                    <p className="text-white font-medium">Faith Sunrise</p>
                  </div>
                </button>
                
                <button className="group bg-gradient-to-br from-blue-900 to-teal-900 rounded-lg p-6 border-2 border-transparent hover:border-amber-500 transition-all">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌊</div>
                    <p className="text-white font-medium">Divine Waters</p>
                  </div>
                </button>
                
                <button className="group bg-gradient-to-br from-amber-900 to-orange-900 rounded-lg p-6 border-2 border-transparent hover:border-amber-500 transition-all">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🔥</div>
                    <p className="text-white font-medium">Holy Fire</p>
                  </div>
                </button>
                
                <button className="group bg-gradient-to-br from-emerald-900 to-green-900 rounded-lg p-6 border-2 border-transparent hover:border-amber-500 transition-all">
                  <div className="text-center">
                    <div className="text-3xl mb-2">🌿</div>
                    <p className="text-white font-medium">Garden Grace</p>
                  </div>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-black/30 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-4">🎬 Video Backgrounds</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left text-gray-300 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
                      Flowing Worship
                    </button>
                    <button className="w-full text-left text-gray-300 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
                      Cross Silhouette
                    </button>
                    <button className="w-full text-left text-gray-300 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
                      Nature Prayer
                    </button>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-4">🖼️ Faith Images</h4>
                  <div className="space-y-2">
                    <button className="w-full text-left text-gray-300 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
                      Stained Glass
                    </button>
                    <button className="w-full text-left text-gray-300 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
                      Mountain Vista
                    </button>
                    <button className="w-full text-left text-gray-300 hover:text-white p-2 rounded hover:bg-white/10 transition-colors">
                      Peaceful Garden
                    </button>
                  </div>
                </div>

                <div className="bg-black/30 rounded-lg p-6">
                  <h4 className="text-white font-semibold mb-4">🎨 Gradient Controls</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Primary Color</label>
                      <input type="color" value="#7c3aed" className="w-full h-10 rounded border border-gray-600" />
                    </div>
                    <div>
                      <label className="block text-gray-400 text-sm mb-1">Secondary Color</label>
                      <input type="color" value="#1e3a8a" className="w-full h-10 rounded border border-gray-600" />
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>
        </div>
      </main>

      <AmenityFooter />
    </div>
  );
}