/**
 * MODULARITY SPATIAL OS - CAMERA CONTROLLER
 * Mouse + Touch look controls for Three.js
 */

import * as THREE from 'three';

export class CameraController {
  constructor(camera, touchControls) {
    this.camera = camera;
    this.touchControls = touchControls;

    this.pitch = 0;
    this.yaw = 0;
    
    this.mouseLocked = false;
    
    this.initMouseLook();
    
    console.log('📹 Camera controller initialized');
  }

  initMouseLook() {
    document.addEventListener('click', () => {
      if (!this.mouseLocked) {
        document.body.requestPointerLock();
      }
    });

    document.addEventListener('pointerlockchange', () => {
      this.mouseLocked = document.pointerLockElement === document.body;
    });

    document.addEventListener('mousemove', (e) => {
      if (!this.mouseLocked) return;

      const movementX = e.movementX || 0;
      const movementY = e.movementY || 0;

      this.yaw -= movementX * 0.002;
      this.pitch -= movementY * 0.002;
      
      // Clamp pitch to prevent flipping
      this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));
    });
  }

  update() {
    // Apply touch look
    const look = this.touchControls.getLook();
    
    this.yaw -= look.x;
    this.pitch -= look.y;
    
    // Clamp pitch
    this.pitch = Math.max(-Math.PI / 2 + 0.1, Math.min(Math.PI / 2 - 0.1, this.pitch));

    // Apply rotation to camera
    this.camera.rotation.set(this.pitch, this.yaw, 0, 'YXZ');
  }
}
