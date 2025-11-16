/**
 * SceneRouter.js
 * Module switching system for SpatialSpace
 */

export class SceneRouter {
  constructor(engine) {
    this.engine = engine;
    this.modules = new Map();
    this.currentModule = null;
    
    console.log('🗺️ Scene Router initialized');
  }

  /**
   * Register a module
   * @param {string} name - Module name
   * @param {Object} config - Module configuration
   */
  register(name, config) {
    this.modules.set(name, config);
    console.log('📦 Module registered:', name);
  }

  /**
   * Load a module by name
   * @param {string} name - Module name
   */
  load(name) {
    const config = this.modules.get(name);
    
    if (!config) {
      console.error('❌ Unknown module:', name);
      return;
    }
    
    console.log('🔀 Loading module:', name);
    this.engine.loadScene(config);
    this.currentModule = name;
  }

  /**
   * Get current module name
   */
  getCurrentModule() {
    return this.currentModule;
  }
  
  /**
   * Get current module instance
   */
  getActiveModule() {
    if (!this.currentModule) return null;
    const config = this.modules.get(this.currentModule);
    return config?.module || config;
  }
  
  /**
   * Request room switch in active module
   * @param {string} roomName - Room name to switch to
   */
  async requestRoomSwitch(roomName) {
    const activeModule = this.getActiveModule();
    
    if (!activeModule) {
      console.warn('⚠️ No active module');
      return;
    }
    
    if (!activeModule.supportsRoomSwitching) {
      console.warn('⚠️ Current module does not support room switching');
      return;
    }

    if (typeof activeModule.loadRoom === 'function') {
      await activeModule.loadRoom(roomName, this.engine);
    } else if (typeof activeModule.switchRoom === 'function') {
      activeModule.switchRoom(roomName);
    } else {
      console.warn('⚠️ loadRoom() not implemented in module');
    }
  }

  /**
   * List all registered modules
   */
  listModules() {
    return Array.from(this.modules.keys());
  }
}
