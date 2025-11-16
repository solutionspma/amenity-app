'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-purple-900">
      {/* Navigation */}
      <nav className="bg-black/50 backdrop-blur-sm border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                ✨ Amenity
              </h1>
              <span className="text-gray-400">|</span>
              <span className="text-white font-medium">The Faith Platform</span>
            </div>
            <div className="flex items-center space-x-4">
              {!isAuthenticated ? (
                <>
                  <Link 
                    href="/auth/login" 
                    className="text-white hover:text-yellow-400 transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link 
                    href="/auth/register" 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-2 rounded-lg font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all"
                  >
                    Join Now
                  </Link>
                </>
              ) : (
                <Link 
                  href="/feed" 
                  className="bg-gradient-to-r from-yellow-500 to-orange-500 text-black px-6 py-2 rounded-lg font-semibold hover:from-yellow-400 hover:to-orange-400 transition-all"
                >
                  Enter Platform
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px', display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '32px' }}>
        
        {/* Main Feed Column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Stories Section */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.25rem' }}>📖 Stories</h2>
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto' }}>
              {['Your Story', 'Pastor John', 'Youth Group', 'Worship Team', 'Bible Study'].map((name, i) => (
                <div key={i} style={{
                  minWidth: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: `linear-gradient(45deg, #ff6b6b, #4ecdc4)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  fontSize: '0.875rem',
                  textAlign: 'center',
                  cursor: 'pointer',
                  border: '3px solid white'
                }}>
                  {name.split(' ')[0]}
                </div>
              ))}
            </div>
          </div>

          {/* Create Post */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.25rem' }}>✍️ Create Post</h2>
            <textarea 
              placeholder="Share your faith journey, prayer requests, or encouraging words..."
              style={{
                width: '100%',
                minHeight: '80px',
                background: 'rgba(255,255,255,0.1)',
                border: '1px solid rgba(255,255,255,0.3)',
                borderRadius: '8px',
                padding: '12px',
                color: 'white',
                resize: 'vertical'
              }}
            />
            <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>📷</button>
                <button style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>🎥</button>
                <button style={{ color: 'white', background: 'none', border: 'none', cursor: 'pointer' }}>🙏</button>
              </div>
              <button style={{
                background: 'white',
                color: '#667eea',
                padding: '8px 16px',
                borderRadius: '8px',
                border: 'none',
                fontWeight: '600',
                cursor: 'pointer'
              }}>
                Post
              </button>
            </div>
          </div>

          {/* Live Streams */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.25rem' }}>🔴 Live Now</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              {['Sunday Service', 'Bible Study', 'Youth Prayer'].map((stream, i) => (
                <div key={i} style={{
                  background: 'rgba(255,255,255,0.1)',
                  borderRadius: '8px',
                  padding: '12px',
                  textAlign: 'center',
                  cursor: 'pointer'
                }}>
                  <div style={{ color: 'white', fontWeight: '600' }}>{stream}</div>
                  <div style={{ color: '#e9d5ff', fontSize: '0.875rem' }}>🔴 Live • {Math.floor(Math.random() * 500) + 100} viewers</div>
                </div>
              ))}
            </div>
          </div>

          {/* Feed Posts */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ color: 'white', marginBottom: '16px', fontSize: '1.25rem' }}>📱 Community Feed</h2>
            {['Prayer Request: Please pray for my family', 'Blessed Sunday service today! 🙏', 'Bible verse of the day: John 3:16'].map((post, i) => (
              <div key={i} style={{
                background: 'rgba(255,255,255,0.1)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '12px'
              }}>
                <div style={{ color: 'white', marginBottom: '8px' }}>{post}</div>
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.875rem', color: '#e9d5ff' }}>
                  <span>👍 Like</span>
                  <span>💬 Comment</span>
                  <span>🙏 Prayer</span>
                  <span>📤 Share</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* AI Assistant */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '1.125rem' }}>🤖 JAY-I Assistant</h3>
            <p style={{ color: '#e9d5ff', fontSize: '0.875rem', marginBottom: '12px' }}>
              Your AI spiritual guide and content creator
            </p>
            <button style={{
              background: 'white',
              color: '#667eea',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%'
            }}>
              Ask JAY-I
            </button>
          </div>

          {/* Monetization Hub */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '1.125rem' }}>💰 Creator Hub</h3>
            <div style={{ color: '#e9d5ff', fontSize: '0.875rem', marginBottom: '12px' }}>
              <div>Monthly earnings: $2,450</div>
              <div>Revenue share: 85%</div>
            </div>
            <button style={{
              background: 'white',
              color: '#667eea',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              fontWeight: '600',
              cursor: 'pointer',
              width: '100%'
            }}>
              View Analytics
            </button>
          </div>

          {/* Suggested Connections */}
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            backdropFilter: 'blur(10px)',
            borderRadius: '16px',
            padding: '20px',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ color: 'white', marginBottom: '12px', fontSize: '1.125rem' }}>👥 Connect</h3>
            {['Grace Baptist Church', 'Christian Creators Hub', 'Youth Ministry Network'].map((suggestion, i) => (
              <div key={i} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '8px',
                color: '#e9d5ff',
                fontSize: '0.875rem'
              }}>
                <span>{suggestion}</span>
                <button style={{
                  background: 'white',
                  color: '#667eea',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  border: 'none',
                  fontSize: '0.75rem',
                  cursor: 'pointer'
                }}>
                  Follow
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}