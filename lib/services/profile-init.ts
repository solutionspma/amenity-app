/**
 * Profile Initialization Service
 * Sets up default profile data for new users
 */

export interface UserProfileData {
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
  stats: {
    followers: number;
    following: number;
    posts: number;
  };
  avatar_url?: string;
  banner_url?: string;
}

export class ProfileInitService {
  /**
   * Initialize profile for a new user
   */
  static initializeProfile(userId: string, email: string): UserProfileData {
    if (typeof window === 'undefined') {
      throw new Error('Profile initialization must be called in browser');
    }

    // Check if profile already exists
    const existingProfile = localStorage.getItem('amenity_profile_backup');
    if (existingProfile) {
      try {
        return JSON.parse(existingProfile);
      } catch (e) {
        console.error('Error parsing existing profile:', e);
      }
    }

    // Extract name from email (before @)
    const emailName = email.split('@')[0];
    const capitalizedName = emailName
      .split(/[._-]/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');

    // Create default profile
    const defaultProfile: UserProfileData = {
      name: capitalizedName || 'Amenity User',
      username: `@${emailName}`,
      bio: 'Welcome to Amenity! 🎉 Connecting with my faith community and sharing my journey.',
      location: 'United States',
      website: 'amenity.church',
      email: email,
      phone: '',
      privacy: 'public',
      notifications: {
        likes: true,
        comments: true,
        follows: true,
        messages: true,
        posts: true
      },
      stats: {
        followers: 0,
        following: 1, // Auto-follows master user
        posts: 0
      }
    };

    // Save to localStorage
    localStorage.setItem('amenity_profile_backup', JSON.stringify(defaultProfile));
    console.log('✅ Profile initialized for:', email);

    return defaultProfile;
  }

  /**
   * Get current user profile
   */
  static getCurrentProfile(): UserProfileData | null {
    if (typeof window === 'undefined') return null;

    const saved = localStorage.getItem('amenity_profile_backup');
    if (!saved) return null;

    try {
      return JSON.parse(saved);
    } catch (e) {
      console.error('Error parsing profile:', e);
      return null;
    }
  }

  /**
   * Update profile stats
   */
  static updateStats(updates: Partial<UserProfileData['stats']>): void {
    if (typeof window === 'undefined') return;

    const profile = this.getCurrentProfile();
    if (!profile) return;

    profile.stats = {
      ...profile.stats,
      ...updates
    };

    localStorage.setItem('amenity_profile_backup', JSON.stringify(profile));
  }
}
