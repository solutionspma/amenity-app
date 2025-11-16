'use client';

import Link from 'next/link';
import { useState } from 'react';
import SmartLogo from '@/components/SmartLogo';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

export default function MarketplacePage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const { getBackdropStyle } = useBackdrop();

  const categories = [
    { id: 'all', name: 'All Items', icon: '🛒' },
    { id: 'sermons', name: 'Sermons & Teachings', icon: '🎯' },
    { id: 'books', name: 'Christian Books', icon: '📚' },
    { id: 'music', name: 'Worship Music', icon: '🎵' },
    { id: 'courses', name: 'Online Courses', icon: '🎓' },
    { id: 'events', name: 'Events & Conferences', icon: '🎪' },
    { id: 'merchandise', name: 'Church Merch', icon: '👕' },
    { id: 'services', name: 'Ministry Services', icon: '🤝' }
  ];

  const products = [
    {
      id: 1,
      title: "Complete Sermon Series: Faith Over Fear",
      price: 29.99,
      seller: "Pastor Marcus Johnson",
      image: "/images/team-meeting.jpg",
      category: "sermons",
      rating: 4.9,
      sales: 2847
    },
    {
      id: 2,
      title: "Worship Leading Masterclass",
      price: 49.99,
      seller: "Grace Community Church",
      image: "/images/marketing-strategy.jpg",
      category: "courses",
      rating: 4.8,
      sales: 1456
    },
    {
      id: 3,
      title: "Christian Leadership Book Bundle",
      price: 19.99,
      seller: "Faith Publishing House",
      image: "/images/digital-marketing.jpg",
      category: "books",
      rating: 4.7,
      sales: 987
    },
    {
      id: 4,
      title: "Youth Ministry Conference 2025",
      price: 89.99,
      seller: "National Youth Network",
      image: "/images/analytics-dashboard.jpg",
      category: "events",
      rating: 5.0,
      sales: 543
    }
  ];

  return (
    <div className="min-h-screen" style={getBackdropStyle('marketplace')}>
      <AmenityHeader currentPage="/marketplace" />
      
      {/* Marketplace Header */}
      <div className="bg-amber-600/20 border-b border-amber-500/30 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-white">🛒 Amenity Marketplace</h1>
              <p className="text-amber-200 text-sm">Discover digital resources for your ministry</p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:from-amber-600 hover:to-orange-700 transition-all">
                💰 Start Selling
              </button>
              <div className="relative">
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">3</span>
                <button className="text-gray-300 hover:text-white text-2xl">🛒</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Faith-Based Marketplace</h1>
          <p className="text-lg text-gray-300">Discover sermons, courses, books, and ministry resources from creators worldwide</p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <input 
                type="text" 
                placeholder="Search for sermons, courses, books..." 
                className="w-full bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400"
              />
            </div>
            <div className="flex gap-2">
              <select className="bg-gray-800 border border-gray-600 rounded-lg px-4 py-3 text-white">
                <option>All Prices</option>
                <option>Free</option>
                <option>Under $25</option>
                <option>$25 - $50</option>
                <option>Over $50</option>
              </select>
              <button className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-6 py-3 rounded-lg font-medium">
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-8">
          {/* Categories Sidebar */}
          <div className="col-span-3">
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700 p-6">
              <h3 className="text-lg font-semibold text-white mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full text-left flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                      activeCategory === category.id 
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' 
                        : 'text-gray-300 hover:bg-white/10 hover:text-white'
                    }`}
                  >
                    <span className="text-lg">{category.icon}</span>
                    <span className="text-sm">{category.name}</span>
                  </button>
                ))}
              </div>

              {/* Featured Seller */}
              <div className="mt-8 p-4 bg-gradient-to-r from-purple-900 to-indigo-900 rounded-lg border border-purple-500/30">
                <h4 className="text-sm font-semibold text-white mb-2">⭐ Featured Seller</h4>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-amber-500 rounded-full"></div>
                  <div>
                    <p className="text-xs text-white font-medium">Pastor Marcus Johnson</p>
                    <p className="text-xs text-purple-200">2.8K sales • 4.9 ⭐</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="col-span-9">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">
                {activeCategory === 'all' ? 'All Products' : categories.find(c => c.id === activeCategory)?.name}
              </h3>
              <select className="bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm">
                <option>Sort by: Best Selling</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest First</option>
                <option>Highest Rated</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product.id} className="bg-white/5 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden hover:border-amber-500/50 transition-all group">
                  <div className="aspect-video bg-gray-800 relative overflow-hidden">
                    <img src={product.image} alt={product.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    <div className="absolute top-2 left-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                      {categories.find(c => c.id === product.category)?.icon} {categories.find(c => c.id === product.category)?.name}
                    </div>
                    <div className="absolute top-2 right-2 bg-amber-500 text-white px-2 py-1 rounded font-bold text-sm">
                      ${product.price}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <h4 className="font-semibold text-white mb-2 group-hover:text-amber-300 transition-colors">
                      {product.title}
                    </h4>
                    <p className="text-sm text-gray-400 mb-3">by {product.seller}</p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-1">
                        <span className="text-amber-400">⭐</span>
                        <span className="text-sm text-white">{product.rating}</span>
                        <span className="text-xs text-gray-400">({product.sales} sales)</span>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <button className="flex-1 bg-gradient-to-r from-amber-500 to-orange-600 text-white py-2 rounded-lg text-sm font-medium hover:from-amber-600 hover:to-orange-700 transition-all">
                        Add to Cart
                      </button>
                      <button className="p-2 border border-gray-600 text-gray-400 rounded-lg hover:text-white hover:border-gray-500">
                        ❤️
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More */}
            <div className="text-center mt-12">
              <button className="bg-white/10 backdrop-blur-sm border border-gray-700 text-white px-8 py-3 rounded-lg hover:bg-white/20 transition-colors">
                Load More Products
              </button>
            </div>
          </div>
        </div>

        {/* Seller Tools CTA */}
        <div className="mt-16 bg-gradient-to-r from-amber-900 to-orange-900 rounded-2xl border border-amber-500/30 p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Start Selling Your Ministry Resources</h3>
          <p className="text-amber-100 mb-6 max-w-2xl mx-auto">
            Join thousands of pastors, teachers, and ministry leaders earning from their digital content on Amenity Marketplace.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-amber-900 px-8 py-3 rounded-lg font-bold hover:bg-gray-100 transition-colors">
              Become a Seller
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-lg font-bold hover:bg-white/10 transition-colors">
              Learn More
            </button>
          </div>
        </div>
      </div>
      
      <AmenityFooter />
    </div>
  );
}