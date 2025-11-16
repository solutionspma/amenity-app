/**
 * threeAdapter.js
 * Adapter for Three.js rendering engine
 */

import * as THREE from 'three';

export class ThreeAdapter {
  constructor() {
    this.name = 'three';
    this.renderer = null;
    this.canvas = null;
    this.THREE = THREE; // Store reference for module use
    
    console.log('🟢 Three.js Adapter initialized');
  }

  /**
   * Create Three.js renderer
   */
  createRenderer() {
    this.canvas = document.getElementById('renderCanvas');
    if (!this.canvas) {
      console.error('❌ Canvas not found for Three.js');
      return null;
    }
    
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: true,
      alpha: true
    });
    
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Auto-resize
    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    console.log('✅ Three.js renderer created');
    return this.renderer;
  }

  /**
   * Create Three.js scene
   */
  createScene() {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0d0d1a);
    scene.fog = new THREE.Fog(0x0d0d1a, 10, 50);
    
    console.log('✅ Three.js scene created');
    return scene;
  }

  /**
   * Create Three.js camera
   */
  createCamera() {
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    
    camera.position.set(0, 1.6, 5);
    
    // Auto-resize aspect ratio
    window.addEventListener('resize', () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
    });
    
    console.log('✅ Three.js camera created');
    return camera;
  }

  /**
   * Render scene
   */
  render(scene, camera) {
    if (this.renderer && scene && camera) {
      this.renderer.render(scene, camera);
    }
  }

  /**
   * Start render loop
   */
  startRenderLoop(scene, camera, updateCallback) {
    const animate = () => {
      requestAnimationFrame(animate);
      
      if (updateCallback) {
        updateCallback();
      }
      
      this.render(scene, camera);
    };
    
    animate();
  }

  /**
   * Dispose scene and renderer
   */
  dispose(scene, renderer) {
    if (scene) {
      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach(mat => mat.dispose());
          } else {
            object.material.dispose();
          }
        }
      });
      
      scene.clear();
    }
    
    if (this.renderer) {
      this.renderer.dispose();
      this.renderer = null;
    }
    
    console.log('🗑️ Three.js disposed');
  }
}
