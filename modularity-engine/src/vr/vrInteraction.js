/**
 * vrInteraction.js
 * Master VR Interaction System
 * Combines pointer, grab, teleport, and UI systems
 */

import { VRPointer } from './vrPointer.js';
import { VRGrab } from './vrGrab.js';
import { VRTeleport } from './vrTeleport.js';
import { VRUIRaycast } from './vrUIRaycast.js';

export class VRInteraction {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;

    // Initialize subsystems
    this.pointer = new VRPointer(camera);
    this.grabber = new VRGrab(scene, this.pointer);
    this.teleport = new VRTeleport(scene, this.pointer);
    this.ui = new VRUIRaycast(scene, this.pointer);

    // Control states
    this.setupControls();

    console.log('🎮 VR Interaction System initialized');
  }

  setupControls() {
    // Initialize global VR controls object
    window.VRControls = {
      selectPressed: false,
      grabPressed: false,
      teleportPressed: false
    };

    // Keyboard controls for desktop testing
    document.addEventListener('keydown', (e) => {
      if (e.key === 'e' || e.key === 'E') window.VRControls.selectPressed = true;
      if (e.key === 'g' || e.key === 'G') window.VRControls.grabPressed = true;
      if (e.key === 't' || e.key === 'T') window.VRControls.teleportPressed = true;
    });

    document.addEventListener('keyup', (e) => {
      if (e.key === 'e' || e.key === 'E') window.VRControls.selectPressed = false;
      if (e.key === 'g' || e.key === 'G') window.VRControls.grabPressed = false;
      if (e.key === 't' || e.key === 'T') window.VRControls.teleportPressed = false;
    });

    // Mobile touch controls (map to buttons)
    document.addEventListener('touchstart', (e) => {
      // You can map specific touch zones or buttons here
      // For now, single tap = select
      window.VRControls.selectPressed = true;
    });

    document.addEventListener('touchend', () => {
      window.VRControls.selectPressed = false;
    });
  }

  update(delta = 0.016) {
    this.pointer.update();
    this.grabber.update(delta);
    this.teleport.update(delta);
    this.ui.update();
  }

  // Helper to mark objects as grabbable
  makeGrabbable(object) {
    object.userData.grabbable = true;
  }

  // Helper to create UI button
  createButton(mesh, callback) {
    mesh.userData.uiButton = callback;
    return mesh;
  }
}
