/**
 * MODULARITY SPATIAL OS - MOVEMENT CONTROLLER
 * WASD + Touch movement for Three.js camera
 */

import * as THREE from 'three';

export class MovementController {
  constructor(camera, scene, touchControls) {
    this.camera = camera;
    this.scene = scene;
    this.touchControls = touchControls;

    this.velocity = new THREE.Vector3();
    this.speed = 5.0;
    
    // Keyboard state
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      up: false,
      down: false
    };
    
    this.initKeyboard();
    
    console.log('🚶 Movement controller initialized');
  }

  initKeyboard() {
    window.addEventListener('keydown', (e) => {
      switch(e.code) {
        case 'KeyW': this.keys.forward = true; break;
        case 'KeyS': this.keys.backward = true; break;
        case 'KeyA': this.keys.left = true; break;
        case 'KeyD': this.keys.right = true; break;
        case 'Space': this.keys.up = true; break;
        case 'ShiftLeft': this.keys.down = true; break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch(e.code) {
        case 'KeyW': this.keys.forward = false; break;
        case 'KeyS': this.keys.backward = false; break;
        case 'KeyA': this.keys.left = false; break;
        case 'KeyD': this.keys.right = false; break;
        case 'Space': this.keys.up = false; break;
        case 'ShiftLeft': this.keys.down = false; break;
      }
    });
  }

  update(delta) {
    const move = this.touchControls.getMovement();

    // Get camera forward and right vectors
    const forward = new THREE.Vector3();
    this.camera.getWorldDirection(forward);
    forward.y = 0; // Keep movement horizontal
    forward.normalize();

    const right = new THREE.Vector3();
    right.crossVectors(this.camera.up, forward).normalize();

    // Apply touch controls
    if (this.touchControls.enabled) {
      this.velocity.addScaledVector(forward, -move.y * this.speed * delta);
      this.velocity.addScaledVector(right, move.x * this.speed * delta);
    }
    
    // Apply keyboard controls
    if (this.keys.forward) this.velocity.addScaledVector(forward, this.speed * delta);
    if (this.keys.backward) this.velocity.addScaledVector(forward, -this.speed * delta);
    if (this.keys.left) this.velocity.addScaledVector(right, this.speed * delta);
    if (this.keys.right) this.velocity.addScaledVector(right, -this.speed * delta);
    if (this.keys.up) this.camera.position.y += this.speed * delta;
    if (this.keys.down) this.camera.position.y -= this.speed * delta;

    // Apply velocity to camera position
    this.camera.position.add(this.velocity);
    
    // Apply friction
    this.velocity.multiplyScalar(0.85);
  }
}
