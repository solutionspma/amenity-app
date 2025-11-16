'use client';

import { useState } from 'react';
import ImageUploader from '@/components/ui/ImageUploader';
import { type ImageUploadResult } from '@/lib/services/image-upload';

export default function ImageUploadDemo() {
  const [profileImage, setProfileImage] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [message, setMessage] = useState<string>('');

  const handleProfileImageUpload = (result: ImageUploadResult) => {
    if (result.success && result.url) {
      setProfileImage(result.url);
      setMessage('✅ Profile image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleCoverImageUpload = (result: ImageUploadResult) => {
    if (result.success && result.url) {
      setCoverImage(result.url);
      setMessage('✅ Cover image uploaded successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleUploadError = (error: string) => {
    setMessage(`❌ ${error}`);
    setTimeout(() => setMessage(''), 5000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white">
      <div className="max-w-6xl mx-auto p-8">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">📸 Image Upload System</h1>
          <p className="text-xl text-gray-300">
            Complete profile and cover image upload with compression, validation, and preview
          </p>
        </div>

        {message && (
          <div className="mb-8 p-4 bg-white/10 border border-white/20 rounded-lg text-center font-medium">
            {message}
          </div>
        )}

        <div className="grid lg:grid-cols-2 gap-12">
          <div>
            <ImageUploader
              type="profile"
              userId="demo-user-id"
              currentImage={profileImage}
              onUploadSuccess={handleProfileImageUpload}
              onUploadError={handleUploadError}
            />
          </div>

          <div>
            <ImageUploader
              type="cover"
              userId="demo-user-id"
              currentImage={coverImage}
              onUploadSuccess={handleCoverImageUpload}
              onUploadError={handleUploadError}
            />
          </div>
        </div>

        {/* Preview Section */}
        {(profileImage || coverImage) && (
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center">📱 Live Preview</h2>
            
            {/* Mock Profile Card */}
            <div className="max-w-2xl mx-auto">
              {/* Cover Image */}
              <div className="relative h-48 rounded-t-2xl overflow-hidden">
                {coverImage ? (
                  <img
                    src={coverImage}
                    alt="Cover preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-r from-purple-600 to-blue-600"></div>
                )}
              </div>
              
              {/* Profile Section */}
              <div className="bg-white/10 rounded-b-2xl p-6 -mt-16 pt-20">
                <div className="flex items-center space-x-4 mb-4">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt="Profile preview"
                      className="w-24 h-24 rounded-full border-4 border-white object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full border-4 border-white flex items-center justify-center text-2xl font-bold">
                      🧑‍💼
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-bold">Your Profile</h3>
                    <p className="text-gray-300">@yourhandle</p>
                  </div>
                </div>
                <p className="text-gray-300">
                  Welcome to your Amenity profile! Your uploaded images are displayed here in real-time. 
                  The image upload system includes compression, validation, and secure storage.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Features Section */}
        <div className="mt-16 grid md:grid-cols-3 gap-8">
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🎯</div>
            <h3 className="text-xl font-bold mb-2">Smart Compression</h3>
            <p className="text-gray-300">
              Automatically optimizes image size and quality for fast loading without sacrificing visual appeal.
            </p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">🛡️</div>
            <h3 className="text-xl font-bold mb-2">Validation & Security</h3>
            <p className="text-gray-300">
              Validates file types, sizes, and dimensions to ensure only safe, appropriate images are uploaded.
            </p>
          </div>
          
          <div className="bg-white/10 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold mb-2">Real-time Preview</h3>
            <p className="text-gray-300">
              See your changes instantly with drag-and-drop functionality and immediate visual feedback.
            </p>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-12 text-center space-x-4">
          <a 
            href="/profiles/settings"
            className="inline-block bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            📝 Profile Settings
          </a>
          <a 
            href="/profiles/me"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
          >
            👤 View Profile
          </a>
        </div>
      </div>
    </div>
  );
}