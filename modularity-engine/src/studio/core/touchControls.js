/**
 * MODULARITY SPATIAL OS - TOUCH CONTROLS
 * Unified touch interface for mobile/tablet
 */

import * as THREE from 'three';

export class TouchControls {
  constructor() {
    this.joystick = document.getElementById('mobile-joystick');
    this.lookpad = document.getElementById('lookpad');

    this.movement = { x: 0, y: 0 };
    this.look = { x: 0, y: 0 };
    
    this.enabled = false;

    if (this.joystick) {
      this.initJoystick();
      this.enabled = true;
    }
    
    if (this.lookpad) {
      this.initLookpad();
    }
    
    console.log('📱 Touch controls initialized');
  }

  initJoystick() {
    let dragging = false;
    let rect;
    let startPos = { x: 0, y: 0 };

    this.joystick.addEventListener('touchstart', (e) => {
      e.preventDefault();
      dragging = true;
      rect = this.joystick.getBoundingClientRect();
      const touch = e.touches[0];
      startPos.x = touch.clientX;
      startPos.y = touch.clientY;
    });

    this.joystick.addEventListener('touchmove', (e) => {
      e.preventDefault();
      if (!dragging) return;
      
      const touch = e.touches[0];
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const dx = touch.clientX - centerX;
      const dy = touch.clientY - centerY;
      
      // Normalize to -1 to 1 range
      this.movement.x = Math.max(-1, Math.min(1, dx / 50));
      this.movement.y = Math.max(-1, Math.min(1, dy / 50));
    });

    this.joystick.addEventListener('touchend', () => {
      dragging = false;
      this.movement.x = 0;
      this.movement.y = 0;
    });
  }

  initLookpad() {
    let dragging = false;
    let lastTouch = { x: 0, y: 0 };

    this.lookpad.addEventListener('touchstart', (e) => {
      dragging = true;
      const touch = e.touches[0];
      lastTouch.x = touch.clientX;
      lastTouch.y = touch.clientY;
    });

    this.lookpad.addEventListener('touchmove', (e) => {
      if (!dragging) return;
      
      const touch = e.touches[0];
      const dx = touch.clientX - lastTouch.x;
      const dy = touch.clientY - lastTouch.y;
      
      this.look.x = dx * 0.003;
      this.look.y = dy * 0.003;
      
      lastTouch.x = touch.clientX;
      lastTouch.y = touch.clientY;
    });

    this.lookpad.addEventListener('touchend', () => {
      dragging = false;
      this.look.x = 0;
      this.look.y = 0;
    });
  }

  getMovement() {
    return this.movement;
  }

  getLook() {
    return this.look;
  }
}
