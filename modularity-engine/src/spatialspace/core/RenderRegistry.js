/**
 * RenderRegistry.js
 * Unified Render Registry for Babylon.js and Three.js
 */

import { BabylonAdapter } from '../renderers/babylonAdapter.js';
import { ThreeAdapter } from '../renderers/threeAdapter.js';

export class RenderRegistry {
  constructor() {
    this.adapters = {
      'babylon': new BabylonAdapter(),
      'three': new ThreeAdapter()
    };
    
    console.log('📋 Render Registry initialized with:', Object.keys(this.adapters));
  }

  /**
   * Get renderer adapter by name
   * @param {string} engineName - 'babylon' or 'three'
   */
  get(engineName) {
    const adapter = this.adapters[engineName];
    if (!adapter) {
      console.warn('⚠️ Unknown renderer:', engineName);
    }
    return adapter;
  }

  /**
   * Register a custom renderer adapter
   * @param {string} name - Renderer name
   * @param {Object} adapter - Adapter instance
   */
  register(name, adapter) {
    this.adapters[name] = adapter;
    console.log('✅ Registered renderer:', name);
  }

  /**
   * List all available renderers
   */
  list() {
    return Object.keys(this.adapters);
  }
}
