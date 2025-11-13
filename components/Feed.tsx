'use client';

import { useState, useEffect } from 'react';
import { HeartIcon, ChatBubbleOvalLeftIcon, ShareIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface Post {
  id: string;
  username: string;
  avatar: string;
  content: string;
  image?: string;
  video?: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
}

export default function Feed() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Mock data for the feed
    const mockPosts: Post[] = [
      {
        id: '1',
        username: 'creator_one',
        avatar: '/api/placeholder/40/40',
        content: '🚀 Just launched my new series on Amenity! The creator revenue share here is amazing - 80-90%! #CreatorEconomy #Amenity',
        image: '/api/placeholder/600/400',
        likes: 234,
        comments: 45,
        shares: 12,
        timestamp: '2 hours ago'
      },
      {
        id: '2',
        username: 'ministry_leader',
        avatar: '/api/placeholder/40/40',
        content: 'Blessed to be using Amenity for our ministry content. The built-in tithe system makes it so easy for our congregation to support our work! 🙏',
        likes: 567,
        comments: 89,
        shares: 34,
        timestamp: '4 hours ago'
      },
      {
        id: '3',
        username: 'tech_creator',
        avatar: '/api/placeholder/40/40',
        content: 'JAY-I AI assistant just helped me optimize my content strategy and I gained 2K new followers this week! This platform is revolutionary 🤖✨',
        video: '/api/placeholder/600/400',
        likes: 890,
        comments: 156,
        shares: 67,
        timestamp: '6 hours ago'
      }
    ];

    setPosts(mockPosts);
  }, []);

  const toggleLike = (postId: string) => {
    const newLikedPosts = new Set(likedPosts);
    if (likedPosts.has(postId)) {
      newLikedPosts.delete(postId);
    } else {
      newLikedPosts.add(postId);
    }
    setLikedPosts(newLikedPosts);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {posts.map((post) => (
        <div key={post.id} className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
          {/* Post Header */}
          <div className="p-4 flex items-center space-x-3">
            <img
              src={post.avatar}
              alt={post.username}
              className="w-10 h-10 rounded-full bg-gray-300"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">@{post.username}</h3>
              <p className="text-sm text-gray-500">{post.timestamp}</p>
            </div>
          </div>

          {/* Post Content */}
          <div className="px-4 pb-3">
            <p className="text-gray-800">{post.content}</p>
          </div>

          {/* Post Media */}
          {post.image && (
            <div className="bg-gray-100">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-80 object-cover"
              />
            </div>
          )}

          {post.video && (
            <div className="bg-gray-100">
              <div className="w-full h-80 bg-gray-300 flex items-center justify-center text-gray-600">
                Video Player Placeholder
              </div>
            </div>
          )}

          {/* Post Actions */}
          <div className="px-4 py-3 flex items-center justify-between border-t border-gray-100">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => toggleLike(post.id)}
                className="flex items-center space-x-2 text-gray-600 hover:text-red-500 transition-colors"
              >
                {likedPosts.has(post.id) ? (
                  <HeartSolidIcon className="w-6 h-6 text-red-500" />
                ) : (
                  <HeartIcon className="w-6 h-6" />
                )}
                <span className="text-sm font-medium">{post.likes}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-600 hover:text-blue-500 transition-colors">
                <ChatBubbleOvalLeftIcon className="w-6 h-6" />
                <span className="text-sm font-medium">{post.comments}</span>
              </button>

              <button className="flex items-center space-x-2 text-gray-600 hover:text-green-500 transition-colors">
                <ShareIcon className="w-6 h-6" />
                <span className="text-sm font-medium">{post.shares}</span>
              </button>
            </div>
          </div>
        </div>
      ))}

      {/* Load More */}
      <div className="text-center py-8">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
          Load More Posts
        </button>
      </div>
    </div>
  );
}