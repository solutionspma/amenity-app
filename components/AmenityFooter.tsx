'use client';

import Link from 'next/link';

interface AmenityFooterProps {
  className?: string;
}

export default function AmenityFooter({ className = "" }: AmenityFooterProps) {
  return (
    <footer className={`bg-black/90 backdrop-blur-sm border-t border-gray-800 ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">
              <img src="/logos/amenity-logo-white.svg" alt="Amenity" className="h-8 w-auto inline-block" />
            </h3>
            <p className="text-gray-400">
              The complete faith platform for the modern church.
            </p>
            <div className="flex space-x-4 mt-4">
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                📘
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                🐦
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                📷
              </Link>
              <Link href="#" className="text-gray-400 hover:text-white transition-colors">
                📺
              </Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Platform</h4>
            <div className="space-y-2">
              <Link href="/feed" className="block text-gray-400 hover:text-white transition-colors">Feed</Link>
              <Link href="/groups" className="block text-gray-400 hover:text-white transition-colors">Groups</Link>
              <Link href="/live" className="block text-gray-400 hover:text-white transition-colors">Live Streaming</Link>
              <Link href="/marketplace" className="block text-gray-400 hover:text-white transition-colors">Marketplace</Link>
              <Link href="/messages" className="block text-gray-400 hover:text-white transition-colors">Messages</Link>
              <Link href="/shorts" className="block text-gray-400 hover:text-white transition-colors">Shorts</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Creator Tools</h4>
                <Link href="/svg-ya" className="block text-gray-400 hover:text-white transition-colors">SVG-YA Converter</Link>
            <div className="space-y-2">
              <Link href="/dashboard" className="block text-gray-400 hover:text-white transition-colors">Creator Dashboard</Link>
              <Link href="/creator/analytics" className="block text-gray-400 hover:text-white transition-colors">Analytics</Link>
              <Link href="/creator/monetization" className="block text-gray-400 hover:text-white transition-colors">Monetization</Link>
              <Link href="/ads/campaigns" className="block text-gray-400 hover:text-white transition-colors">Ad Manager</Link>
            </div>
          </div>
          
          <div>
            <h4 className="text-white font-semibold mb-4">Support</h4>
            <div className="space-y-2">
              <Link href="/help" className="block text-gray-400 hover:text-white transition-colors">Help Center</Link>
              <Link href="/contact" className="block text-gray-400 hover:text-white transition-colors">Contact</Link>
              <Link href="/privacy" className="block text-gray-400 hover:text-white transition-colors">Privacy</Link>
              <Link href="/terms" className="block text-gray-400 hover:text-white transition-colors">Terms</Link>
              <Link href="/admin/master-control" className="block text-gray-400 hover:text-purple-400 transition-colors">Admin</Link>
            </div>
          </div>
        </div>
        
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
          <p>&copy; 2025 Amenity Platform. Built for faith communities worldwide.</p>
          <p className="text-sm mt-2">
            🙏 Spreading faith through technology • 
            <Link href="/admin/visual-editor" className="text-purple-400 hover:text-purple-300 ml-1">
              Module X Mark II Editor
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}