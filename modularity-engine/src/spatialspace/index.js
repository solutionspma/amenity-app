/**
 * SpatialSpace Unified Engine Initialization
 * 
 * Entry point for initializing the SpatialSpace engine and registering modules
 */

import { EngineCore } from './core/EngineCore.js';
import { ModularityOS } from './modules/modularityOS/modularityOS.js';
import { StudioComplex } from './modules/studioComplex/studioComplex.js';

/**
 * Initialize SpatialSpace engine
 */
export function initSpatialSpace() {
  console.log('🚀 Initializing SpatialSpace Unified Engine...');
  
  // Get or create engine instance
  const engine = window.SpatialSpace || new EngineCore();
  
  // Initialize all subsystems
  if (!engine.isInitialized) {
    engine.init();
  }
  
  // Register modules
  engine.router.register('modularityOS', ModularityOS);
  engine.router.register('studioComplex', StudioComplex);
  
  console.log('✅ SpatialSpace engine ready');
  console.log('📦 Registered modules:', engine.router.listModules());
  
  return engine;
}

/**
 * Load default module (ModularityOS church)
 */
export function loadDefaultModule() {
  const engine = window.SpatialSpace;
  
  if (!engine) {
    console.error('❌ SpatialSpace not initialized');
    return;
  }
  
  console.log('⛪ Loading default module: ModularityOS');
  engine.switchModule('modularityOS');
  engine.startRenderLoop();
}

/**
 * Switch between modules
 * @param {string} moduleName - 'modularityOS' or 'studioComplex'
 */
export function switchModule(moduleName) {
  const engine = window.SpatialSpace;
  
  if (!engine) {
    console.error('❌ SpatialSpace not initialized');
    return;
  }
  
  console.log('🔀 Switching module to:', moduleName);
  engine.switchModule(moduleName);
}

// Export global functions
window.initSpatialSpace = initSpatialSpace;
window.loadDefaultModule = loadDefaultModule;
window.switchSpatialModule = switchModule;

export default {
  initSpatialSpace,
  loadDefaultModule,
  switchModule
};
