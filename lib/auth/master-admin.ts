import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { supabase } from '@/lib/supabase/client';

// Master admin credentials
const MASTER_ADMIN = {
  username: 'Jason Harris',
  email: 'Solutions@Pitchmarketing.agency', 
  password: 'Harris', // Will be hashed
  role: 'master_admin'
};

export async function initializeMasterAdmin() {
  try {
    // Check if master admin already exists
    const { data: existingAdmin } = await supabase
      .from('users')
      .select('id')
      .eq('email', MASTER_ADMIN.email)
      .single();

    if (existingAdmin) {
      console.log('Master admin already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(MASTER_ADMIN.password, 12);

    // Create master admin user
    const { data: newAdmin, error } = await supabase
      .from('users')
      .insert({
        username: MASTER_ADMIN.username,
        email: MASTER_ADMIN.email,
        password_hash: hashedPassword,
        role: MASTER_ADMIN.role,
        is_verified: true,
        created_at: new Date().toISOString(),
        profile: {
          display_name: 'Jason Harris',
          bio: 'Master Administrator - Pitch Modular Spaces',
          company: 'Pitch Marketing Strategies & Public Relations LLC',
          location: 'Digital Innovation Hub',
          website: 'https://pitchmarketing.agency'
        }
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    console.log('Master admin created successfully:', newAdmin);
    return newAdmin;
  } catch (error) {
    console.error('Error initializing master admin:', error);
    throw error;
  }
}

export async function authenticateMasterAdmin(email: string, password: string) {
  try {
    // Get user from database
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .eq('role', 'master_admin')
      .single();

    if (error || !user) {
      throw new Error('Invalid credentials');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        userId: user.id, 
        email: user.email, 
        role: user.role,
        username: user.username
      },
      process.env.JWT_SECRET || 'pitch-modular-spaces-secret',
      { expiresIn: '7d' }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        profile: user.profile
      },
      token
    };
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}

export async function verifyMasterAdminToken(token: string) {
  try {
    const decoded = jwt.verify(
      token, 
      process.env.JWT_SECRET || 'pitch-modular-spaces-secret'
    ) as any;

    if (decoded.role !== 'master_admin') {
      throw new Error('Insufficient permissions');
    }

    // Get updated user info
    const { data: user, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', decoded.userId)
      .eq('role', 'master_admin')
      .single();

    if (error || !user) {
      throw new Error('User not found');
    }

    return {
      userId: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      profile: user.profile
    };
  } catch (error) {
    console.error('Token verification error:', error);
    throw error;
  }
}

// Initialize master admin on server startup
if (typeof window === 'undefined') {
  initializeMasterAdmin().catch(console.error);
}