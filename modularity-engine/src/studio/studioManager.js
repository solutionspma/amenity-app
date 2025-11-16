/**
 * MODULARITY SPATIAL OS - STUDIO MANAGER
 * Manages Three.js Studio Complex module alongside Babylon.js church spaces
 */

import * as THREE from 'three';
import { StudioEngine } from './core/engine.js';
import { TouchControls } from './core/touchControls.js';
import { MovementController } from './core/movementController.js';
import { CameraController } from './core/cameraController.js';
import { WorldRouter } from './core/worldRouter.js';

export class StudioManager {
  constructor() {
    this.engine = null;
    this.camera = null;
    this.touchControls = null;
    this.movement = null;
    this.cameraController = null;
    this.router = null;
    this.active = false;
    this.animationId = null;
    
    console.log('🎬 Studio Manager created');
  }

  async initialize(canvas) {
    console.log('🏗️ Initializing Studio Complex (Three.js)...');
    
    // Create Three.js engine
    this.engine = new StudioEngine(canvas);
    
    // Create camera
    this.camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.camera.position.set(0, 1.6, 10);
    
    // Initialize controls
    this.touchControls = new TouchControls();
    this.movement = new MovementController(this.camera, this.engine.scene, this.touchControls);
    this.cameraController = new CameraController(this.camera, this.touchControls);
    
    // Initialize world router
    this.router = new WorldRouter(this.engine, this.camera);
    
    // Load default scene
    this.router.load('complex');
    
    // Handle window resize
    window.addEventListener('resize', () => this.onResize());
    
    console.log('✅ Studio Complex initialized');
    
    return this;
  }

  start() {
    if (this.active) return;
    
    console.log('▶️ Starting Studio Complex render loop');
    this.active = true;
    this.animate();
  }

  stop() {
    if (!this.active) return;
    
    console.log('⏸️ Stopping Studio Complex render loop');
    this.active = false;
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
  }

  animate() {
    if (!this.active) return;
    
    this.animationId = requestAnimationFrame(() => this.animate());
    
    const delta = this.engine.render(this.camera);
    
    this.movement.update(delta);
    this.cameraController.update();
    this.router.update(delta);
  }

  loadScene(sceneName) {
    this.router.load(sceneName);
  }

  getCurrentScene() {
    return this.router.getCurrentScene();
  }

  onResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.engine.resize();
  }

  dispose() {
    this.stop();
    this.engine.clearScene();
    console.log('🗑️ Studio Complex disposed');
  }
}
