'use client';

import { useState } from 'react';
import {
  CurrencyDollarIcon,
  ShoppingBagIcon,
  CreditCardIcon,
  GiftIcon,
  TrophyIcon,
  StarIcon,
  BoltIcon,
  SparklesIcon
} from '@heroicons/react/24/outline';

interface MonetizationFeature {
  id: string;
  title: string;
  description: string;
  revenue_share: string;
  status: 'active' | 'coming_soon' | 'beta';
  icon: React.ComponentType<any>;
}

export default function MonetizationHub() {
  const [activeFeature, setActiveFeature] = useState('subscriptions');

  const monetizationFeatures: MonetizationFeature[] = [
    {
      id: 'subscriptions',
      title: 'Subscription Tiers',
      description: 'Multiple subscription levels with exclusive content access',
      revenue_share: '90%',
      status: 'active',
      icon: StarIcon
    },
    {
      id: 'tips',
      title: 'Tips & Donations',
      description: 'Direct fan support with custom amounts and messages',
      revenue_share: '85%',
      status: 'active',
      icon: GiftIcon
    },
    {
      id: 'pay_per_view',
      title: 'Pay-Per-View Events',
      description: 'Premium live streams and exclusive content',
      revenue_share: '88%',
      status: 'active',
      icon: BoltIcon
    },
    {
      id: 'merchandise',
      title: 'Merchandise Store',
      description: 'Integrated e-commerce with print-on-demand',
      revenue_share: '75%',
      status: 'active',
      icon: ShoppingBagIcon
    },
    {
      id: 'nft_marketplace',
      title: 'NFT Marketplace',
      description: 'Create and sell digital collectibles',
      revenue_share: '95%',
      status: 'beta',
      icon: SparklesIcon
    },
    {
      id: 'crypto_payments',
      title: 'Crypto Payments',
      description: 'Accept Bitcoin, Ethereum, and other cryptocurrencies',
      revenue_share: '92%',
      status: 'coming_soon',
      icon: CreditCardIcon
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700';
      case 'beta':
        return 'bg-yellow-100 text-yellow-700';
      case 'coming_soon':
        return 'bg-purple-100 text-purple-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active':
        return 'LIVE';
      case 'beta':
        return 'BETA';
      case 'coming_soon':
        return 'SOON';
      default:
        return status.toUpperCase();
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center py-8">
        <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6">
          <CurrencyDollarIcon className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Monetization Hub</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          The most generous creator revenue sharing in the industry. 
          Multiple income streams, advanced analytics, and industry-leading payouts.
        </p>
      </div>

      {/* Revenue Share Highlight */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 rounded-2xl p-8 text-white text-center mb-8">
        <h2 className="text-3xl font-bold mb-2">Up to 95% Revenue Share</h2>
        <p className="text-green-100 mb-6 text-lg">
          Keep more of what you earn. Amenity takes only 5-15% compared to competitors' 30-50%.
        </p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4">
            <h3 className="font-semibold">Amenity</h3>
            <p className="text-2xl font-bold">85-95%</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <h3 className="font-semibold">YouTube</h3>
            <p className="text-xl opacity-75">55%</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <h3 className="font-semibold">TikTok</h3>
            <p className="text-xl opacity-75">50%</p>
          </div>
          <div className="bg-white bg-opacity-10 rounded-lg p-4">
            <h3 className="font-semibold">Patreon</h3>
            <p className="text-xl opacity-75">85%</p>
          </div>
        </div>
      </div>

      {/* Monetization Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {monetizationFeatures.map((feature) => (
          <div 
            key={feature.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-lg transition-all cursor-pointer"
            onClick={() => setActiveFeature(feature.id)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(feature.status)}`}>
                {getStatusText(feature.status)}
              </span>
            </div>

            <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm mb-4">{feature.description}</p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-500">Revenue Share</p>
                <p className="text-2xl font-bold text-green-600">{feature.revenue_share}</p>
              </div>
              
              {feature.status === 'active' ? (
                <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors text-sm">
                  Setup Now
                </button>
              ) : feature.status === 'beta' ? (
                <button className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors text-sm">
                  Join Beta
                </button>
              ) : (
                <button className="bg-gray-300 text-gray-600 px-4 py-2 rounded-lg cursor-not-allowed text-sm">
                  Coming Soon
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Feature Spotlight */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured: NFT Marketplace (Beta)</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Create Digital Collectibles</h3>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <SparklesIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Exclusive Content NFTs</p>
                  <p className="text-sm text-gray-600">Turn your best content into collectible NFTs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <TrophyIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Fan Rewards</p>
                  <p className="text-sm text-gray-600">Reward loyal fans with special edition NFTs</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <CurrencyDollarIcon className="w-5 h-5 text-purple-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-gray-900">Royalty System</p>
                  <p className="text-sm text-gray-600">Earn ongoing royalties on secondary sales</p>
                </div>
              </div>
            </div>
            
            <button className="mt-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-lg hover:from-purple-700 hover:to-pink-700 transition-all">
              Join NFT Beta
            </button>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-6">
            <h4 className="font-medium text-gray-900 mb-4">Beta Features Include:</h4>
            <ul className="space-y-2 text-sm text-gray-700">
              <li>• Easy NFT minting with one-click</li>
              <li>• Integrated marketplace with Amenity audience</li>
              <li>• 95% revenue share (industry highest)</li>
              <li>• Multi-chain support (Ethereum, Polygon)</li>
              <li>• Built-in promotion tools</li>
              <li>• Analytics and sales tracking</li>
            </ul>
            
            <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Early Access:</strong> Beta participants get lifetime 95% revenue share rate!
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Ministry-Specific Monetization */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-blue-900 mb-4">Ministry-Focused Features</h2>
        <p className="text-blue-700 mb-6">
          Special tools designed for faith-based creators and ministry organizations
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Tithe Management</h3>
            <p className="text-sm text-gray-600 mb-3">
              Built-in tithing system with automatic receipts and reporting
            </p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">90% Revenue Share</span>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Mission Support</h3>
            <p className="text-sm text-gray-600 mb-3">
              Dedicated fundraising tools for mission trips and projects
            </p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">95% Revenue Share</span>
          </div>
          
          <div className="bg-white rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Event Ticketing</h3>
            <p className="text-sm text-gray-600 mb-3">
              Sell tickets for conferences, retreats, and special events
            </p>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full">88% Revenue Share</span>
          </div>
        </div>
      </div>

      {/* Payout Information */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Fast & Reliable Payouts</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <BoltIcon className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Instant Payouts</h3>
            <p className="text-sm text-gray-600">Available 24/7</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <CreditCardIcon className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Multiple Methods</h3>
            <p className="text-sm text-gray-600">Bank, PayPal, Crypto</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <ShoppingBagIcon className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900">Low Minimums</h3>
            <p className="text-sm text-gray-600">$10 minimum payout</p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <TrophyIcon className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-semibold text-gray-900">No Hidden Fees</h3>
            <p className="text-sm text-gray-600">What you see is what you get</p>
          </div>
        </div>
      </div>
    </div>
  );
}