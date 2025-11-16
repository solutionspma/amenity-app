/**
 * MODULARITY SPATIAL OS - XR ENGINE
 * WebXR / VR / AR Foundation System
 * 
 * Handles all XR session management, device detection, and mode switching
 */

import { WebXRDefaultExperience, WebXRState } from '@babylonjs/core/XR';
import { Scene } from '@babylonjs/core/scene';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export class XREngine {
  constructor(scene, canvas) {
    this.scene = scene;
    this.canvas = canvas;
    this.xrExperience = null;
    this.xrHelper = null;
    this.isXRSupported = false;
    this.currentMode = 'desktop'; // desktop, vr, ar
    this.featureManager = null;
  }

  async initialize() {
    console.log('🥽 Checking XR support...');
    
    try {
      const support = await this.checkXRSupport();
      console.log('XR Support:', support);
      
      if (!support.vr && !support.ar) {
        console.warn('⚠️ WebXR not available - desktop fallback mode enabled');
        return true; // Don't block initialization
      }
    } catch (e) {
      console.warn('⚠️ XR check failed - desktop fallback mode enabled');
      return true; // Don't block initialization
    }

    try {
      // Check XR support
      this.isXRSupported = await this.checkXRSupport();
      
      if (!this.isXRSupported) {
        console.warn('⚠️ WebXR not supported on this device');
        return false;
      }

      // Create default XR experience
      this.xrExperience = await this.scene.createDefaultXRExperienceAsync({
        floorMeshes: [],
        disableTeleportation: false,
        useStablePlugins: true
      });

      this.xrHelper = this.xrExperience.baseExperience;
      this.featureManager = this.xrExperience.baseExperience.featuresManager;

      // Setup XR event listeners
      this.setupXREvents();

      console.log('✅ XR Engine initialized successfully');
      return true;

    } catch (error) {
      console.error('❌ XR initialization failed:', error);
      return false;
    }
  }

  async checkXRSupport() {
    if (!navigator.xr) {
      return false;
    }

    try {
      const vrSupported = await navigator.xr.isSessionSupported('immersive-vr');
      const arSupported = await navigator.xr.isSessionSupported('immersive-ar');
      
      console.log('XR Support:', { 
        vr: vrSupported, 
        ar: arSupported 
      });

      return vrSupported || arSupported;
    } catch (error) {
      console.error('Error checking XR support:', error);
      return false;
    }
  }

  setupXREvents() {
    this.xrHelper.onStateChangedObservable.add((state) => {
      console.log('XR State changed:', state);

      switch (state) {
        case WebXRState.IN_XR:
          this.onXRSessionStarted();
          break;
        case WebXRState.NOT_IN_XR:
          this.onXRSessionEnded();
          break;
        case WebXRState.ENTERING_XR:
          console.log('Entering XR...');
          break;
        case WebXRState.EXITING_XR:
          console.log('Exiting XR...');
          break;
      }
    });
  }

  onXRSessionStarted() {
    console.log('🎮 XR Session Started');
    this.currentMode = this.xrHelper.sessionMode === 'immersive-ar' ? 'ar' : 'vr';
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('xr-session-started', {
      detail: { mode: this.currentMode }
    }));
  }

  onXRSessionEnded() {
    console.log('🎮 XR Session Ended');
    this.currentMode = 'desktop';
    
    // Trigger custom event
    window.dispatchEvent(new CustomEvent('xr-session-ended'));
  }

  async enterVR() {
    if (!this.isXRSupported) {
      console.warn('VR not supported');
      return false;
    }

    try {
      await this.xrHelper.enterXRAsync('immersive-vr', 'local-floor');
      return true;
    } catch (error) {
      console.error('Failed to enter VR:', error);
      return false;
    }
  }

  async enterAR() {
    if (!this.isXRSupported) {
      console.warn('AR not supported');
      return false;
    }

    try {
      await this.xrHelper.enterXRAsync('immersive-ar', 'local-floor');
      return true;
    } catch (error) {
      console.error('Failed to enter AR:', error);
      return false;
    }
  }

  async exitXR() {
    try {
      await this.xrHelper.exitXRAsync();
      return true;
    } catch (error) {
      console.error('Failed to exit XR:', error);
      return false;
    }
  }

  getCamera() {
    return this.xrHelper?.camera || this.scene.activeCamera;
  }

  getControllers() {
    if (!this.xrExperience) return [];
    return this.xrExperience.input?.controllers || [];
  }

  enableTeleportation(meshes) {
    if (this.xrExperience?.teleportation) {
      this.xrExperience.teleportation.addFloorMesh(meshes);
    }
  }

  disableTeleportation() {
    if (this.xrExperience?.teleportation) {
      this.xrExperience.teleportation.detach();
    }
  }

  enableHandTracking() {
    if (this.featureManager) {
      try {
        const handTracking = this.featureManager.enableFeature(
          'hand-tracking',
          'latest',
          { xrInput: this.xrExperience.input }
        );
        console.log('✋ Hand tracking enabled');
        return handTracking;
      } catch (error) {
        console.warn('Hand tracking not available:', error);
        return null;
      }
    }
  }

  enableHitTest() {
    if (this.featureManager && this.currentMode === 'ar') {
      try {
        const hitTest = this.featureManager.enableFeature('hit-test');
        console.log('🎯 AR Hit-testing enabled');
        return hitTest;
      } catch (error) {
        console.warn('Hit-testing not available:', error);
        return null;
      }
    }
  }

  dispose() {
    if (this.xrHelper) {
      this.xrHelper.dispose();
    }
    console.log('XR Engine disposed');
  }
}

export default XREngine;
