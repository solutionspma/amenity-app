/**
 * EngineCore.js
 * SpatialSpace Unified Engine Core
 * 
 * Master engine that unifies all AR/VR tech, rendering engines,
 * multiplayer, avatars, and controls for Modularity Spatial OS
 */

import { RenderRegistry } from './RenderRegistry.js';
import { ControlCore } from './ControlCore.js';
import { InteractionCore } from './InteractionCore.js';
import { ARCore } from './ARCore.js';
import { VRCore } from './VRCore.js';
import { MultiplayerCore } from './MultiplayerCore.js';
import { AvatarCore } from './AvatarCore.js';
import { SceneRouter } from './SceneRouter.js';

export class EngineCore {
  constructor() {
    // Core rendering
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.currentAdapter = null;
    
    // Subsystems
    this.registry = null;      // RenderRegistry (Babylon + Three.js)
    this.controls = null;      // ControlCore
    this.interactions = null;  // InteractionCore
    this.ar = null;            // ARCore
    this.vr = null;            // VRCore
    this.multi = null;         // MultiplayerCore
    this.avatar = null;        // AvatarCore
    this.router = null;        // SceneRouter
    
    // State
    this.currentModule = null;
    this.isInitialized = false;
    this.deltaTime = 0;
    this.lastTime = performance.now();
    
    console.log('🔮 SpatialSpace Engine Core created');
  }

  /**
   * Initialize all engine subsystems
   */
  init() {
    console.log('⚙️ Initializing SpatialSpace Engine...');
    
    // Initialize subsystems
    this.registry = new RenderRegistry();
    this.controls = new ControlCore(this);
    this.interactions = new InteractionCore(this);
    this.ar = new ARCore(this);
    this.vr = new VRCore(this);
    this.multi = new MultiplayerCore(this);
    this.avatar = new AvatarCore(this);
    this.router = new SceneRouter(this);
    
    this.isInitialized = true;
    console.log('✅ SpatialSpace Engine initialized');
    
    return this;
  }

  /**
   * Load a scene/module into the engine
   * @param {Object} sceneConfig - Configuration with renderer and module
   */
  loadScene(sceneConfig) {
    console.log('📦 Loading scene:', sceneConfig.name || 'unnamed');
    
    // Get renderer adapter (babylon or three)
    const adapter = this.registry.get(sceneConfig.renderer);
    if (!adapter) {
      console.error('❌ Unknown renderer:', sceneConfig.renderer);
      return;
    }
    
    this.currentAdapter = adapter;
    
    // Dispose previous scene if exists
    if (this.scene && this.currentModule) {
      this.disposeCurrentScene();
    }
    
    // Check if module runs in standalone mode (manages its own rendering)
    const isStandalone = sceneConfig.module && sceneConfig.module.isStandaloneMode;
    
    if (!isStandalone) {
      // Standard mode: create renderer/scene/camera via adapter
      this.renderer = adapter.createRenderer();
      this.scene = adapter.createScene();
      this.camera = adapter.createCamera();
    } else {
      // Standalone mode: module manages its own rendering
      console.log('🎯 Module runs in standalone mode (manages own rendering)');
      this.renderer = null;
      this.scene = null;
      this.camera = null;
    }
    
    // Initialize the module
    if (sceneConfig.module && sceneConfig.module.init) {
      sceneConfig.module.init(this.scene, this.camera, this);
      this.currentModule = sceneConfig.module;
    }
    
    console.log('✅ Scene loaded successfully');
  }

  /**
   * Main update loop
   * @param {number} delta - Delta time in seconds
   */
  update(delta) {
    // Calculate delta if not provided
    if (!delta) {
      const now = performance.now();
      delta = (now - this.lastTime) / 1000;
      this.lastTime = now;
    }
    
    this.deltaTime = delta;
    
    // Update subsystems
    if (this.interactions) this.interactions.update(delta);
    if (this.controls) this.controls.update(delta);
    if (this.vr && this.vr.enabled) this.vr.update(delta);
    if (this.avatar) this.avatar.update(delta);
    if (this.multi) this.multi.update(delta);
    
    // Update current module if it has an update method
    if (this.currentModule && this.currentModule.update) {
      this.currentModule.update(delta);
    }
    
    // Render using current adapter (skip if module is in standalone mode)
    const isStandalone = this.currentModule && this.currentModule.isStandaloneMode;
    if (!isStandalone && this.currentAdapter && this.currentAdapter.render) {
      this.currentAdapter.render(this.scene, this.camera);
    }
  }

  /**
   * Start render loop
   */
  startRenderLoop() {
    const loop = () => {
      this.update();
      requestAnimationFrame(loop);
    };
    loop();
    console.log('🔄 Render loop started');
  }

  /**
   * Dispose current scene
   */
  disposeCurrentScene() {
    console.log('🗑️ Disposing current scene...');
    
    if (this.currentModule && this.currentModule.dispose) {
      this.currentModule.dispose();
    }
    
    if (this.currentAdapter && this.currentAdapter.dispose) {
      this.currentAdapter.dispose(this.scene, this.renderer);
    }
    
    this.scene = null;
    this.camera = null;
    this.currentModule = null;
  }

  /**
   * Switch to a different module
   * @param {string} moduleName - Name of module to load
   */
  switchModule(moduleName) {
    console.log('🔀 Switching to module:', moduleName);
    this.router.load(moduleName);
  }

  /**
   * Get current rendering engine name
   */
  getCurrentRenderer() {
    return this.currentAdapter ? this.currentAdapter.name : null;
  }
}

// Create global singleton instance
if (!window.SpatialSpace) {
  window.SpatialSpace = new EngineCore();
  console.log('🌐 Global SpatialSpace engine created');
}

export default window.SpatialSpace;
