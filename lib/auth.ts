import { createClient } from './supabase/client';
import type { User, Session, AuthError } from '@supabase/supabase-js';

const supabase = createClient();

export interface AuthUser extends Omit<User, 'user_metadata'> {
  user_metadata: {
    full_name?: string;
    avatar_url?: string;
    subscription_tier?: string;
    creator_verified?: boolean;
  } & Record<string, any>;
}

export interface AuthState {
  user: AuthUser | null;
  session: Session | null;
  loading: boolean;
}

// Authentication functions
export const auth = {
  // Sign up
  async signUp(email: string, password: string, metadata?: Record<string, any>) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    });
    return { user: data.user, session: data.session, error };
  },

  // Sign in with email/password
  async signIn(email: string, password: string) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { user: data.user, session: data.session, error };
  },

  // Sign in with OAuth (Google, GitHub, etc.)
  async signInWithOAuth(provider: 'google' | 'github' | 'discord' | 'twitter') {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    return { data, error };
  },

  // Sign out
  async signOut() {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  async getUser() {
    const { data: { user }, error } = await supabase.auth.getUser();
    return { user, error };
  },

  // Get current session
  async getSession() {
    const { data: { session }, error } = await supabase.auth.getSession();
    return { session, error };
  },

  // Update user metadata
  async updateUser(updates: {
    email?: string;
    password?: string;
    data?: Record<string, any>;
  }) {
    const { data, error } = await supabase.auth.updateUser(updates);
    return { user: data.user, error };
  },

  // Reset password
  async resetPassword(email: string) {
    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/reset-password`,
    });
    return { data, error };
  },

  // Listen to auth changes
  onAuthStateChange(callback: (event: string, session: Session | null) => void) {
    return supabase.auth.onAuthStateChange(callback);
  },

  // Refresh session
  async refreshSession() {
    const { data, error } = await supabase.auth.refreshSession();
    return { session: data.session, user: data.user, error };
  },

  // Check if user is authenticated
  async isAuthenticated() {
    const { session } = await this.getSession();
    return !!session;
  },

  // Get user role/permissions
  async getUserRole() {
    const { user } = await this.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('user_roles')
      .select('role, permissions')
      .eq('user_id', user.id)
      .single();

    return { role: data?.role, permissions: data?.permissions, error };
  },

  // Update user profile
  async updateProfile(userId: string, updates: Record<string, any>) {
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    return { profile: data, error };
  },

  // Get user profile
  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    return { profile: data, error };
  },
};

// Helper functions
export const formatAuthError = (error: AuthError | null): string => {
  if (!error) return '';
  
  switch (error.message) {
    case 'Invalid login credentials':
      return 'Invalid email or password. Please check your credentials.';
    case 'Email not confirmed':
      return 'Please check your email and click the confirmation link.';
    case 'Password should be at least 6 characters':
      return 'Password must be at least 6 characters long.';
    case 'User already registered':
      return 'An account with this email already exists.';
    default:
      return error.message;
  }
};

export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidPassword = (password: string): boolean => {
  return password.length >= 6;
};

// Export named functions for compatibility
export const getUser = auth.getUser;
export const getSession = auth.getSession;
export const signIn = auth.signIn;
export const signUp = auth.signUp;
export const signOut = auth.signOut;

// Export types
export type { User, Session, AuthError } from '@supabase/supabase-js';