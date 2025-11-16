import { supabase } from './client';

export interface ProfileData {
  id?: string;
  name: string;
  username: string;
  bio: string;
  location: string;
  website: string;
  email: string;
  phone: string;
  privacy: string;
  notifications: {
    likes: boolean;
    comments: boolean;
    follows: boolean;
    messages: boolean;
    posts: boolean;
  };
  avatar_url?: string;
  banner_url?: string;
}

export class ProfileService {
  /**
   * Get user profile by ID
   */
  static async getProfile(userId: string): Promise<ProfileData | null> {
    try {
      const { data, error } = await supabase
        .from('amenity_profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
        return null;
      }

      return {
        id: data.id,
        name: data.display_name,
        username: data.username,
        bio: data.bio || '',
        location: data.location || '',
        website: data.website_url || '',
        email: data.email,
        phone: data.phone || '',
        privacy: data.privacy_setting,
        notifications: data.notification_settings || {
          likes: true,
          comments: true,
          follows: true,
          messages: true,
          posts: false
        },
        avatar_url: data.avatar_url,
        banner_url: data.banner_url
      };
    } catch (error) {
      console.error('Profile service error:', error);
      return null;
    }
  }

  /**
   * Update user profile
   */
  static async updateProfile(userId: string, profileData: Partial<ProfileData>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('amenity_profiles')
        .update({
          display_name: profileData.name,
          username: profileData.username,
          bio: profileData.bio,
          location: profileData.location,
          website_url: profileData.website,
          phone: profileData.phone,
          privacy_setting: profileData.privacy,
          notification_settings: profileData.notifications,
          updated_at: new Date().toISOString()
        })
        .eq('id', userId);

      if (error) {
        console.error('Error updating profile:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Profile update service error:', error);
      return false;
    }
  }

  /**
   * Create new profile
   */
  static async createProfile(profileData: ProfileData): Promise<string | null> {
    try {
      const { data, error } = await supabase
        .from('amenity_profiles')
        .insert({
          email: profileData.email,
          username: profileData.username,
          display_name: profileData.name,
          bio: profileData.bio,
          location: profileData.location,
          website_url: profileData.website,
          phone: profileData.phone,
          privacy_setting: profileData.privacy,
          notification_settings: profileData.notifications
        })
        .select('id')
        .single();

      if (error) {
        console.error('Error creating profile:', error);
        return null;
      }

      return data.id;
    } catch (error) {
      console.error('Profile creation service error:', error);
      return null;
    }
  }

  /**
   * Upload profile avatar
   */
  static async uploadAvatar(userId: string, file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${userId}-avatar.${fileExt}`;

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return null;
      }

      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      // Update profile with new avatar URL
      const { error: updateError } = await supabase
        .from('amenity_profiles')
        .update({ avatar_url: urlData.publicUrl })
        .eq('id', userId);

      if (updateError) {
        console.error('Error updating profile with avatar URL:', updateError);
        return null;
      }

      return urlData.publicUrl;
    } catch (error) {
      console.error('Avatar upload service error:', error);
      return null;
    }
  }

  /**
   * Get profile stats (followers, following, posts)
   */
  static async getProfileStats(userId: string): Promise<{
    followers: number;
    following: number;
    posts: number;
  }> {
    try {
      const { data, error } = await supabase
        .from('amenity_profiles')
        .select('follower_count, following_count, post_count')
        .eq('id', userId)
        .single();

      if (error) {
        console.error('Error fetching profile stats:', error);
        return { followers: 0, following: 0, posts: 0 };
      }

      return {
        followers: data.follower_count || 0,
        following: data.following_count || 0,
        posts: data.post_count || 0
      };
    } catch (error) {
      console.error('Profile stats service error:', error);
      return { followers: 0, following: 0, posts: 0 };
    }
  }
}