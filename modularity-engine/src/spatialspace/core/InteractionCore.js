/**
 * InteractionCore.js
 * Unified interaction system wrapping VR interaction modules
 */

import { VRInteraction } from '../../vr/vrInteraction.js';

export class InteractionCore {
  constructor(engine) {
    this.engine = engine;
    this.vrInteraction = null;
    this.enabled = false;
    
    console.log('🤝 Interaction Core initialized');
  }

  /**
   * Initialize VR interaction for a scene
   * @param {Object} scene - Scene object (Babylon or Three.js)
   * @param {Object} camera - Camera object
   */
  initVRInteraction(scene, camera) {
    if (this.engine.getCurrentRenderer() === 'three') {
      this.vrInteraction = new VRInteraction(scene, camera);
      this.enabled = true;
      console.log('✅ VR Interaction enabled (Three.js)');
    } else {
      console.warn('⚠️ VR Interaction only available for Three.js renderer');
    }
  }

  /**
   * Make an object grabbable
   */
  makeGrabbable(object) {
    if (this.vrInteraction) {
      this.vrInteraction.makeGrabbable(object);
    }
  }

  /**
   * Create UI button
   */
  createButton(mesh, callback) {
    if (this.vrInteraction) {
      return this.vrInteraction.createButton(mesh, callback);
    }
  }

  update(delta) {
    if (this.enabled && this.vrInteraction) {
      this.vrInteraction.update(delta);
    }
  }

  dispose() {
    this.vrInteraction = null;
    this.enabled = false;
  }
}
