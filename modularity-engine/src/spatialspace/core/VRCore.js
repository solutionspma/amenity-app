/**
 * VRCore.js
 * Unified VR system for native VRKit and JavaScript VR
 */

import { VRInteraction } from '../../vr/vrInteraction.js';
import { VRAvatarIK } from '../../vr/vrAvatarIK.js';

export class VRCore {
  constructor(engine) {
    this.engine = engine;
    this.enabled = false;
    this.isNativeAvailable = !!window.Capacitor?.Plugins?.VRBridge;
    this.interact = null;
    this.ik = null;
    
    console.log('🥽 VR Core initialized (Native:', this.isNativeAvailable, ')');
  }

  /**
   * Enter native VRKit mode (iOS app only)
   */
  enterNativeVR() {
    if (!this.isNativeAvailable) {
      console.warn('⚠️ Native VR not available');
      return;
    }
    
    window.Capacitor.Plugins.VRBridge.enterVR()
      .then(() => {
        this.enabled = true;
        console.log('✅ Native VR mode activated');
      })
      .catch(err => console.error('❌ VR error:', err));
  }

  /**
   * Initialize JavaScript VR systems
   * @param {Object} scene - Three.js scene
   * @param {Object} camera - Three.js camera
   */
  initJSVR(scene, camera) {
    if (this.engine.getCurrentRenderer() !== 'three') {
      console.warn('⚠️ JS VR only available for Three.js renderer');
      return;
    }
    
    this.interact = new VRInteraction(scene, camera);
    this.ik = new VRAvatarIK(scene);
    this.enabled = true;
    
    console.log('✅ JavaScript VR systems initialized');
  }

  /**
   * Load world data into VR
   * @param {Object} worldData - World configuration
   */
  loadWorld(worldData) {
    if (this.isNativeAvailable) {
      window.Capacitor.Plugins.VRBridge.loadWorld({ world: worldData });
    }
    console.log('🌍 VR world loaded:', worldData);
  }

  /**
   * Update VR systems
   */
  update(delta) {
    if (!this.enabled) return;
    
    if (this.interact) {
      this.interact.update(delta);
    }
    
    if (this.ik && this.engine.camera) {
      // Update IK with head position/rotation
      const headPos = this.engine.camera.position;
      const headRot = this.engine.camera.quaternion;
      this.ik.update(headRot, headPos);
    }
  }

  /**
   * Exit VR mode
   */
  exitVR() {
    if (this.isNativeAvailable) {
      window.Capacitor.Plugins.VRBridge.exitVR();
    }
    this.enabled = false;
    console.log('🚪 Exited VR mode');
  }

  dispose() {
    this.interact = null;
    this.ik = null;
    this.enabled = false;
  }
}
