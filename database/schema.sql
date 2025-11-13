-- Amenity App Database Schema
-- Complete social media platform with revenue sharing

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users/Profiles Table (Enhanced)
CREATE TABLE amenity_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  username VARCHAR(50) UNIQUE NOT NULL,
  display_name VARCHAR(100) NOT NULL,
  avatar_url TEXT,
  banner_url TEXT,
  bio TEXT,
  church_affiliation VARCHAR(100),
  location VARCHAR(100),
  website_url TEXT,
  
  -- Account Status
  subscription_tier VARCHAR(20) DEFAULT 'free' CHECK (subscription_tier IN ('free', 'premium', 'business', 'enterprise')),
  creator_status BOOLEAN DEFAULT FALSE,
  verified BOOLEAN DEFAULT FALSE,
  is_live BOOLEAN DEFAULT FALSE,
  
  -- Social Stats
  follower_count INTEGER DEFAULT 0,
  following_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  
  -- Financial
  total_earnings BIGINT DEFAULT 0, -- in cents
  pending_earnings BIGINT DEFAULT 0, -- in cents
  total_payouts BIGINT DEFAULT 0, -- in cents
  stripe_account_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  
  -- Settings
  privacy_setting VARCHAR(20) DEFAULT 'public' CHECK (privacy_setting IN ('public', 'church', 'followers', 'private')),
  notification_settings JSONB DEFAULT '{"posts": true, "likes": true, "comments": true, "follows": true, "tips": true}',
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_active TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Churches Table
CREATE TABLE churches (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(200) NOT NULL,
  description TEXT,
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(50),
  country VARCHAR(50),
  website_url TEXT,
  logo_url TEXT,
  banner_url TEXT,
  
  -- Admin
  admin_user_id UUID REFERENCES amenity_profiles(id),
  
  -- Financial
  stripe_account_id VARCHAR(255),
  total_tithes BIGINT DEFAULT 0,
  
  -- Settings
  is_verified BOOLEAN DEFAULT FALSE,
  member_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Posts Table (Enhanced)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Content
  content TEXT,
  media_urls TEXT[], -- Array of image URLs
  video_url TEXT,
  thumbnail_url TEXT,
  hls_url TEXT, -- For adaptive streaming
  
  -- Classification
  is_short BOOLEAN DEFAULT FALSE,
  category VARCHAR(50),
  tags TEXT[],
  
  -- Privacy
  visibility VARCHAR(20) DEFAULT 'public' CHECK (visibility IN ('public', 'followers', 'subscribers', 'private')),
  is_sensitive BOOLEAN DEFAULT FALSE,
  
  -- Engagement Stats
  like_count INTEGER DEFAULT 0,
  comment_count INTEGER DEFAULT 0,
  share_count INTEGER DEFAULT 0,
  view_count INTEGER DEFAULT 0,
  
  -- Monetization
  is_premium BOOLEAN DEFAULT FALSE, -- Requires subscription
  tip_count INTEGER DEFAULT 0,
  total_tips BIGINT DEFAULT 0,
  
  -- Location
  location VARCHAR(200),
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Moderation
  is_flagged BOOLEAN DEFAULT FALSE,
  moderation_status VARCHAR(20) DEFAULT 'approved' CHECK (moderation_status IN ('pending', 'approved', 'rejected')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shorts Table (Vertical Videos)
CREATE TABLE shorts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  duration INTEGER, -- in seconds
  aspect_ratio DECIMAL(3,2) DEFAULT 0.56, -- 9:16
  
  -- Algorithm metrics
  completion_rate DECIMAL(5,4) DEFAULT 0,
  replay_count INTEGER DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Live Streams Table
CREATE TABLE live_streams (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Stream Info
  title VARCHAR(200) NOT NULL,
  description TEXT,
  stream_key VARCHAR(100) UNIQUE NOT NULL,
  rtmp_url TEXT,
  hls_url TEXT,
  
  -- Status
  is_live BOOLEAN DEFAULT FALSE,
  viewer_count INTEGER DEFAULT 0,
  max_viewers INTEGER DEFAULT 0,
  
  -- Classification
  category VARCHAR(50),
  tags TEXT[],
  is_premium BOOLEAN DEFAULT FALSE,
  
  -- Timing
  started_at TIMESTAMP WITH TIME ZONE,
  ended_at TIMESTAMP WITH TIME ZONE,
  duration INTEGER, -- in seconds
  
  -- Monetization
  tip_count INTEGER DEFAULT 0,
  total_tips BIGINT DEFAULT 0,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Creator Tiers Table
CREATE TABLE creator_tiers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Tier Details
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price BIGINT NOT NULL, -- in cents per month
  
  -- Perks
  perks TEXT[],
  can_access_premium_posts BOOLEAN DEFAULT FALSE,
  can_access_live_streams BOOLEAN DEFAULT FALSE,
  can_direct_message BOOLEAN DEFAULT FALSE,
  custom_badge TEXT,
  
  -- Stats
  subscriber_count INTEGER DEFAULT 0,
  
  -- Stripe
  stripe_price_id VARCHAR(255),
  
  -- Status
  is_active BOOLEAN DEFAULT TRUE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Subscriptions Table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  creator_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  tier_id UUID REFERENCES creator_tiers(id) ON DELETE SET NULL,
  
  -- Subscription Details
  amount BIGINT NOT NULL, -- in cents
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'paused')),
  
  -- Stripe
  stripe_subscription_id VARCHAR(255),
  stripe_customer_id VARCHAR(255),
  
  -- Billing
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, creator_id)
);

-- Comments Table
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  -- Content
  content TEXT NOT NULL,
  media_url TEXT,
  
  -- Stats
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  
  -- Moderation
  is_flagged BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Likes Table
CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES comments(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT likes_target_check CHECK (
    (post_id IS NOT NULL AND comment_id IS NULL) OR 
    (post_id IS NULL AND comment_id IS NOT NULL)
  ),
  UNIQUE(user_id, post_id),
  UNIQUE(user_id, comment_id)
);

-- Follows Table
CREATE TABLE follows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  follower_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  following_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(follower_id, following_id),
  CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- Groups Table
CREATE TABLE groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name VARCHAR(100) NOT NULL,
  description TEXT,
  avatar_url TEXT,
  banner_url TEXT,
  
  -- Classification
  category VARCHAR(50) CHECK (category IN ('ministry', 'fan_community', 'creative_circle', 'general')),
  tags TEXT[],
  
  -- Privacy
  is_private BOOLEAN DEFAULT FALSE,
  requires_approval BOOLEAN DEFAULT FALSE,
  
  -- Stats
  member_count INTEGER DEFAULT 0,
  post_count INTEGER DEFAULT 0,
  
  -- Admin
  created_by UUID NOT NULL REFERENCES amenity_profiles(id),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Group Members Table
CREATE TABLE group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID NOT NULL REFERENCES groups(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Role
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'moderator', 'member')),
  
  -- Status
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'banned')),
  
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(group_id, user_id)
);

-- Messages Table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL,
  sender_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Content
  content TEXT,
  media_url TEXT,
  message_type VARCHAR(20) DEFAULT 'text' CHECK (message_type IN ('text', 'image', 'video', 'file')),
  
  -- Status
  is_read BOOLEAN DEFAULT FALSE,
  is_edited BOOLEAN DEFAULT FALSE,
  
  -- Reactions
  reactions JSONB DEFAULT '{}',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversations Table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Type
  type VARCHAR(20) DEFAULT 'direct' CHECK (type IN ('direct', 'group')),
  name VARCHAR(100),
  
  -- Participants (for direct messages)
  participant_ids UUID[],
  
  -- Group reference
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  
  -- Stats
  message_count INTEGER DEFAULT 0,
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tips Table
CREATE TABLE tips (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  from_user UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  to_user UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Amount
  amount BIGINT NOT NULL, -- in cents
  platform_fee BIGINT NOT NULL, -- in cents
  
  -- Optional message
  message TEXT,
  
  -- Stripe
  stripe_payment_intent VARCHAR(255),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Tithes Table (Church donations)
CREATE TABLE tithes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  church_id UUID NOT NULL REFERENCES churches(id) ON DELETE CASCADE,
  
  -- Amount
  amount BIGINT NOT NULL, -- in cents
  platform_fee BIGINT NOT NULL, -- in cents
  
  -- Recurring
  is_recurring BOOLEAN DEFAULT FALSE,
  frequency VARCHAR(20) CHECK (frequency IN ('weekly', 'monthly')),
  
  -- Stripe
  stripe_payment_intent VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE
);

-- Events Table
CREATE TABLE events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Event Details
  title VARCHAR(200) NOT NULL,
  description TEXT,
  banner_url TEXT,
  
  -- Timing
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE,
  timezone VARCHAR(50),
  
  -- Location
  is_online BOOLEAN DEFAULT FALSE,
  venue_name VARCHAR(200),
  venue_address TEXT,
  stream_url TEXT,
  
  -- Tickets
  is_paid BOOLEAN DEFAULT FALSE,
  ticket_price_general BIGINT, -- in cents
  ticket_price_vip BIGINT,
  ticket_price_premium BIGINT,
  max_tickets_general INTEGER,
  max_tickets_vip INTEGER,
  max_tickets_premium INTEGER,
  
  -- Stats
  attendee_count INTEGER DEFAULT 0,
  
  -- Status
  status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'live', 'ended', 'cancelled')),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Event Tickets Table
CREATE TABLE event_tickets (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Ticket Details
  ticket_type VARCHAR(20) CHECK (ticket_type IN ('general', 'vip', 'premium')),
  price_paid BIGINT NOT NULL, -- in cents
  platform_fee BIGINT NOT NULL,
  
  -- Stripe
  stripe_payment_intent VARCHAR(255),
  
  -- Status
  status VARCHAR(20) DEFAULT 'reserved' CHECK (status IN ('reserved', 'confirmed', 'cancelled', 'refunded')),
  
  -- Access
  ticket_code VARCHAR(50) UNIQUE,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP WITH TIME ZONE,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(event_id, user_id, ticket_type)
);

-- Payouts Table
CREATE TABLE payouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  creator_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Amount
  amount BIGINT NOT NULL, -- in cents
  
  -- Stripe
  stripe_transfer_id VARCHAR(255),
  
  -- Status
  status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  
  -- Timing
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  processed_at TIMESTAMP WITH TIME ZONE,
  
  -- Notes
  failure_reason TEXT
);

-- Notifications Table
CREATE TABLE notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Type
  type VARCHAR(30) CHECK (type IN ('like', 'comment', 'follow', 'subscription', 'tip', 'live', 'system', 'payout', 'tithe')),
  
  -- Content
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  
  -- Data
  data JSONB,
  
  -- Status
  read BOOLEAN DEFAULT FALSE,
  
  -- Links
  action_url TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User Permissions Table
CREATE TABLE user_permissions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Permission
  permission VARCHAR(50) NOT NULL CHECK (permission IN (
    'upload', 'live_stream', 'create_groups', 'moderate', 'jay_i_access', 
    'admin', 'super_admin', 'create_events', 'manage_tiers'
  )),
  
  -- Granted by
  granted_by UUID REFERENCES amenity_profiles(id),
  granted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Expiry (optional)
  expires_at TIMESTAMP WITH TIME ZONE,
  
  UNIQUE(user_id, permission)
);

-- Analytics Tables
CREATE TABLE user_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  -- Date
  date DATE NOT NULL,
  
  -- Metrics
  profile_views INTEGER DEFAULT 0,
  post_views INTEGER DEFAULT 0,
  video_views INTEGER DEFAULT 0,
  new_followers INTEGER DEFAULT 0,
  lost_followers INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,4) DEFAULT 0,
  
  -- Revenue
  tips_received BIGINT DEFAULT 0,
  subscription_revenue BIGINT DEFAULT 0,
  event_revenue BIGINT DEFAULT 0,
  
  UNIQUE(user_id, date)
);

CREATE TABLE platform_analytics (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  
  -- Date
  date DATE NOT NULL UNIQUE,
  
  -- User Metrics
  daily_active_users INTEGER DEFAULT 0,
  new_users INTEGER DEFAULT 0,
  total_users INTEGER DEFAULT 0,
  
  -- Content Metrics
  posts_created INTEGER DEFAULT 0,
  videos_uploaded INTEGER DEFAULT 0,
  live_streams INTEGER DEFAULT 0,
  
  -- Revenue Metrics
  total_revenue BIGINT DEFAULT 0,
  platform_fees BIGINT DEFAULT 0,
  creator_payouts BIGINT DEFAULT 0,
  
  -- Engagement
  total_likes INTEGER DEFAULT 0,
  total_comments INTEGER DEFAULT 0,
  total_shares INTEGER DEFAULT 0
);

-- Watch History Table
CREATE TABLE watch_history (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  post_id UUID NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  
  -- Watch Details
  watch_duration INTEGER, -- seconds watched
  total_duration INTEGER, -- total video length
  completion_percentage DECIMAL(5,2),
  
  -- Session
  session_id UUID,
  device_type VARCHAR(20),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(user_id, post_id, session_id)
);

-- Blocked Users Table
CREATE TABLE blocked_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  blocker_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  blocked_id UUID NOT NULL REFERENCES amenity_profiles(id) ON DELETE CASCADE,
  
  reason VARCHAR(200),
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  UNIQUE(blocker_id, blocked_id)
);

-- Create Indexes for Performance
CREATE INDEX idx_posts_user_id ON posts(user_id);
CREATE INDEX idx_posts_created_at ON posts(created_at DESC);
CREATE INDEX idx_posts_visibility ON posts(visibility);
CREATE INDEX idx_likes_post_id ON likes(post_id);
CREATE INDEX idx_likes_user_id ON likes(user_id);
CREATE INDEX idx_comments_post_id ON comments(post_id);
CREATE INDEX idx_follows_follower ON follows(follower_id);
CREATE INDEX idx_follows_following ON follows(following_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, read);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_subscriptions_creator ON subscriptions(creator_id);
CREATE INDEX idx_analytics_user_date ON user_analytics(user_id, date);
CREATE INDEX idx_watch_history_user ON watch_history(user_id);

-- Create Functions and Triggers
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_amenity_profiles_updated_at BEFORE UPDATE ON amenity_profiles FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_posts_updated_at BEFORE UPDATE ON posts FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_creator_tiers_updated_at BEFORE UPDATE ON creator_tiers FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();
CREATE TRIGGER update_groups_updated_at BEFORE UPDATE ON groups FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Function to update follower counts
CREATE OR REPLACE FUNCTION update_follower_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' THEN
        -- Increment following count for follower
        UPDATE amenity_profiles 
        SET following_count = following_count + 1 
        WHERE id = NEW.follower_id;
        
        -- Increment follower count for followed user
        UPDATE amenity_profiles 
        SET follower_count = follower_count + 1 
        WHERE id = NEW.following_id;
        
        RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
        -- Decrement following count for follower
        UPDATE amenity_profiles 
        SET following_count = following_count - 1 
        WHERE id = OLD.follower_id;
        
        -- Decrement follower count for followed user
        UPDATE amenity_profiles 
        SET follower_count = follower_count - 1 
        WHERE id = OLD.following_id;
        
        RETURN OLD;
    END IF;
    
    RETURN NULL;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_follower_counts_trigger
    AFTER INSERT OR DELETE ON follows
    FOR EACH ROW EXECUTE PROCEDURE update_follower_counts();

-- Row Level Security Policies
ALTER TABLE amenity_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Users can view public profiles and their own
CREATE POLICY "Public profiles are viewable by everyone" ON amenity_profiles
    FOR SELECT USING (privacy_setting = 'public' OR auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "Users can update own profile" ON amenity_profiles
    FOR UPDATE USING (auth.uid() = id);

-- Posts visibility based on privacy settings
CREATE POLICY "Posts visibility" ON posts FOR SELECT USING (
    visibility = 'public' OR 
    (visibility = 'followers' AND EXISTS (
        SELECT 1 FROM follows WHERE follower_id = auth.uid() AND following_id = posts.user_id
    )) OR
    user_id = auth.uid()
);

-- Users can only see their own notifications
CREATE POLICY "Users can view own notifications" ON notifications
    FOR SELECT USING (user_id = auth.uid());

-- Initial Data
INSERT INTO churches (name, description, admin_user_id) VALUES 
('Altar Life International Ministries', 'A vibrant community spreading faith and hope', NULL);

-- Grant permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO postgres, authenticated;