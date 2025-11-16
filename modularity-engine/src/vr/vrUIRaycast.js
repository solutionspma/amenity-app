/**
 * vrUIRaycast.js
 * VR UI Interaction via Raycast
 */

export class VRUIRaycast {
  constructor(scene, pointer) {
    this.pointer = pointer;
    this.scene = scene;
    this.hoveredButton = null;
    this.lastPressedState = false;
  }

  update() {
    const hit = this.pointer.hit(this.scene.children)[0];
    
    // Unhover previous button
    if (this.hoveredButton && (!hit || hit.object !== this.hoveredButton)) {
      this.unhover(this.hoveredButton);
      this.hoveredButton = null;
    }

    if (!hit || !hit.object.userData.uiButton) {
      this.pointer.hideDot();
      return;
    }

    // Show pointer dot at UI element
    this.pointer.showDot(hit.point);

    // Hover new button
    if (hit.object !== this.hoveredButton) {
      this.hover(hit.object);
      this.hoveredButton = hit.object;
    }

    // Handle click (trigger once on press, not hold)
    const isPressed = window.VRControls?.selectPressed || false;
    if (isPressed && !this.lastPressedState) {
      this.click(hit.object);
    }
    this.lastPressedState = isPressed;
  }

  hover(button) {
    if (button.material) {
      button.material.emissive = new THREE.Color(0x2266ff);
    }
    console.log('🔵 Hover:', button.name || 'button');
  }

  unhover(button) {
    if (button.material) {
      button.material.emissive = new THREE.Color(0x000000);
    }
  }

  click(button) {
    if (button.userData.uiButton) {
      button.userData.uiButton();
      console.log('✅ Clicked:', button.name || 'button');
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  }
}
