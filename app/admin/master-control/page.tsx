'use client';

import { useBackdrop } from '@/contexts/BackdropContext';
import AuthWrapper from '@/components/AuthWrapper';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import Link from 'next/link';

export default function MasterControlPage() {
  const { getBackdropStyle } = useBackdrop();

  return (
    <AuthWrapper requireAdmin={true}>
      <div className="min-h-screen" style={getBackdropStyle('admin')}>
        <AmenityHeader currentPage="/admin/master-control" />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">🏎️ Master Control</h1>
            <p className="text-gray-300 text-lg">
              Complete platform administration and management dashboard
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* User Management */}
            <Link href="/admin/users" className="bg-gradient-to-br from-blue-900/50 to-blue-800/50 p-6 rounded-2xl border border-blue-700/50 hover:border-blue-500/50 transition-all cursor-pointer transform hover:scale-105">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">👥</span>
                <h3 className="text-xl font-bold text-white">User Management</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Manage users, roles, permissions, and account verification
              </p>
              <div className="text-blue-400 text-sm font-medium">→ Manage Users</div>
            </Link>

            {/* Content Moderation */}
            <Link href="/admin/moderation" className="bg-gradient-to-br from-red-900/50 to-red-800/50 p-6 rounded-2xl border border-red-700/50 hover:border-red-500/50 transition-all cursor-pointer transform hover:scale-105">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🛡️</span>
                <h3 className="text-xl font-bold text-white">Content Moderation</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Review reported content, manage community guidelines
              </p>
              <div className="text-red-400 text-sm font-medium">→ Review Content</div>
            </Link>

            {/* Visual Editor */}
            <Link href="/admin/visual-editor" className="bg-gradient-to-br from-purple-900/50 to-purple-800/50 p-6 rounded-2xl border border-purple-700/50 hover:border-purple-500/50 transition-all cursor-pointer transform hover:scale-105">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🎨</span>
                <h3 className="text-xl font-bold text-white">Visual Editor</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Platform-wide design control and theme management
              </p>
              <div className="text-purple-400 text-sm font-medium">→ Design Platform</div>
            </Link>

            {/* Analytics */}
            <Link href="/admin/analytics" className="bg-gradient-to-br from-green-900/50 to-green-800/50 p-6 rounded-2xl border border-green-700/50 hover:border-green-500/50 transition-all cursor-pointer transform hover:scale-105">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">📊</span>
                <h3 className="text-xl font-bold text-white">Platform Analytics</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                User engagement, revenue metrics, growth insights
              </p>
              <div className="text-green-400 text-sm font-medium">→ View Analytics</div>
            </Link>

            {/* Payments & Revenue */}
            <Link href="/admin/payments" className="bg-gradient-to-br from-yellow-900/50 to-yellow-800/50 p-6 rounded-2xl border border-yellow-700/50 hover:border-yellow-500/50 transition-all cursor-pointer transform hover:scale-105">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">💰</span>
                <h3 className="text-xl font-bold text-white">Payments & Revenue</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                Financial oversight, payouts, subscription management
              </p>
              <div className="text-yellow-400 text-sm font-medium">→ Manage Payments</div>
            </Link>

            {/* Database Status */}
            <Link href="/admin/database-status" className="bg-gradient-to-br from-indigo-900/50 to-indigo-800/50 p-6 rounded-2xl border border-indigo-700/50 hover:border-indigo-500/50 transition-all cursor-pointer transform hover:scale-105">
              <div className="flex items-center mb-4">
                <span className="text-3xl mr-3">🗄️</span>
                <h3 className="text-xl font-bold text-white">Database Status</h3>
              </div>
              <p className="text-gray-300 text-sm mb-3">
                System health, performance monitoring, backups
              </p>
              <div className="text-indigo-400 text-sm font-medium">→ Check Status</div>
            </Link>
          </div>

          {/* Quick Actions */}
          <div className="mt-12 bg-black/30 rounded-2xl p-8 border border-gray-700">
            <h2 className="text-2xl font-bold text-white mb-6">Quick Actions</h2>
            <div className="grid md:grid-cols-3 gap-4">
              <button className="bg-gradient-to-r from-red-600 to-red-700 text-white p-4 rounded-lg font-semibold hover:from-red-700 hover:to-red-800 transition-all">
                🚨 Emergency Mode
              </button>
              <button className="bg-gradient-to-r from-orange-600 to-orange-700 text-white p-4 rounded-lg font-semibold hover:from-orange-700 hover:to-orange-800 transition-all">
                📢 Send Platform Alert
              </button>
              <button className="bg-gradient-to-r from-green-600 to-green-700 text-white p-4 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all">
                🔄 Refresh Cache
              </button>
            </div>
          </div>

          {/* System Info */}
          <div className="mt-8 grid md:grid-cols-3 gap-6">
            <div className="bg-black/20 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">System Health</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-400">Server Status</span>
                  <span className="text-green-400">🟢 Online</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Database</span>
                  <span className="text-green-400">🟢 Connected</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">CDN</span>
                  <span className="text-green-400">🟢 Active</span>
                </div>
              </div>
            </div>

            <div className="bg-black/20 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">Active Users</h3>
              <div className="text-3xl font-bold text-yellow-400">1,247</div>
              <div className="text-sm text-gray-400">+12% from yesterday</div>
            </div>

            <div className="bg-black/20 rounded-xl p-6 border border-gray-700">
              <h3 className="text-lg font-bold text-white mb-3">Revenue Today</h3>
              <div className="text-3xl font-bold text-green-400">$4,892</div>
              <div className="text-sm text-gray-400">+8% from yesterday</div>
            </div>
          </div>
        </main>

        <AmenityFooter />
      </div>
    </AuthWrapper>
  );
}