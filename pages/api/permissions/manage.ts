import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@supabase/supabase-js';
import { getUser } from '@/lib/auth';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface PermissionRequest {
  userId: string;
  permission: string;
  action: 'grant' | 'revoke';
  expiresAt?: string;
  grantedBy: string;
}

// Permission levels hierarchy
const PERMISSION_HIERARCHY: Record<string, string[]> = {
  'super_admin': ['admin', 'moderate', 'jay_i_access', 'upload', 'live_stream', 'create_groups', 'create_events', 'manage_tiers'],
  'admin': ['moderate', 'upload', 'live_stream', 'create_groups', 'create_events'],
  'moderate': ['upload', 'live_stream'],
  'jay_i_access': [], // Special permission for JAY-I AI assistant
  'creator': ['upload', 'live_stream', 'manage_tiers'],
  'premium': ['upload', 'live_stream'],
  'basic': ['upload'],
};

// Default permissions by subscription tier
const TIER_PERMISSIONS = {
  'free': ['upload'],
  'premium': ['upload', 'live_stream'],
  'business': ['upload', 'live_stream', 'create_groups', 'create_events', 'manage_tiers'],
  'enterprise': ['upload', 'live_stream', 'create_groups', 'create_events', 'manage_tiers', 'jay_i_access'],
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { user: currentUser } = await getUser();
    
    if (!currentUser) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    if (req.method === 'GET') {
      // Get user permissions
      const { userId } = req.query;
      const targetUserId = userId || currentUser.id;

      // Check if current user can view permissions
      const canView = await hasPermission(currentUser.id, 'admin') || 
                     currentUser.id === targetUserId;

      if (!canView) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      const permissions = await getUserPermissions(targetUserId as string);
      
      res.status(200).json({ permissions });

    } else if (req.method === 'POST') {
      // Grant or revoke permission
      const { userId, permission, action, expiresAt }: PermissionRequest = req.body;

      // Check if current user has permission to manage permissions
      const canManage = await hasPermission(currentUser.id, 'admin');
      
      if (!canManage) {
        return res.status(403).json({ error: 'Insufficient permissions to manage permissions' });
      }

      // Super admin check for sensitive permissions
      const sensitivePermissions = ['admin', 'super_admin', 'jay_i_access'];
      if (sensitivePermissions.includes(permission)) {
        const isSuperAdmin = await hasPermission(currentUser.id, 'super_admin');
        if (!isSuperAdmin) {
          return res.status(403).json({ error: 'Super admin access required' });
        }
      }

      if (action === 'grant') {
        await grantPermission(userId, permission, currentUser.id, expiresAt);
        
        // Auto-grant dependent permissions
        const dependentPermissions = getDependentPermissions(permission);
        for (const depPermission of dependentPermissions) {
          await grantPermission(userId, depPermission, currentUser.id);
        }

        // Log permission grant
        await supabase
          .from('permission_logs')
          .insert({
            user_id: userId,
            permission,
            action: 'granted',
            granted_by: currentUser.id,
            expires_at: expiresAt,
          });

        // Create notification
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'system',
            title: 'New Permission Granted',
            message: `You have been granted ${permission} permission`,
            data: { permission, granted_by: currentUser.id },
          });

      } else if (action === 'revoke') {
        await revokePermission(userId, permission);

        // Log permission revoke
        await supabase
          .from('permission_logs')
          .insert({
            user_id: userId,
            permission,
            action: 'revoked',
            granted_by: currentUser.id,
          });

        // Create notification
        await supabase
          .from('notifications')
          .insert({
            user_id: userId,
            type: 'system',
            title: 'Permission Revoked',
            message: `Your ${permission} permission has been revoked`,
            data: { permission, revoked_by: currentUser.id },
          });
      }

      res.status(200).json({ success: true, message: `Permission ${action}ed successfully` });

    } else if (req.method === 'PUT') {
      // Bulk update permissions for subscription tier
      const { userId, tier } = req.body;

      const canManage = await hasPermission(currentUser.id, 'admin');
      
      if (!canManage) {
        return res.status(403).json({ error: 'Insufficient permissions' });
      }

      // Remove all non-permanent permissions
      await supabase
        .from('user_permissions')
        .delete()
        .eq('user_id', userId)
        .not('permission', 'in', '(admin,super_admin,moderate)');

      // Grant tier-based permissions
      const tierPermissions = (TIER_PERMISSIONS as any)[tier] || [];
      
      for (const permission of tierPermissions) {
        await grantPermission(userId, permission, currentUser.id);
      }

      // Update user tier
      await supabase
        .from('amenity_profiles')
        .update({ subscription_tier: tier })
        .eq('id', userId);

      res.status(200).json({ 
        success: true, 
        message: `Permissions updated for ${tier} tier`,
        permissions: tierPermissions,
      });

    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }

  } catch (error) {
    console.error('Permission management error:', error);
    res.status(500).json({ error: 'Failed to manage permissions' });
  }
}

// Helper Functions

async function getUserPermissions(userId: string): Promise<string[]> {
  const { data: permissions } = await supabase
    .from('user_permissions')
    .select('permission')
    .eq('user_id', userId)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`);

  return permissions?.map(p => p.permission) || [];
}

async function hasPermission(userId: string, permission: string): Promise<boolean> {
  // Check direct permission
  const { data: directPermission } = await supabase
    .from('user_permissions')
    .select('permission')
    .eq('user_id', userId)
    .eq('permission', permission)
    .or(`expires_at.is.null,expires_at.gt.${new Date().toISOString()}`)
    .single();

  if (directPermission) return true;

  // Check hierarchical permissions
  const userPermissions = await getUserPermissions(userId);
  
  for (const userPerm of userPermissions) {
    if (PERMISSION_HIERARCHY[userPerm]?.includes(permission)) {
      return true;
    }
  }

  return false;
}

async function grantPermission(
  userId: string, 
  permission: string, 
  grantedBy: string, 
  expiresAt?: string
) {
  const { error } = await supabase
    .from('user_permissions')
    .upsert({
      user_id: userId,
      permission,
      granted_by: grantedBy,
      expires_at: expiresAt,
    });

  if (error && error.code !== '23505') { // Ignore duplicate errors
    throw error;
  }
}

async function revokePermission(userId: string, permission: string) {
  const { error } = await supabase
    .from('user_permissions')
    .delete()
    .eq('user_id', userId)
    .eq('permission', permission);

  if (error) throw error;
}

function getDependentPermissions(permission: string): string[] {
  // Return permissions that should be automatically granted with this permission
  const dependencies: Record<string, string[]> = {
    'live_stream': ['upload'],
    'create_events': ['upload'],
    'manage_tiers': ['upload'],
    'moderate': ['upload'],
    'admin': ['upload', 'moderate'],
    'super_admin': ['upload', 'moderate', 'admin'],
  };

  return dependencies[permission] || [];
}

// JAY-I Access Control Functions
export async function checkJayIAccess(userId: string): Promise<boolean> {
  return await hasPermission(userId, 'jay_i_access');
}

export async function logJayIUsage(userId: string, query: string, response: string) {
  await supabase
    .from('jay_i_usage_logs')
    .insert({
      user_id: userId,
      query,
      response,
      timestamp: new Date().toISOString(),
    });
}

// Permission middleware for API routes
export function requirePermission(permission: string) {
  return async (req: NextApiRequest, res: NextApiResponse, next: Function) => {
    try {
      const { user } = await getUser();
      
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const hasAccess = await hasPermission(user.id, permission);
      
      if (!hasAccess) {
        return res.status(403).json({ 
          error: 'Insufficient permissions', 
          required: permission 
        });
      }

      // Add user and permissions to request object
      (req as any).user = user;
      (req as any).permissions = await getUserPermissions(user.id);
      
      next();
    } catch (error) {
      console.error('Permission middleware error:', error);
      res.status(500).json({ error: 'Permission check failed' });
    }
  };
}