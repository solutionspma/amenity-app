'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';

export default function CreatorUpload() {
  const [postContent, setPostContent] = useState('');
  const [selectedMedia, setSelectedMedia] = useState<File[]>([]);
  const [postType, setPostType] = useState('text');
  const [uploading, setUploading] = useState(false);
  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();

  const handleMediaUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedMedia(Array.from(e.target.files));
    }
  };

  const handlePost = async () => {
    setUploading(true);
    
    try {
      // API call would go here
      // const formData = new FormData();
      // formData.append('content', postContent);
      // selectedMedia.forEach(file => formData.append('media', file));
      
      // Simulate upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirect back to profile
      router.push('/profiles/me');
    } catch (error) {
      console.error('Error creating post:', error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen" style={getBackdropStyle('creator')}>
      <AmenityHeader currentPage="/creator/upload" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors mb-4"
          >
            ← Back to Profile
          </button>
          <h1 className="text-4xl font-bold text-white mb-4">Create New Post</h1>
          <p className="text-gray-300">Share your thoughts, images, or videos with your community</p>
        </div>

        <div className="bg-black/20 rounded-2xl p-8 border border-gray-700">
          {/* Post Type Selection */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">Post Type</label>
            <div className="flex space-x-4">
              <button
                onClick={() => setPostType('text')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  postType === 'text'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                📝 Text Post
              </button>
              <button
                onClick={() => setPostType('image')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  postType === 'image'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                📷 Photo Post
              </button>
              <button
                onClick={() => setPostType('video')}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  postType === 'video'
                    ? 'bg-purple-600 text-white'
                    : 'bg-black/30 text-gray-400 hover:text-white'
                }`}
              >
                🎥 Video Post
              </button>
            </div>
          </div>

          {/* Post Content */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-3">What's on your mind?</label>
            <textarea
              value={postContent}
              onChange={(e) => setPostContent(e.target.value)}
              placeholder="Share your thoughts with the community..."
              rows={6}
              className="w-full bg-black/30 border border-gray-600 rounded-xl px-4 py-3 text-white focus:border-purple-500 focus:outline-none resize-none"
            />
            <div className="flex justify-between items-center mt-2">
              <span className="text-gray-400 text-sm">{postContent.length}/280 characters</span>
              <div className="flex space-x-2">
                <button className="text-gray-400 hover:text-yellow-400 transition-colors">😀</button>
                <button className="text-gray-400 hover:text-blue-400 transition-colors">@</button>
                <button className="text-gray-400 hover:text-green-400 transition-colors">#</button>
              </div>
            </div>
          </div>

          {/* Media Upload */}
          {(postType === 'image' || postType === 'video') && (
            <div className="mb-6">
              <label className="block text-white font-medium mb-3">
                {postType === 'image' ? 'Upload Images' : 'Upload Video'}
              </label>
              <div className="border-2 border-dashed border-gray-600 rounded-xl p-8 text-center">
                <input
                  type="file"
                  multiple={postType === 'image'}
                  accept={postType === 'image' ? 'image/*' : 'video/*'}
                  onChange={handleMediaUpload}
                  className="hidden"
                  id="media-upload"
                />
                <label htmlFor="media-upload" className="cursor-pointer">
                  <div className="text-6xl mb-4">
                    {postType === 'image' ? '📷' : '🎥'}
                  </div>
                  <div className="text-white font-medium mb-2">
                    Click to upload {postType === 'image' ? 'images' : 'video'}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {postType === 'image' 
                      ? 'JPG, PNG, GIF (max 10MB each)' 
                      : 'MP4, MOV, AVI (max 100MB)'
                    }
                  </div>
                </label>
              </div>
              
              {selectedMedia.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-white font-medium mb-2">Selected Files:</h4>
                  <div className="space-y-2">
                    {selectedMedia.map((file, index) => (
                      <div key={index} className="flex items-center justify-between bg-black/30 p-3 rounded-lg">
                        <span className="text-gray-300">{file.name}</span>
                        <button
                          onClick={() => setSelectedMedia(selectedMedia.filter((_, i) => i !== index))}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Post Options */}
          <div className="mb-8">
            <h3 className="text-white font-medium mb-4">Post Settings</h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-purple-500 rounded" />
                  <span className="text-gray-300">Allow comments</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-purple-500 rounded" />
                  <span className="text-gray-300">Allow sharing</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-purple-500 rounded" />
                  <span className="text-gray-300">Show on feed</span>
                </label>
              </div>
              <div>
                <label className="flex items-center space-x-3">
                  <input type="checkbox" className="w-4 h-4 text-purple-500 rounded" />
                  <span className="text-gray-300">Enable monetization</span>
                </label>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-4">
            <button
              onClick={handlePost}
              disabled={!postContent.trim() || uploading}
              className={`px-8 py-3 rounded-full font-semibold transition-all ${
                !postContent.trim() || uploading
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
              }`}
            >
              {uploading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Posting...</span>
                </div>
              ) : (
                'Share Post'
              )}
            </button>
            <button
              onClick={() => router.back()}
              disabled={uploading}
              className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                setPostContent('');
                setSelectedMedia([]);
                setPostType('text');
              }}
              disabled={uploading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-6 py-3 rounded-full font-semibold transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-black/20 rounded-2xl p-6 border border-gray-700">
          <h3 className="text-white font-medium mb-4">Quick Actions</h3>
          <div className="grid md:grid-cols-3 gap-4">
            <button 
              onClick={() => router.push('/livestream/studio')}
              className="bg-red-600/20 border border-red-600/50 p-4 rounded-xl text-red-300 hover:bg-red-600/30 transition-colors"
            >
              <div className="text-2xl mb-2">🔴</div>
              <div className="font-medium">Go Live</div>
              <div className="text-sm opacity-75">Start streaming</div>
            </button>
            <button 
              onClick={() => router.push('/shorts')}
              className="bg-purple-600/20 border border-purple-600/50 p-4 rounded-xl text-purple-300 hover:bg-purple-600/30 transition-colors"
            >
              <div className="text-2xl mb-2">⚡</div>
              <div className="font-medium">Create Short</div>
              <div className="text-sm opacity-75">Quick video</div>
            </button>
            <button 
              onClick={() => router.push('/creator/analytics')}
              className="bg-blue-600/20 border border-blue-600/50 p-4 rounded-xl text-blue-300 hover:bg-blue-600/30 transition-colors"
            >
              <div className="text-2xl mb-2">📊</div>
              <div className="font-medium">Analytics</div>
              <div className="text-sm opacity-75">View stats</div>
            </button>
          </div>
        </div>
      </main>

      <AmenityFooter />
    </div>
  );
}