/**
 * babylonAdapter.js
 * Adapter for Babylon.js rendering engine
 */

export class BabylonAdapter {
  constructor() {
    this.name = 'babylon';
    this.engine = null;
    this.canvas = null;
    
    console.log('🔵 Babylon.js Adapter initialized');
  }

  /**
   * Create Babylon.js renderer (engine)
   */
  createRenderer() {
    this.canvas = document.getElementById('renderCanvas');
    if (!this.canvas) {
      console.error('❌ Canvas not found for Babylon.js');
      return null;
    }
    
    // Import Babylon dynamically
    if (window.BABYLON) {
      this.engine = new BABYLON.Engine(this.canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true
      });
      
      // Auto-resize
      window.addEventListener('resize', () => {
        this.engine.resize();
      });
      
      console.log('✅ Babylon.js engine created');
      return this.engine;
    } else {
      console.error('❌ BABYLON not loaded');
      return null;
    }
  }

  /**
   * Create Babylon.js scene
   */
  createScene() {
    if (!window.BABYLON) {
      console.error('❌ BABYLON not loaded');
      return null;
    }
    
    // Create engine if not exists
    if (!this.engine) {
      console.warn('⚠️ Engine not created, creating now...');
      this.createRenderer();
    }
    
    if (!this.engine) {
      console.error('❌ Babylon.js engine not initialized');
      return null;
    }
    
    const scene = new BABYLON.Scene(this.engine);
    scene.clearColor = new BABYLON.Color4(0.05, 0.05, 0.1, 1);
    
    console.log('✅ Babylon.js scene created');
    return scene;
  }

  /**
   * Create Babylon.js camera
   */
  createCamera() {
    if (!window.BABYLON) {
      console.error('❌ BABYLON not loaded');
      return null;
    }
    
    // Create engine if not exists
    if (!this.engine) {
      console.warn('⚠️ Engine not created for camera, creating now...');
      this.createRenderer();
    }
    
    if (!this.engine) {
      console.error('❌ Babylon.js engine not initialized');
      return null;
    }
    
    const camera = new BABYLON.ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new BABYLON.Vector3(0, 0, 0),
      this.engine.scenes[0]
    );
    
    camera.attachControl(this.canvas, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 50;
    camera.wheelPrecision = 50;
    
    console.log('✅ Babylon.js camera created');
    return camera;
  }

  /**
   * Render scene
   */
  render(scene, camera) {
    if (this.engine && scene) {
      scene.render();
    }
  }

  /**
   * Start render loop
   */
  startRenderLoop(scene) {
    if (this.engine && scene) {
      this.engine.runRenderLoop(() => {
        scene.render();
      });
    }
  }

  /**
   * Dispose scene and renderer
   */
  dispose(scene, renderer) {
    if (scene) {
      scene.dispose();
    }
    
    if (this.engine) {
      this.engine.dispose();
      this.engine = null;
    }
    
    console.log('🗑️ Babylon.js disposed');
  }
}
