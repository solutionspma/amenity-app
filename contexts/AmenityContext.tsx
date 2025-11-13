'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { useUser, useSessionContext } from '@supabase/auth-helpers-react';
import { supabase } from '@/lib/supabase/client';
import { toast } from '@/components/ui/Toast';

interface User {
  id: string;
  email: string;
  username: string;
  display_name: string;
  avatar_url?: string;
  bio?: string;
  church_affiliation?: string;
  location?: string;
  subscription_tier: 'free' | 'premium' | 'business' | 'enterprise';
  creator_status: boolean;
  follower_count: number;
  following_count: number;
  total_earnings: number;
  permissions: string[];
  is_live: boolean;
  last_active: string;
}

interface Post {
  id: string;
  user_id: string;
  content: string;
  media_urls: string[];
  video_url?: string;
  is_short: boolean;
  like_count: number;
  comment_count: number;
  share_count: number;
  view_count: number;
  created_at: string;
  user: User;
  is_liked?: boolean;
  is_bookmarked?: boolean;
}

interface LiveStream {
  id: string;
  user_id: string;
  title: string;
  description: string;
  stream_key: string;
  viewer_count: number;
  is_live: boolean;
  category: string;
  tags: string[];
  created_at: string;
  user: User;
}

interface CreatorTier {
  id: string;
  creator_id: string;
  name: string;
  price: number;
  description: string;
  perks: string[];
  subscriber_count: number;
}

interface Subscription {
  id: string;
  user_id: string;
  creator_id: string;
  tier_id?: string;
  amount: number;
  status: 'active' | 'cancelled' | 'past_due';
  created_at: string;
}

interface Notification {
  id: string;
  user_id: string;
  type: 'like' | 'comment' | 'follow' | 'subscription' | 'live' | 'tip' | 'system';
  title: string;
  message: string;
  data?: any;
  read: boolean;
  created_at: string;
}

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  media_url?: string;
  created_at: string;
  sender: User;
}

interface Group {
  id: string;
  name: string;
  description: string;
  avatar_url?: string;
  is_private: boolean;
  member_count: number;
  category: 'ministry' | 'fan_community' | 'creative_circle' | 'general';
  created_by: string;
  created_at: string;
}

interface AmenityState {
  user: User | null;
  posts: Post[];
  liveStreams: LiveStream[];
  notifications: Notification[];
  messages: Message[];
  groups: Group[];
  subscriptions: Subscription[];
  creatorTiers: CreatorTier[];
  isLoading: boolean;
  error: string | null;
  darkMode: boolean;
  currentFeed: 'home' | 'following' | 'trending' | 'shorts' | 'live';
  permissions: {
    canUpload: boolean;
    canLive: boolean;
    canCreateGroups: boolean;
    canModerate: boolean;
    hasJayIAccess: boolean;
  };
}

type AmenityAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_POSTS'; payload: Post[] }
  | { type: 'ADD_POST'; payload: Post }
  | { type: 'UPDATE_POST'; payload: { id: string; updates: Partial<Post> } }
  | { type: 'SET_LIVE_STREAMS'; payload: LiveStream[] }
  | { type: 'SET_NOTIFICATIONS'; payload: Notification[] }
  | { type: 'ADD_NOTIFICATION'; payload: Notification }
  | { type: 'MARK_NOTIFICATION_READ'; payload: string }
  | { type: 'SET_MESSAGES'; payload: Message[] }
  | { type: 'ADD_MESSAGE'; payload: Message }
  | { type: 'SET_GROUPS'; payload: Group[] }
  | { type: 'SET_SUBSCRIPTIONS'; payload: Subscription[] }
  | { type: 'SET_CREATOR_TIERS'; payload: CreatorTier[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'TOGGLE_DARK_MODE' }
  | { type: 'SET_FEED'; payload: AmenityState['currentFeed'] }
  | { type: 'SET_PERMISSIONS'; payload: AmenityState['permissions'] };

const initialState: AmenityState = {
  user: null,
  posts: [],
  liveStreams: [],
  notifications: [],
  messages: [],
  groups: [],
  subscriptions: [],
  creatorTiers: [],
  isLoading: false,
  error: null,
  darkMode: false,
  currentFeed: 'home',
  permissions: {
    canUpload: false,
    canLive: false,
    canCreateGroups: false,
    canModerate: false,
    hasJayIAccess: false,
  },
};

function amenityReducer(state: AmenityState, action: AmenityAction): AmenityState {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'SET_POSTS':
      return { ...state, posts: action.payload };
    case 'ADD_POST':
      return { ...state, posts: [action.payload, ...state.posts] };
    case 'UPDATE_POST':
      return {
        ...state,
        posts: state.posts.map(post =>
          post.id === action.payload.id
            ? { ...post, ...action.payload.updates }
            : post
        ),
      };
    case 'SET_LIVE_STREAMS':
      return { ...state, liveStreams: action.payload };
    case 'SET_NOTIFICATIONS':
      return { ...state, notifications: action.payload };
    case 'ADD_NOTIFICATION':
      return { ...state, notifications: [action.payload, ...state.notifications] };
    case 'MARK_NOTIFICATION_READ':
      return {
        ...state,
        notifications: state.notifications.map(notif =>
          notif.id === action.payload ? { ...notif, read: true } : notif
        ),
      };
    case 'SET_MESSAGES':
      return { ...state, messages: action.payload };
    case 'ADD_MESSAGE':
      return { ...state, messages: [...state.messages, action.payload] };
    case 'SET_GROUPS':
      return { ...state, groups: action.payload };
    case 'SET_SUBSCRIPTIONS':
      return { ...state, subscriptions: action.payload };
    case 'SET_CREATOR_TIERS':
      return { ...state, creatorTiers: action.payload };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    case 'TOGGLE_DARK_MODE':
      return { ...state, darkMode: !state.darkMode };
    case 'SET_FEED':
      return { ...state, currentFeed: action.payload };
    case 'SET_PERMISSIONS':
      return { ...state, permissions: action.payload };
    default:
      return state;
  }
}

interface AmenityContextType extends AmenityState {
  // User Actions
  updateProfile: (updates: Partial<User>) => Promise<void>;
  followUser: (userId: string) => Promise<void>;
  unfollowUser: (userId: string) => Promise<void>;

  // Content Actions
  createPost: (content: string, mediaFiles?: File[]) => Promise<void>;
  likePost: (postId: string) => Promise<void>;
  unlikePost: (postId: string) => Promise<void>;
  commentPost: (postId: string, content: string) => Promise<void>;
  sharePost: (postId: string) => Promise<void>;
  deletePost: (postId: string) => Promise<void>;

  // Video & Streaming
  uploadVideo: (file: File, isShort: boolean) => Promise<string>;
  startLiveStream: (title: string, description: string, category: string) => Promise<string>;
  endLiveStream: (streamId: string) => Promise<void>;

  // Messaging & Groups
  sendMessage: (conversationId: string, content: string, mediaFile?: File) => Promise<void>;
  createGroup: (name: string, description: string, category: Group['category']) => Promise<void>;
  joinGroup: (groupId: string) => Promise<void>;
  leaveGroup: (groupId: string) => Promise<void>;

  // Creator Features
  createTier: (name: string, price: number, description: string, perks: string[]) => Promise<void>;
  subscribeTo: (creatorId: string, tierId?: string) => Promise<void>;
  unsubscribeFrom: (subscriptionId: string) => Promise<void>;
  sendTip: (creatorId: string, amount: number, message?: string) => Promise<void>;

  // Notifications
  markNotificationRead: (notificationId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;

  // Feed Management
  switchFeed: (feed: AmenityState['currentFeed']) => void;
  refreshFeed: () => Promise<void>;

  // Search & Discovery
  searchContent: (query: string, type: 'posts' | 'users' | 'groups' | 'all') => Promise<any[]>;
  getTrendingContent: () => Promise<Post[]>;
  getRecommendedCreators: () => Promise<User[]>;

  // Analytics (for creators)
  getAnalytics: (period: '7d' | '30d' | '90d') => Promise<any>;

  // Revenue Management
  getEarnings: () => Promise<any>;
  requestPayout: (amount: number) => Promise<void>;

  // Admin Functions (if user has permissions)
  moderateContent: (contentId: string, action: 'approve' | 'reject' | 'delete') => Promise<void>;
  banUser: (userId: string, reason: string) => Promise<void>;
}

const AmenityContext = createContext<AmenityContextType | undefined>(undefined);

export function AmenityProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(amenityReducer, initialState);
  const user = useUser();
  const { session } = useSessionContext();

  // Load user data and permissions
  useEffect(() => {
    if (user && session) {
      loadUserData();
      loadPermissions();
    } else {
      dispatch({ type: 'SET_USER', payload: null });
    }
  }, [user, session]);

  // Real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const notificationChannel = supabase
      .channel('notifications')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'notifications',
        filter: `user_id=eq.${user.id}`,
      }, (payload) => {
        dispatch({ type: 'ADD_NOTIFICATION', payload: payload.new as Notification });
        toast.info(payload.new.title);
      })
      .subscribe();

    const messageChannel = supabase
      .channel('messages')
      .on('postgres_changes', {
        event: 'INSERT',
        schema: 'public',
        table: 'messages',
        filter: `conversation_id=in.(${state.messages.map(m => m.conversation_id).join(',')})`,
      }, (payload) => {
        dispatch({ type: 'ADD_MESSAGE', payload: payload.new as Message });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(notificationChannel);
      supabase.removeChannel(messageChannel);
    };
  }, [user, state.messages]);

  const loadUserData = async () => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      const { data: profile } = await supabase
        .from('amenity_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profile) {
        dispatch({ type: 'SET_USER', payload: profile });
      }

      // Load initial feed
      await refreshFeed();
    } catch (error) {
      console.error('Error loading user data:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const loadPermissions = async () => {
    if (!user) return;

    try {
      const { data: permissions } = await supabase
        .from('user_permissions')
        .select('permission')
        .eq('user_id', user.id);

      const permissionList = permissions?.map(p => p.permission) || [];

      dispatch({
        type: 'SET_PERMISSIONS',
        payload: {
          canUpload: permissionList.includes('upload') || true,
          canLive: permissionList.includes('live_stream'),
          canCreateGroups: permissionList.includes('create_groups'),
          canModerate: permissionList.includes('moderate'),
          hasJayIAccess: permissionList.includes('jay_i_access'),
        },
      });
    } catch (error) {
      console.error('Error loading permissions:', error);
    }
  };

  const refreshFeed = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      let query = supabase
        .from('posts')
        .select(`
          *,
          user:amenity_profiles(*)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      // Filter based on current feed type
      switch (state.currentFeed) {
        case 'following':
          if (user) {
            const { data: following } = await supabase
              .from('follows')
              .select('following_id')
              .eq('follower_id', user.id);
            
            const followingIds = following?.map(f => f.following_id) || [];
            query = query.in('user_id', followingIds);
          }
          break;
        case 'shorts':
          query = query.eq('is_short', true);
          break;
        case 'trending':
          query = query.order('view_count', { ascending: false });
          break;
      }

      const { data: posts } = await query;

      if (posts) {
        dispatch({ type: 'SET_POSTS', payload: posts });
      }

      // Load live streams
      const { data: liveStreams } = await supabase
        .from('live_streams')
        .select(`
          *,
          user:amenity_profiles(*)
        `)
        .eq('is_live', true)
        .order('viewer_count', { ascending: false })
        .limit(10);

      if (liveStreams) {
        dispatch({ type: 'SET_LIVE_STREAMS', payload: liveStreams });
      }
    } catch (error) {
      console.error('Error refreshing feed:', error);
      dispatch({ type: 'SET_ERROR', payload: 'Failed to refresh feed' });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const createPost = async (content: string, mediaFiles?: File[]) => {
    if (!user) return;

    try {
      dispatch({ type: 'SET_LOADING', payload: true });

      let mediaUrls: string[] = [];
      let videoUrl: string | undefined;

      // Upload media files
      if (mediaFiles && mediaFiles.length > 0) {
        for (const file of mediaFiles) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${user.id}-${Date.now()}.${fileExt}`;
          const filePath = file.type.startsWith('video/') 
            ? `videos/${fileName}` 
            : `images/${fileName}`;

          const { data, error } = await supabase.storage
            .from('media')
            .upload(filePath, file);

          if (error) throw error;

          const { data: { publicUrl } } = supabase.storage
            .from('media')
            .getPublicUrl(data.path);

          if (file.type.startsWith('video/')) {
            videoUrl = publicUrl;
            // Trigger video transcoding
            await fetch('/api/transcode', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ videoUrl: publicUrl, userId: user.id }),
            });
          } else {
            mediaUrls.push(publicUrl);
          }
        }
      }

      // Create post
      const { data: post, error } = await supabase
        .from('posts')
        .insert({
          user_id: user.id,
          content,
          media_urls: mediaUrls,
          video_url: videoUrl,
          is_short: videoUrl ? false : false, // Determine based on video dimensions
        })
        .select(`
          *,
          user:amenity_profiles(*)
        `)
        .single();

      if (error) throw error;

      dispatch({ type: 'ADD_POST', payload: post });
      toast.success('Post created successfully!');
    } catch (error) {
      console.error('Error creating post:', error);
      toast.error('Failed to create post');
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const likePost = async (postId: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('likes')
        .insert({ user_id: user.id, post_id: postId });

      if (error && error.code !== '23505') throw error; // Ignore duplicate key errors

      dispatch({
        type: 'UPDATE_POST',
        payload: {
          id: postId,
          updates: {
            like_count: (state.posts.find(p => p.id === postId)?.like_count || 0) + 1,
            is_liked: true,
          },
        },
      });
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const startLiveStream = async (title: string, description: string, category: string) => {
    if (!user || !state.permissions.canLive) {
      throw new Error('No permission to start live stream');
    }

    try {
      const streamKey = `${user.id}-${Date.now()}`;

      const { data: stream, error } = await supabase
        .from('live_streams')
        .insert({
          user_id: user.id,
          title,
          description,
          stream_key: streamKey,
          category,
          is_live: true,
        })
        .select()
        .single();

      if (error) throw error;

      // Initialize WebRTC streaming
      const response = await fetch('/api/stream/start', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ streamKey, userId: user.id }),
      });

      if (!response.ok) throw new Error('Failed to start stream server');

      return streamKey;
    } catch (error) {
      console.error('Error starting live stream:', error);
      throw error;
    }
  };

  const sendTip = async (creatorId: string, amount: number, message?: string) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tips')
        .insert({
          from_user: user.id,
          to_user: creatorId,
          amount,
          message,
        });

      if (error) throw error;

      // Process payment through Stripe
      const response = await fetch('/api/payments/tip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ creatorId, amount, message }),
      });

      if (!response.ok) throw new Error('Payment failed');

      toast.success(`Tip sent successfully!`);
    } catch (error) {
      console.error('Error sending tip:', error);
      toast.error('Failed to send tip');
    }
  };

  const contextValue: AmenityContextType = {
    ...state,
    updateProfile: async () => {},
    followUser: async () => {},
    unfollowUser: async () => {},
    createPost,
    likePost,
    unlikePost: async () => {},
    commentPost: async () => {},
    sharePost: async () => {},
    deletePost: async () => {},
    uploadVideo: async () => '',
    startLiveStream,
    endLiveStream: async () => {},
    sendMessage: async () => {},
    createGroup: async () => {},
    joinGroup: async () => {},
    leaveGroup: async () => {},
    createTier: async () => {},
    subscribeTo: async () => {},
    unsubscribeFrom: async () => {},
    sendTip,
    markNotificationRead: async () => {},
    markAllNotificationsRead: async () => {},
    switchFeed: (feed) => dispatch({ type: 'SET_FEED', payload: feed }),
    refreshFeed,
    searchContent: async () => [],
    getTrendingContent: async () => [],
    getRecommendedCreators: async () => [],
    getAnalytics: async () => ({}),
    getEarnings: async () => ({}),
    requestPayout: async () => {},
    moderateContent: async () => {},
    banUser: async () => {},
  };

  return (
    <AmenityContext.Provider value={contextValue}>
      {children}
    </AmenityContext.Provider>
  );
}

export function useAmenity() {
  const context = useContext(AmenityContext);
  if (context === undefined) {
    throw new Error('useAmenity must be used within an AmenityProvider');
  }
  return context;
}