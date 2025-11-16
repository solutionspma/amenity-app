/**
 * modularityOS.js
 * Faith-based church worlds module configuration
 * Wraps existing Babylon.js church implementation
 */

import { SceneManager } from '../../../engine/sceneManager.js';

export const ModularityOS = {
  name: 'ModularityOS',
  renderer: 'babylon',
  
  // Required to allow room switching
  supportsRoomSwitching: true,
  
  // Existing scene manager instance
  sceneManager: null,
  
  /**
   * Initialize ModularityOS (church rooms)
   * @param {Object} scene - Babylon.js scene
   * @param {Object} camera - Babylon.js camera
   * @param {Object} engine - SpatialSpace engine instance
   */
  init(scene, camera, engine) {
    console.log('⛪ Initializing ModularityOS (Church Worlds)...');
    
    // Create scene manager with existing implementation
    this.sceneManager = new SceneManager(scene, camera);
    
    // Load default room (Sanctuary)
    this.sceneManager.loadRoom('sanctuary');
    
    console.log('✅ ModularityOS initialized');
  },
  
  /**
   * Update loop (called every frame)
   */
  update(delta) {
    // Scene manager handles its own updates via Babylon.js render loop
    // Nothing needed here unless we add custom logic
  },
  
  /**
   * Load room - main entry point for SpatialSpace
   * @param {string} roomName - Room name (sanctuary, chapel, etc.)
   * @param {Object} engine - SpatialSpace engine instance
   */
  async loadRoom(roomName, engine) {
    console.log('🏠 Loading room:', roomName);
    if (this.sceneManager) {
      this.sceneManager.loadRoom(roomName);
      console.log('✅ Room loaded:', roomName);
    } else {
      console.warn('⚠️ SceneManager not initialized');
    }
  },
  
  /**
   * Switch to a different church room (legacy alias)
   * @param {string} roomName - Room name (sanctuary, chapel, etc.)
   */
  switchRoom(roomName) {
    this.loadRoom(roomName, null);
  },
  
  /**
   * Get available rooms
   */
  getRooms() {
    return [
      'sanctuary',
      'chapel',
      'fellowship',
      'prayer',
      'meditation',
      'worship',
      'baptism',
      'garden'
    ];
  },
  
  /**
   * Dispose module
   */
  dispose() {
    if (this.sceneManager) {
      this.sceneManager.dispose();
      this.sceneManager = null;
    }
    console.log('🗑️ ModularityOS disposed');
  }
};
