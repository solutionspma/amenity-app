'use client';

import Link from 'next/link';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { useBackdrop } from '@/contexts/BackdropContext';

export default function HelpPage() {
  const { getBackdropStyle } = useBackdrop();

  const helpCategories = [
    {
      title: 'Getting Started',
      icon: '🚀',
      articles: [
        { title: 'Creating Your Profile', href: '/help/profile-setup' },
        { title: 'Joining Your First Group', href: '/help/joining-groups' },
        { title: 'Understanding the Feed', href: '/help/using-feed' },
        { title: 'Privacy & Safety Settings', href: '/help/privacy' }
      ]
    },
    {
      title: 'Creating Content',
      icon: '📝',
      articles: [
        { title: 'Posting Updates', href: '/help/posting' },
        { title: 'Going Live', href: '/help/live-streaming' },
        { title: 'Creating Shorts', href: '/help/shorts' },
        { title: 'Photo & Video Tips', href: '/help/media-tips' }
      ]
    },
    {
      title: 'Groups & Communities',
      icon: '👥',
      articles: [
        { title: 'Creating a Group', href: '/help/create-group' },
        { title: 'Managing Group Members', href: '/help/group-management' },
        { title: 'Group Events & Activities', href: '/help/group-events' },
        { title: 'Private vs Public Groups', href: '/help/group-privacy' }
      ]
    },
    {
      title: 'Messaging',
      icon: '💬',
      articles: [
        { title: 'Sending Messages', href: '/help/messaging' },
        { title: 'Group Chat Features', href: '/help/group-chat' },
        { title: 'Message Privacy', href: '/help/message-privacy' },
        { title: 'Blocking & Reporting', href: '/help/blocking' }
      ]
    },
    {
      title: 'Creator Tools',
      icon: '🎨',
      articles: [
        { title: 'Creator Dashboard', href: '/help/creator-dashboard' },
        { title: 'Analytics & Insights', href: '/help/analytics' },
        { title: 'Monetization Options', href: '/help/monetization' },
        { title: 'SVG-YA Converter', href: '/help/svg-converter' }
      ]
    },
    {
      title: 'Account & Settings',
      icon: '⚙️',
      articles: [
        { title: 'Account Settings', href: '/help/account-settings' },
        { title: 'Notification Preferences', href: '/help/notifications' },
        { title: 'Password & Security', href: '/help/security' },
        { title: 'Deleting Your Account', href: '/help/delete-account' }
      ]
    }
  ];

  const quickActions = [
    {
      title: 'Contact Support',
      description: 'Get help from our support team',
      href: '/contact',
      icon: '📧',
      color: 'from-blue-500 to-blue-600'
    },
    {
      title: 'Community Forum',
      description: 'Ask questions and get answers from other users',
      href: '/help/forum',
      icon: '💭',
      color: 'from-green-500 to-green-600'
    },
    {
      title: 'Video Tutorials',
      description: 'Watch step-by-step guides',
      href: '/help/videos',
      icon: '🎥',
      color: 'from-purple-500 to-purple-600'
    },
    {
      title: 'Report Issue',
      description: 'Report bugs or technical issues',
      href: '/help/report',
      icon: '🐛',
      color: 'from-red-500 to-red-600'
    }
  ];

  return (
    <div className="min-h-screen" style={getBackdropStyle('help')}>
      <AmenityHeader currentPage="/help" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Help Center</h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Find answers, get support, and learn how to make the most of Amenity
          </p>
        </div>

        {/* Search */}
        <div className="max-w-2xl mx-auto mb-12">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for help articles..."
              className="w-full px-6 py-4 text-lg rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
            />
            <button className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {quickActions.map((action) => (
            <Link
              key={action.title}
              href={action.href}
              className="group"
            >
              <div className={`bg-gradient-to-r ${action.color} p-6 rounded-xl text-white hover:scale-105 transition-transform`}>
                <div className="text-3xl mb-3">{action.icon}</div>
                <h3 className="font-bold text-lg mb-2">{action.title}</h3>
                <p className="text-sm opacity-90">{action.description}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Help Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {helpCategories.map((category) => (
            <div
              key={category.title}
              className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/15 transition-all"
            >
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">{category.icon}</span>
                <h3 className="text-xl font-bold text-white">{category.title}</h3>
              </div>
              
              <div className="space-y-2">
                {category.articles.map((article) => (
                  <Link
                    key={article.title}
                    href={article.href}
                    className="block text-gray-300 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all"
                  >
                    • {article.title}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Popular Articles */}
        <div className="mt-12 bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-8">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
            <span className="mr-3">🔥</span>
            Popular Articles
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/help/profile-setup" className="flex items-center space-x-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-all">
              <span className="text-2xl">👤</span>
              <div>
                <div className="font-medium">Setting up your profile</div>
                <div className="text-sm text-gray-400">Complete guide to creating your profile</div>
              </div>
            </Link>
            
            <Link href="/help/joining-groups" className="flex items-center space-x-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-all">
              <span className="text-2xl">👥</span>
              <div>
                <div className="font-medium">Joining your first group</div>
                <div className="text-sm text-gray-400">How to find and join communities</div>
              </div>
            </Link>
            
            <Link href="/help/live-streaming" className="flex items-center space-x-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-all">
              <span className="text-2xl">📹</span>
              <div>
                <div className="font-medium">Going live</div>
                <div className="text-sm text-gray-400">Start your first live stream</div>
              </div>
            </Link>
            
            <Link href="/help/privacy" className="flex items-center space-x-3 text-gray-300 hover:text-white p-3 rounded-lg hover:bg-white/10 transition-all">
              <span className="text-2xl">🔒</span>
              <div>
                <div className="font-medium">Privacy & Safety</div>
                <div className="text-sm text-gray-400">Protecting your information</div>
              </div>
            </Link>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Still need help?</h2>
          <p className="text-gray-300 mb-6">
            Our support team is here to help you with any questions
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-8 py-3 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              📧 Contact Support
            </Link>
            <Link
              href="/help/forum"
              className="bg-white/10 backdrop-blur-sm border border-white/20 text-white px-8 py-3 rounded-lg font-medium hover:bg-white/20 transition-all"
            >
              💭 Community Forum
            </Link>
          </div>
        </div>
      </div>

      <AmenityFooter />
    </div>
  );
}