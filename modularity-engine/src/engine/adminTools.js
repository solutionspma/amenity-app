/**
 * MODULARITY SPATIAL OS - ADMIN TOOLS
 * Moderation, control, and management features
 */

export class AdminTools {
  constructor(scene, voiceChat, supabase) {
    this.scene = scene;
    this.voiceChat = voiceChat;
    this.supabase = supabase;
    this.isAdmin = false;
    this.moderators = new Set();
    this.mutedUsers = new Set();
    this.kickedUsers = new Set();
    this.lockedRoom = false;
  }

  initialize(userId) {
    console.log('🛡️ Initializing Admin Tools...');
    
    // Check if user is admin
    this.checkAdminStatus(userId);
    
    console.log('✅ Admin Tools initialized');
  }

  async checkAdminStatus(userId) {
    try {
      const { data, error } = await this.supabase
        .from('amenity_profiles')
        .select('role, permissions')
        .eq('id', userId)
        .single();

      if (data) {
        this.isAdmin = data.role === 'admin' || data.role === 'moderator';
        console.log(`🔑 Admin status: ${this.isAdmin}`);
      }
    } catch (error) {
      console.error('Failed to check admin status:', error);
    }
  }

  // USER MODERATION

  async muteUser(userId, duration = null) {
    if (!this.isAdmin) {
      console.warn('⚠️ Admin privileges required');
      return false;
    }

    this.mutedUsers.add(userId);
    
    // Force mute their voice chat
    if (this.voiceChat) {
      const pc = this.voiceChat.peerConnections.get(userId);
      if (pc) {
        const receivers = pc.getReceivers();
        receivers.forEach(receiver => {
          if (receiver.track.kind === 'audio') {
            receiver.track.enabled = false;
          }
        });
      }
    }

    // Log to database
    await this.logModAction('mute', userId, { duration });

    // Broadcast to room
    this.broadcastModAction('user_muted', { userId, duration });

    console.log(`🔇 Muted user: ${userId}`);
    
    // Auto-unmute after duration
    if (duration) {
      setTimeout(() => {
        this.unmuteUser(userId);
      }, duration);
    }

    return true;
  }

  async unmuteUser(userId) {
    if (!this.isAdmin) return false;

    this.mutedUsers.delete(userId);

    // Log to database
    await this.logModAction('unmute', userId);

    // Broadcast to room
    this.broadcastModAction('user_unmuted', { userId });

    console.log(`🔊 Unmuted user: ${userId}`);
    return true;
  }

  async kickUser(userId, reason = '') {
    if (!this.isAdmin) return false;

    this.kickedUsers.add(userId);

    // Disconnect voice
    if (this.voiceChat) {
      this.voiceChat.disconnectPeer(userId);
    }

    // Remove from scene
    this.removeUserFromScene(userId);

    // Log to database
    await this.logModAction('kick', userId, { reason });

    // Broadcast to room
    this.broadcastModAction('user_kicked', { userId, reason });

    // Send notification to user
    this.sendNotification(userId, 'You have been removed from the room', reason);

    console.log(`👢 Kicked user: ${userId} - Reason: ${reason}`);
    return true;
  }

  async banUser(userId, reason = '', duration = null) {
    if (!this.isAdmin) return false;

    // Add to ban list
    await this.supabase
      .from('room_bans')
      .insert({
        user_id: userId,
        banned_by: this.getCurrentAdminId(),
        reason: reason,
        expires_at: duration ? new Date(Date.now() + duration).toISOString() : null
      });

    // Kick immediately
    await this.kickUser(userId, `Banned: ${reason}`);

    console.log(`🚫 Banned user: ${userId} - Duration: ${duration || 'permanent'}`);
    return true;
  }

  // ROOM CONTROL

  async lockRoom() {
    if (!this.isAdmin) return false;

    this.lockedRoom = true;

    // Update room status in database
    await this.supabase
      .from('rooms')
      .update({ locked: true })
      .eq('id', this.getCurrentRoomId());

    // Broadcast to all
    this.broadcastModAction('room_locked', {});

    console.log('🔒 Room locked');
    return true;
  }

  async unlockRoom() {
    if (!this.isAdmin) return false;

    this.lockedRoom = false;

    await this.supabase
      .from('rooms')
      .update({ locked: false })
      .eq('id', this.getCurrentRoomId());

    this.broadcastModAction('room_unlocked', {});

    console.log('🔓 Room unlocked');
    return true;
  }

  async setRoomCapacity(maxUsers) {
    if (!this.isAdmin) return false;

    await this.supabase
      .from('rooms')
      .update({ max_users: maxUsers })
      .eq('id', this.getCurrentRoomId());

    console.log(`👥 Room capacity set to: ${maxUsers}`);
    return true;
  }

  // BROADCASTING

  async broadcastMessage(message, type = 'announcement') {
    if (!this.isAdmin) return false;

    // Send to all users in room
    await this.supabase
      .from('room_messages')
      .insert({
        room_id: this.getCurrentRoomId(),
        user_id: this.getCurrentAdminId(),
        message: message,
        type: type,
        timestamp: new Date().toISOString()
      });

    // Dispatch local event
    window.dispatchEvent(new CustomEvent('admin-broadcast', {
      detail: { message, type }
    }));

    console.log(`📢 Broadcast: ${message}`);
    return true;
  }

  async sendNotification(userId, title, message) {
    await this.supabase
      .from('notifications')
      .insert({
        user_id: userId,
        title: title,
        message: message,
        type: 'mod_action',
        timestamp: new Date().toISOString()
      });
  }

  // SCENE MANIPULATION

  removeUserFromScene(userId) {
    // Find and remove user's avatar
    const userMeshes = this.scene.meshes.filter(mesh => 
      mesh.metadata && mesh.metadata.userId === userId
    );

    userMeshes.forEach(mesh => {
      mesh.dispose();
    });
  }

  teleportUser(userId, position) {
    if (!this.isAdmin) return false;

    // Find user's avatar
    const avatar = this.scene.meshes.find(mesh =>
      mesh.metadata && mesh.metadata.userId === userId
    );

    if (avatar) {
      avatar.position = position.clone();
      
      // Notify user
      this.broadcastModAction('user_teleported', {
        userId,
        position: { x: position.x, y: position.y, z: position.z }
      });

      console.log(`📍 Teleported user ${userId} to ${position}`);
      return true;
    }

    return false;
  }

  // PERMISSIONS

  async grantModerator(userId) {
    if (!this.isAdmin) return false;

    this.moderators.add(userId);

    await this.supabase
      .from('amenity_profiles')
      .update({ role: 'moderator' })
      .eq('id', userId);

    this.broadcastModAction('moderator_granted', { userId });

    console.log(`⭐ Granted moderator to: ${userId}`);
    return true;
  }

  async revokeModerator(userId) {
    if (!this.isAdmin) return false;

    this.moderators.delete(userId);

    await this.supabase
      .from('amenity_profiles')
      .update({ role: 'user' })
      .eq('id', userId);

    this.broadcastModAction('moderator_revoked', { userId });

    console.log(`⚠️ Revoked moderator from: ${userId}`);
    return true;
  }

  // LOGGING

  async logModAction(action, targetUserId, metadata = {}) {
    await this.supabase
      .from('mod_logs')
      .insert({
        moderator_id: this.getCurrentAdminId(),
        action: action,
        target_user_id: targetUserId,
        room_id: this.getCurrentRoomId(),
        metadata: metadata,
        timestamp: new Date().toISOString()
      });
  }

  async getModLogs(limit = 50) {
    const { data, error } = await this.supabase
      .from('mod_logs')
      .select('*')
      .order('timestamp', { ascending: false })
      .limit(limit);

    return data || [];
  }

  // HELPERS

  broadcastModAction(action, data) {
    window.dispatchEvent(new CustomEvent('mod-action', {
      detail: { action, data }
    }));
  }

  getCurrentAdminId() {
    return localStorage.getItem('user_id') || 'admin';
  }

  getCurrentRoomId() {
    return localStorage.getItem('current_room_id') || 'default';
  }

  isUserMuted(userId) {
    return this.mutedUsers.has(userId);
  }

  isUserKicked(userId) {
    return this.kickedUsers.has(userId);
  }

  isRoomLocked() {
    return this.lockedRoom;
  }

  dispose() {
    this.mutedUsers.clear();
    this.kickedUsers.clear();
    this.moderators.clear();
    console.log('Admin Tools disposed');
  }
}

export default AdminTools;
