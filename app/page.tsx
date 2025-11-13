'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Feed from '@/components/Feed';
import Stories from '@/components/Stories';
import SidebarSuggestions from '@/components/SidebarSuggestions';
import CreatePost from '@/components/CreatePost';
import LiveStreams from '@/components/LiveStreams';
import { useAmenity } from '@/contexts/AmenityContext';

export default function HomePage() {
  const { user } = useAmenity();

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Main Feed */}
        <div className="lg:col-span-8">
          {/* Stories Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6"
          >
            <Stories />
          </motion.div>

          {/* Live Streams */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <LiveStreams />
          </motion.div>

          {/* Create Post */}
          {user && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mb-6"
            >
              <CreatePost />
            </motion.div>
          )}

          {/* Main Feed */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Feed />
          </motion.div>
        </div>

        {/* Sidebar */}
        <div className="hidden lg:block lg:col-span-4">
          <div className="sticky top-6 space-y-6">
            <SidebarSuggestions />
          </div>
        </div>
      </div>
    </div>
  );
}