'use client';

import React from 'react';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800">
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
            🙏 Amenity Platform
          </h1>
          <p className="text-xl md:text-2xl text-purple-100 mb-8 max-w-3xl mx-auto">
            The Ultimate Faith-Based Social Platform<br />
            Combining the best of social media with spiritual community
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📱</div>
            <h3 className="text-xl font-semibold text-white mb-3">Social Feed</h3>
            <p className="text-purple-100">Connect with your faith community through posts, stories, and live streams</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🤖</div>
            <h3 className="text-xl font-semibold text-white mb-3">AI Assistant</h3>
            <p className="text-purple-100">JAY-I helps with spiritual guidance and content creation</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">💰</div>
            <h3 className="text-xl font-semibold text-white mb-3">Monetization</h3>
            <p className="text-purple-100">80-90% revenue share for creators through tips, subscriptions & more</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">🎥</div>
            <h3 className="text-xl font-semibold text-white mb-3">Live Streaming</h3>
            <p className="text-purple-100">Broadcast sermons, Bible studies, and faith-based content</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">📊</div>
            <h3 className="text-xl font-semibold text-white mb-3">Analytics</h3>
            <p className="text-purple-100">Advanced insights to grow your ministry and reach</p>
          </div>

          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <div className="text-4xl mb-4">⛪</div>
            <h3 className="text-xl font-semibold text-white mb-3">Faith Community</h3>
            <p className="text-purple-100">Built specifically for churches, ministries, and believers</p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button className="bg-white text-purple-700 px-8 py-4 rounded-full text-lg font-semibold hover:bg-purple-50 transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            Join the Faith Community 🚀
          </button>
        </div>
      </div>
    </div>
  );
}