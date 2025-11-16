/**
 * MODULARITY SPATIAL OS - AR MODE
 * Augmented Reality with hit-testing and portal spawning
 */

import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { TransformNode } from '@babylonjs/core/Meshes/transformNode';

export class ARMode {
  constructor(scene, xrEngine) {
    this.scene = scene;
    this.xrEngine = xrEngine;
    this.hitTestFeature = null;
    this.portals = [];
    this.arAnchors = new Map();
    this.isActive = false;
  }

  async initialize() {
    console.log('📱 Initializing AR mode...');
    
    // Listen for AR session start
    window.addEventListener('xr-session-started', (e) => {
      if (e.detail.mode === 'ar') {
        this.onARSessionStarted();
      }
    });

    window.addEventListener('xr-session-ended', () => {
      this.onARSessionEnded();
    });
  }

  async onARSessionStarted() {
    console.log('🌐 AR Session started');
    this.isActive = true;

    // Enable hit-testing
    this.hitTestFeature = this.xrEngine.enableHitTest();
    
    if (this.hitTestFeature) {
      this.setupHitTesting();
    }

    // Make background transparent for AR
    this.scene.clearColor = new Color4(0, 0, 0, 0);
    
    // Setup AR-specific controls
    this.setupARControls();
  }

  onARSessionEnded() {
    console.log('🌐 AR Session ended');
    this.isActive = false;
    
    // Restore normal background
    this.scene.clearColor = new Color4(0.1, 0.1, 0.15, 1.0);
    
    // Clean up portals
    this.portals.forEach(portal => portal.dispose());
    this.portals = [];
  }

  setupHitTesting() {
    if (!this.hitTestFeature) return;

    // Create reticle for hit-test visualization
    this.reticle = this.createReticle();
    
    // Update hit-test on every frame
    this.scene.onBeforeRenderObservable.add(() => {
      this.updateHitTest();
    });

    console.log('🎯 AR Hit-testing enabled');
  }

  createReticle() {
    const reticle = MeshBuilder.CreateTorus('ar-reticle', {
      diameter: 0.3,
      thickness: 0.02,
      tessellation: 32
    }, this.scene);

    const material = new StandardMaterial('reticle-mat', this.scene);
    material.emissiveColor = new Color3(0, 1, 1);
    material.alpha = 0.7;
    reticle.material = material;

    reticle.isVisible = false;
    reticle.rotation.x = Math.PI / 2;

    return reticle;
  }

  updateHitTest() {
    if (!this.hitTestFeature || !this.xrEngine.xrHelper) return;

    try {
      const hitTestResults = this.hitTestFeature.getResults();
      
      if (hitTestResults.length > 0) {
        const hitTest = hitTestResults[0];
        const position = hitTest.position;
        
        // Update reticle position
        if (this.reticle) {
          this.reticle.position.set(position.x, position.y, position.z);
          this.reticle.isVisible = true;
        }

        // Store last hit position for portal spawning
        this.lastHitPosition = new Vector3(position.x, position.y, position.z);
      } else {
        if (this.reticle) {
          this.reticle.isVisible = false;
        }
      }
    } catch (error) {
      // Hit-test not available yet
    }
  }

  setupARControls() {
    // Listen for controller/touch input to spawn portals
    const controllers = this.xrEngine.getControllers();
    
    controllers.forEach(controller => {
      controller.onTriggerStateChangedObservable.add((state) => {
        if (state.pressed && this.lastHitPosition) {
          this.spawnPortal(this.lastHitPosition);
        }
      });
    });

    // For phone AR - tap to place
    this.scene.onPointerDown = () => {
      if (this.isActive && this.lastHitPosition) {
        this.spawnPortal(this.lastHitPosition);
      }
    };

    console.log('👆 AR controls setup complete');
  }

  spawnPortal(position, roomName = null) {
    console.log('🌀 Spawning portal at:', position);

    // Create portal mesh
    const portal = MeshBuilder.CreateCylinder('portal', {
      height: 2.5,
      diameter: 1.5,
      tessellation: 32
    }, this.scene);

    portal.position = position.clone();
    portal.position.y += 1.25; // Half height

    // Create portal material with shader
    const material = new StandardMaterial('portal-mat', this.scene);
    material.emissiveColor = new Color3(0.5, 0, 1);
    material.alpha = 0.7;
    portal.material = material;

    // Add portal ring effect
    const ring = MeshBuilder.CreateTorus('portal-ring', {
      diameter: 1.6,
      thickness: 0.05,
      tessellation: 64
    }, this.scene);
    ring.position = portal.position.clone();
    ring.rotation.x = Math.PI / 2;
    
    const ringMat = new StandardMaterial('ring-mat', this.scene);
    ringMat.emissiveColor = new Color3(0, 1, 1);
    ringMat.alpha = 0.9;
    ring.material = ringMat;

    // Animate portal
    let time = 0;
    this.scene.onBeforeRenderObservable.add(() => {
      time += 0.016;
      portal.rotation.y += 0.01;
      ring.rotation.z += 0.02;
      
      // Pulse effect
      const scale = 1 + Math.sin(time * 3) * 0.1;
      ring.scaling.set(scale, scale, scale);
    });

    // Store portal data
    const portalData = {
      mesh: portal,
      ring: ring,
      position: position.clone(),
      roomName: roomName,
      createdAt: Date.now()
    };

    this.portals.push(portalData);

    // Make portal interactive
    portal.actionManager = new BABYLON.ActionManager(this.scene);
    portal.actionManager.registerAction(
      new BABYLON.ExecuteCodeAction(
        BABYLON.ActionManager.OnPickTrigger,
        () => {
          this.enterPortal(portalData);
        }
      )
    );

    // Haptic feedback
    const controllers = this.xrEngine.getControllers();
    if (controllers.length > 0) {
      this.triggerHaptic(controllers[0], 0.5, 200);
    }

    return portalData;
  }

  enterPortal(portalData) {
    console.log('🚪 Entering portal...');

    // Transition to VR room
    if (portalData.roomName) {
      window.dispatchEvent(new CustomEvent('portal-enter', {
        detail: { 
          roomName: portalData.roomName,
          fromAR: true 
        }
      }));
    }

    // Exit AR, enter VR
    this.xrEngine.exitXR().then(() => {
      this.xrEngine.enterVR();
    });
  }

  removePortal(index) {
    if (this.portals[index]) {
      this.portals[index].mesh.dispose();
      this.portals[index].ring.dispose();
      this.portals.splice(index, 1);
    }
  }

  clearAllPortals() {
    this.portals.forEach(portal => {
      portal.mesh.dispose();
      portal.ring.dispose();
    });
    this.portals = [];
    console.log('🧹 All portals cleared');
  }

  async createAnchor(position) {
    // Create WebXR anchor for persistent AR placement
    if (!this.xrEngine.xrHelper?.sessionManager?.session) {
      console.warn('Cannot create anchor: No XR session');
      return null;
    }

    try {
      const session = this.xrEngine.xrHelper.sessionManager.session;
      const referenceSpace = this.xrEngine.xrHelper.sessionManager.referenceSpace;
      
      // Create anchor (if supported)
      if (session.requestReferenceSpace && session.createAnchor) {
        const pose = new XRRigidTransform({
          x: position.x,
          y: position.y,
          z: position.z
        });

        const anchor = await session.createAnchor(pose, referenceSpace);
        
        const anchorId = 'anchor_' + Date.now();
        this.arAnchors.set(anchorId, anchor);
        
        console.log('⚓ AR anchor created:', anchorId);
        return anchorId;
      }
    } catch (error) {
      console.warn('Anchor creation failed:', error);
      return null;
    }
  }

  triggerHaptic(controller, intensity, duration) {
    try {
      const gamepad = controller.motionController?.gamepad;
      if (gamepad?.hapticActuators?.length > 0) {
        gamepad.hapticActuators[0].pulse(intensity, duration);
      }
    } catch (error) {
      // Haptics not supported
    }
  }

  dispose() {
    this.clearAllPortals();
    
    if (this.reticle) {
      this.reticle.dispose();
    }

    this.arAnchors.clear();
    console.log('AR mode disposed');
  }
}

export default ARMode;
