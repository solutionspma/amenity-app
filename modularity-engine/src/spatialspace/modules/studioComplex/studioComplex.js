/**
 * studioComplex.js
 * Professional studio module configuration
 * Wraps existing Three.js studio implementation
 */

import { StudioManager } from '../../../studio/studioManager.js';

export const StudioComplex = {
  name: 'StudioComplex',
  renderer: 'three',
  
  // Existing studio manager instance
  studioManager: null,
  isStandaloneMode: true, // StudioManager handles its own rendering
  
  /**
   * Initialize StudioComplex
   * @param {Object} scene - Three.js scene (may be unused if standalone)
   * @param {Object} camera - Three.js camera (may be unused if standalone)
   * @param {Object} engine - SpatialSpace engine instance
   */
  async init(scene, camera, engine) {
    console.log('🎬 Initializing Studio Complex...');
    
    // Initialize StudioManager with existing canvas
    if (!this.studioManager) {
      this.studioManager = new StudioManager();
      const canvas = document.getElementById('renderCanvas');
      await this.studioManager.initialize(canvas);
    }
    
    // Start the studio manager (it has its own render loop)
    this.studioManager.start();
    
    // Enable VR interaction using StudioManager's scene and camera
    if (engine.interactions && this.studioManager.engine && this.studioManager.camera) {
      engine.interactions.initVRInteraction(
        this.studioManager.engine.scene, 
        this.studioManager.camera
      );
    }
    
    console.log('✅ Studio Complex initialized (standalone mode)');
  },
  
  /**
   * Update loop
   */
  update(delta) {
    if (this.studioManager && this.studioManager.active) {
      // StudioManager handles its own update loop
      // Nothing needed here
    }
  },
  
  /**
   * Switch to different studio room
   * @param {string} roomName - Room name (recording, tv, etc.)
   */
  switchStudio(roomName) {
    console.log('🎬 Switching to studio:', roomName);
    if (this.studioManager && this.studioManager.router) {
      this.studioManager.router.loadWorld(roomName);
    }
  },
  
  /**
   * Get available studios
   */
  getStudios() {
    return [
      'complex',
      'recording',
      'tv',
      'hallway'
    ];
  },
  
  /**
   * Dispose module
   */
  dispose() {
    if (this.studioManager) {
      this.studioManager.stop();
      this.studioManager = null;
    }
    console.log('🗑️ Studio Complex disposed');
  }
};
