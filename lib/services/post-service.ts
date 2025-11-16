// Post service for managing user posts with localStorage persistence

export interface Post {
  id: string;
  userId: string;
  authorName: string;
  authorUsername: string;
  authorAvatar: string;
  content: string;
  timestamp: string;
  likes: number;
  comments: number;
  shares: number;
  image?: string;
  video?: string;
  liked?: boolean;
}

export class PostService {
  private static readonly ADMIN_USER_ID = 'demo-user-id';
  private static readonly POSTS_STORAGE_KEY = 'amenity_user_posts_';
  private static readonly FEED_STORAGE_KEY = 'amenity_global_feed';

  /**
   * Get posts for a specific user
   */
  static getUserPosts(userId: string): Post[] {
    if (typeof window === 'undefined') return [];

    try {
      const storageKey = `${this.POSTS_STORAGE_KEY}${userId}`;
      const savedPosts = localStorage.getItem(storageKey);
      
      if (savedPosts) {
        return JSON.parse(savedPosts);
      }

      // If no saved posts and this is the admin/your profile, return empty
      // (user will create posts)
      return [];
    } catch (error) {
      console.error('Error loading user posts:', error);
      return [];
    }
  }

  /**
   * Save posts for a specific user
   */
  static saveUserPosts(userId: string, posts: Post[]): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const storageKey = `${this.POSTS_STORAGE_KEY}${userId}`;
      localStorage.setItem(storageKey, JSON.stringify(posts));
      
      // If this is the admin user, also update the global feed
      if (userId === this.ADMIN_USER_ID) {
        this.updateGlobalFeed();
      }
      
      return true;
    } catch (error) {
      console.error('Error saving user posts:', error);
      return false;
    }
  }

  /**
   * Create a new post
   */
  static createPost(
    userId: string,
    content: string,
    authorName: string,
    authorUsername: string,
    authorAvatar: string,
    image?: string,
    video?: string
  ): Post {
    const newPost: Post = {
      id: `post-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      userId,
      authorName,
      authorUsername,
      authorAvatar,
      content,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      image,
      video,
      liked: false
    };

    // Get existing posts
    const existingPosts = this.getUserPosts(userId);
    
    // Add new post to beginning
    const updatedPosts = [newPost, ...existingPosts];
    
    // Save
    this.saveUserPosts(userId, updatedPosts);
    
    return newPost;
  }

  /**
   * Update global feed with admin's posts (shown to all new users)
   */
  private static updateGlobalFeed(): void {
    if (typeof window === 'undefined') return;

    try {
      const adminPosts = this.getUserPosts(this.ADMIN_USER_ID);
      localStorage.setItem(this.FEED_STORAGE_KEY, JSON.stringify(adminPosts));
    } catch (error) {
      console.error('Error updating global feed:', error);
    }
  }

  /**
   * Get global feed (admin's posts shown to everyone)
   */
  static getGlobalFeed(): Post[] {
    if (typeof window === 'undefined') return [];

    try {
      const savedFeed = localStorage.getItem(this.FEED_STORAGE_KEY);
      
      if (savedFeed) {
        return JSON.parse(savedFeed);
      }

      // Return admin's posts as default feed
      return this.getUserPosts(this.ADMIN_USER_ID);
    } catch (error) {
      console.error('Error loading global feed:', error);
      return [];
    }
  }

  /**
   * Auto-follow admin for new users
   */
  static autoFollowAdmin(newUserId: string): void {
    if (typeof window === 'undefined') return;

    try {
      const followingKey = `amenity_following_${newUserId}`;
      const following = [this.ADMIN_USER_ID];
      localStorage.setItem(followingKey, JSON.stringify(following));
      
      console.log(`✅ New user ${newUserId} auto-following admin ${this.ADMIN_USER_ID}`);
    } catch (error) {
      console.error('Error auto-following admin:', error);
    }
  }

  /**
   * Delete a post
   */
  static deletePost(userId: string, postId: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const posts = this.getUserPosts(userId);
      const updatedPosts = posts.filter(p => p.id !== postId);
      return this.saveUserPosts(userId, updatedPosts);
    } catch (error) {
      console.error('Error deleting post:', error);
      return false;
    }
  }

  /**
   * Like/unlike a post
   */
  static toggleLike(userId: string, postId: string): boolean {
    if (typeof window === 'undefined') return false;

    try {
      const posts = this.getUserPosts(userId);
      const updatedPosts = posts.map(post => {
        if (post.id === postId) {
          return {
            ...post,
            liked: !post.liked,
            likes: post.liked ? post.likes - 1 : post.likes + 1
          };
        }
        return post;
      });
      
      return this.saveUserPosts(userId, updatedPosts);
    } catch (error) {
      console.error('Error toggling like:', error);
      return false;
    }
  }
}
