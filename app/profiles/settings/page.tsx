'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBackdrop } from '@/contexts/BackdropContext';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { FallbackProfileService as ProfileService, type ProfileData } from '@/lib/supabase/fallback-profiles';
import ImageUploader from '@/components/ui/ImageUploader';
import { ImageUploadService, type ImageUploadResult } from '@/lib/services/image-upload';

export default function ProfileSettings() {
  const [profile, setProfile] = useState<ProfileData>({
    name: 'Your Profile',
    username: '@yourhandle',
    bio: 'Welcome to your Amenity profile! Connect, create, and grow your community. ✨ Living my best life on the platform!',
    location: 'New York, NY',
    website: 'amenityapp.com',
    email: 'you@example.com',
    phone: '+1 (555) 123-4567',
    privacy: 'public',
    notifications: {
      likes: true,
      comments: true,
      follows: true,
      messages: true,
      posts: false
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [profileImage, setProfileImage] = useState<string>('');
  const [coverImage, setCoverImage] = useState<string>('');
  const [uploadSuccess, setUploadSuccess] = useState<string>('');

  const { getBackdropStyle } = useBackdrop();
  const router = useRouter();

  // Load profile data on component mount
  useEffect(() => {
    const loadProfile = async () => {
      try {
        setLoading(true);
        
        // Start with localStorage for immediate loading
        const savedProfile = localStorage.getItem('amenity_profile_backup');
        if (savedProfile) {
          try {
            const parsedProfile = JSON.parse(savedProfile);
            setProfile(parsedProfile);
            console.log('Loaded profile from localStorage:', parsedProfile);
          } catch (parseError) {
            console.error('Error parsing saved profile:', parseError);
          }
        }
        
        // Try to load from fallback service
        try {
          const userId = 'demo-user-id';
          const profileData = await ProfileService.getProfile(userId);
          if (profileData) {
            setProfile(profileData);
            console.log('Loaded profile from service:', profileData);
          }
        } catch (serviceError) {
          console.log('Service error:', serviceError);
        }

        // Load existing images from storage and profile data
        const userId = 'demo-user-id';
        const existingProfileImage = ImageUploadService.getProfileImage(userId);
        const existingCoverImage = ImageUploadService.getCoverImage(userId);
        
        if (existingProfileImage) {
          setProfileImage(existingProfileImage);
        } else if (profile.avatar_url) {
          setProfileImage(profile.avatar_url);
        }
        
        if (existingCoverImage) {
          setCoverImage(existingCoverImage);
        } else if (profile.banner_url) {
          setCoverImage(profile.banner_url);
        }
        
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen" style={getBackdropStyle('profile')}>
        <AmenityHeader currentPage="/profiles/settings" />
        <div className="flex items-center justify-center h-screen">
          <div className="text-white text-xl flex items-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
            <span>Loading profile settings...</span>
          </div>
        </div>
        <AmenityFooter />
      </div>
    );
  }

  const handleSave = async () => {
    try {
      setSaving(true);
      
      const userId = 'demo-user-id';
      const success = await ProfileService.updateProfile(userId, profile);
      
      if (success) {
        console.log('✅ Profile saved successfully');
        setUploadSuccess('✅ Profile saved successfully!');
        setTimeout(() => setUploadSuccess(''), 3000);
        // Don't auto-redirect, let user continue editing
      } else {
        alert('❌ Error saving profile. Please try again.');
      }
      
    } catch (error) {
      console.error('Error saving profile:', error);
      alert('❌ Error saving profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleProfileImageUpload = (result: ImageUploadResult) => {
    if (result.success && result.url) {
      setProfileImage(result.url);
      setProfile(prev => ({ ...prev, avatar_url: result.url }));
      setUploadSuccess('✅ Profile image updated!');
      setTimeout(() => setUploadSuccess(''), 3000);
    }
  };

  const handleCoverImageUpload = (result: ImageUploadResult) => {
    if (result.success && result.url) {
      setCoverImage(result.url);
      setProfile(prev => ({ ...prev, banner_url: result.url }));
      setUploadSuccess('✅ Cover image updated!');
      setTimeout(() => setUploadSuccess(''), 3000);
    }
  };

  const handleImageUploadError = (error: string) => {
    alert(`❌ ${error}`);
  };

  return (
    <div className="min-h-screen" style={getBackdropStyle('profile')}>
      <AmenityHeader currentPage="/profiles/settings" />
      
      <main className="max-w-4xl mx-auto px-4 py-8">
        <div className="mb-8">
          <button 
            onClick={() => router.back()}
            className="text-gray-400 hover:text-white transition-colors mb-4"
          >
            ← Back to Profile
          </button>
          <h1 className="text-4xl font-bold text-white mb-4">Profile Settings</h1>
          <p className="text-gray-300">Manage your account information and preferences</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Settings Navigation */}
          <div className="lg:col-span-1">
            <div className="bg-black/20 rounded-2xl p-6 border border-gray-700 sticky top-8">
              <h3 className="text-xl font-bold text-white mb-4">Settings</h3>
              <nav className="space-y-2">
                <a href="#profile" className="block p-3 bg-purple-600 text-white rounded-lg font-medium">
                  👤 Profile Info
                </a>
                <a href="#privacy" className="block p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  🔒 Privacy
                </a>
                <a href="#notifications" className="block p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  🔔 Notifications
                </a>
                <a href="#security" className="block p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  🛡️ Security
                </a>
                <a href="#monetization" className="block p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors">
                  💰 Monetization
                </a>
              </nav>
            </div>
          </div>

          {/* Settings Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Profile Information */}
            <section id="profile" className="bg-black/20 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Profile Information</h2>
              
              {uploadSuccess && (
                <div className="mb-6 p-4 bg-green-600/20 border border-green-500 rounded-lg text-green-300">
                  {uploadSuccess}
                </div>
              )}

              {/* Image Uploads */}
              <div className="mb-8 space-y-8">
                <ImageUploader
                  type="profile"
                  userId="demo-user-id"
                  currentImage={profileImage}
                  onUploadSuccess={handleProfileImageUpload}
                  onUploadError={handleImageUploadError}
                  className="mb-6"
                />

                <ImageUploader
                  type="cover"
                  userId="demo-user-id"
                  currentImage={coverImage}
                  onUploadSuccess={handleCoverImageUpload}
                  onUploadError={handleImageUploadError}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-white font-medium mb-2">Display Name</label>
                  <input 
                    type="text" 
                    value={profile.name}
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-white font-medium mb-2">Username</label>
                  <input 
                    type="text" 
                    value={profile.username}
                    onChange={(e) => setProfile({...profile, username: e.target.value})}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Email</label>
                  <input 
                    type="email" 
                    value={profile.email}
                    onChange={(e) => setProfile({...profile, email: e.target.value})}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Phone</label>
                  <input 
                    type="tel" 
                    value={profile.phone}
                    onChange={(e) => setProfile({...profile, phone: e.target.value})}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Location</label>
                  <input 
                    type="text" 
                    value={profile.location}
                    onChange={(e) => setProfile({...profile, location: e.target.value})}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-white font-medium mb-2">Website</label>
                  <input 
                    type="url" 
                    value={profile.website}
                    onChange={(e) => setProfile({...profile, website: e.target.value})}
                    className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-white font-medium mb-2">Bio</label>
                <textarea 
                  value={profile.bio}
                  onChange={(e) => setProfile({...profile, bio: e.target.value})}
                  rows={4}
                  className="w-full bg-black/30 border border-gray-600 rounded-lg px-4 py-3 text-white focus:border-purple-500 focus:outline-none resize-none"
                  placeholder="Tell people about yourself..."
                />
                <p className="text-gray-400 text-sm mt-1">Max 160 characters</p>
              </div>
            </section>

            {/* Privacy Settings */}
            <section id="privacy" className="bg-black/20 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Privacy & Security</h2>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-white font-medium mb-3">Account Privacy</label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="privacy" 
                        value="public"
                        checked={profile.privacy === 'public'}
                        onChange={(e) => setProfile({...profile, privacy: e.target.value})}
                        className="text-purple-500"
                      />
                      <div>
                        <span className="text-white font-medium">Public</span>
                        <p className="text-gray-400 text-sm">Anyone can see your profile and posts</p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3">
                      <input 
                        type="radio" 
                        name="privacy" 
                        value="private"
                        checked={profile.privacy === 'private'}
                        onChange={(e) => setProfile({...profile, privacy: e.target.value})}
                        className="text-purple-500"
                      />
                      <div>
                        <span className="text-white font-medium">Private</span>
                        <p className="text-gray-400 text-sm">Only approved followers can see your posts</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-black/20 p-4 rounded-xl border border-gray-700">
                    <h4 className="text-white font-medium mb-2">🚫 Blocked Users</h4>
                    <p className="text-gray-400 text-sm mb-3">Manage users you've blocked</p>
                    <button className="text-blue-400 hover:text-blue-300 transition-colors text-sm">
                      View Blocked List
                    </button>
                  </div>
                  <div className="bg-black/20 p-4 rounded-xl border border-gray-700">
                    <h4 className="text-white font-medium mb-2">📊 Data Export</h4>
                    <p className="text-gray-400 text-sm mb-3">Download your data</p>
                    <button className="text-green-400 hover:text-green-300 transition-colors text-sm">
                      Request Export
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Notification Settings */}
            <section id="notifications" className="bg-black/20 rounded-2xl p-8 border border-gray-700">
              <h2 className="text-2xl font-bold text-white mb-6">Notification Preferences</h2>
              
              <div className="space-y-4">
                {Object.entries(profile.notifications).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-gray-700">
                    <div>
                      <h4 className="text-white font-medium capitalize">{key}</h4>
                      <p className="text-gray-400 text-sm">
                        {key === 'likes' && 'When someone likes your posts'}
                        {key === 'comments' && 'When someone comments on your posts'}
                        {key === 'follows' && 'When someone follows you'}
                        {key === 'messages' && 'When you receive new messages'}
                        {key === 'posts' && 'When people you follow post new content'}
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={value}
                        onChange={(e) => setProfile({
                          ...profile, 
                          notifications: {...profile.notifications, [key]: e.target.checked}
                        })}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-600 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </section>

            {/* Save Button */}
            <div className="flex space-x-4">
              <button 
                onClick={handleSave}
                disabled={saving || loading}
                className={`px-8 py-3 rounded-full font-semibold transition-all ${
                  saving || loading
                    ? 'bg-gray-600 cursor-not-allowed text-gray-300'
                    : 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
                }`}
              >
                {saving ? (
                  <span className="flex items-center space-x-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Saving...</span>
                  </span>
                ) : (
                  'Save Changes'
                )}
              </button>
              <button 
                onClick={() => router.back()}
                className="bg-gray-600 hover:bg-gray-700 text-white px-8 py-3 rounded-full font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </main>

      <AmenityFooter />
    </div>
  );
}