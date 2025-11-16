// Fallback profile service that works without database setup
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

export class FallbackProfileService {
  /**
   * Get user profile - uses localStorage for now
   */
  static async getProfile(userId: string): Promise<ProfileData | null> {
    try {
      await new Promise(resolve => setTimeout(resolve, 100)); // Simulate API delay
      
      if (typeof window === 'undefined') return null;
      
      const savedProfile = localStorage.getItem('amenity_profile_backup');
      if (savedProfile) {
        return JSON.parse(savedProfile);
      }
      
      return null;
    } catch (error) {
      console.error('Fallback profile service error:', error);
      return null;
    }
  }

  /**
   * Update user profile - saves to localStorage
   */
  static async updateProfile(userId: string, profileData: Partial<ProfileData>): Promise<boolean> {
    try {
      await new Promise(resolve => setTimeout(resolve, 200)); // Simulate API delay
      
      if (typeof window === 'undefined') return false;
      
      localStorage.setItem('amenity_profile_backup', JSON.stringify(profileData));
      console.log('Profile saved to localStorage via fallback service');
      return true;
    } catch (error) {
      console.error('Fallback profile update error:', error);
      return false;
    }
  }
}