/**
 * AvatarCore.js
 * Global avatar management system (local + network avatars)
 */

import { VRAvatarIK } from '../../vr/vrAvatarIK.js';
import { VRNetworkAvatar } from '../../vr/vrNetworkAvatar.js';

export class AvatarCore {
  constructor(engine) {
    this.engine = engine;
    this.localAvatar = null;
    this.networkAvatars = new Map();
    this.enabled = false;
    
    console.log('🧑 Avatar Core initialized');
  }

  /**
   * Create local player avatar with IK
   * @param {Object} scene - Scene object (Three.js)
   */
  createLocalAvatar(scene) {
    if (this.engine.getCurrentRenderer() !== 'three') {
      console.warn('⚠️ Avatar IK only available for Three.js renderer');
      return null;
    }
    
    this.localAvatar = new VRAvatarIK(scene);
    this.enabled = true;
    console.log('✅ Local avatar created with IK');
    return this.localAvatar;
  }

  /**
   * Create network avatar for remote player
   * @param {string} playerId - Unique player ID
   * @param {Object} scene - Scene object
   * @param {string} name - Player name
   */
  createNetworkAvatar(playerId, scene, name = 'Player') {
    if (this.networkAvatars.has(playerId)) {
      console.warn('⚠️ Avatar already exists for player:', playerId);
      return this.networkAvatars.get(playerId);
    }
    
    const avatar = new VRNetworkAvatar(scene, name);
    this.networkAvatars.set(playerId, avatar);
    console.log('👤 Network avatar created:', playerId, name);
    return avatar;
  }

  /**
   * Remove network avatar
   * @param {string} playerId - Player ID
   */
  removeNetworkAvatar(playerId) {
    const avatar = this.networkAvatars.get(playerId);
    if (avatar) {
      avatar.dispose();
      this.networkAvatars.delete(playerId);
      console.log('🗑️ Network avatar removed:', playerId);
    }
  }

  /**
   * Update avatar with head tracking data
   * @param {Object} headRotation - Quaternion/Euler rotation
   * @param {Object} headPosition - Vector3 position
   */
  updateLocalAvatar(headRotation, headPosition) {
    if (this.localAvatar) {
      this.localAvatar.update(headRotation, headPosition);
    }
  }

  /**
   * Update network avatar position/rotation
   * @param {string} playerId - Player ID
   * @param {Object} position - {x, y, z}
   * @param {Object} rotation - {x, y, z, w}
   */
  updateNetworkAvatar(playerId, position, rotation) {
    const avatar = this.networkAvatars.get(playerId);
    if (avatar) {
      avatar.updatePosition(position, rotation);
    }
  }

  /**
   * Main update loop
   */
  update(delta) {
    if (!this.enabled) return;
    
    // Update local avatar with camera data
    if (this.localAvatar && this.engine.camera) {
      const headPos = this.engine.camera.position;
      const headRot = this.engine.camera.quaternion || this.engine.camera.rotation;
      this.updateLocalAvatar(headRot, headPos);
    }
    
    // Network avatars update themselves (interpolation, animations)
    // They're updated via updateNetworkAvatar() from MultiplayerCore
  }

  /**
   * Get local avatar
   */
  getLocalAvatar() {
    return this.localAvatar;
  }

  /**
   * Get network avatar by player ID
   */
  getNetworkAvatar(playerId) {
    return this.networkAvatars.get(playerId);
  }

  /**
   * Get all network avatars
   */
  getAllNetworkAvatars() {
    return Array.from(this.networkAvatars.values());
  }

  /**
   * Dispose all avatars
   */
  dispose() {
    if (this.localAvatar) {
      this.localAvatar.dispose();
      this.localAvatar = null;
    }
    
    this.networkAvatars.forEach(avatar => avatar.dispose());
    this.networkAvatars.clear();
    
    this.enabled = false;
    console.log('🗑️ All avatars disposed');
  }
}
