/**
 * MODULARITY SPATIAL OS - MOVEMENT CONTROLLER
 * Handles user movement in VR/Desktop modes
 */

import { ActionManager } from '@babylonjs/core/Actions/actionManager';
import { ExecuteCodeAction } from '@babylonjs/core/Actions/directActions';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Ray } from '@babylonjs/core/Culling/ray';
import { Color3 } from '@babylonjs/core/Maths/math.color';

export class MovementController {
  constructor(scene, xrEngine) {
    this.scene = scene;
    this.xrEngine = xrEngine;
    this.teleportationEnabled = true;
    this.smoothLocomotionSpeed = 2.0;
    this.snapTurnAngle = 45;
    this.movementMode = 'teleport'; // teleport, smooth, hybrid
  }

  initialize() {
    console.log('🚶 Initializing movement controller...');
    
    // Setup desktop movement (WASD + mouse)
    this.setupDesktopControls();
    
    // Setup VR movement
    this.setupVRMovement();
    
    console.log('✅ Movement controller initialized');
  }

  setupDesktopControls() {
    console.log('⌨️ Desktop controls enabled');
    
    // WASD movement
    const inputMap = {};
    this.scene.actionManager = new ActionManager(this.scene);
    
    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyDownTrigger, (evt) => {
        inputMap[evt.sourceEvent.key] = evt.sourceEvent.type === 'keydown';
      })
    );
    
    this.scene.actionManager.registerAction(
      new ExecuteCodeAction(ActionManager.OnKeyUpTrigger, (evt) => {
        inputMap[evt.sourceEvent.key] = false;
      })
    );
    
    // Movement loop
    this.scene.onBeforeRenderObservable.add(() => {
      if (!this.camera) return;
      
      const speed = 0.1;
      
      if (inputMap['w'] || inputMap['W']) {
        this.camera.position.addInPlace(this.camera.getDirection(this.camera.getForwardRay().direction).scale(speed));
      }
      if (inputMap['s'] || inputMap['S']) {
        this.camera.position.subtractInPlace(this.camera.getDirection(this.camera.getForwardRay().direction).scale(speed));
      }
      if (inputMap['a'] || inputMap['A']) {
        const left = this.camera.getDirection(this.camera.getForwardRay().direction).cross(this.camera.upVector);
        this.camera.position.subtractInPlace(left.scale(speed));
      }
      if (inputMap['d'] || inputMap['D']) {
        const right = this.camera.getDirection(this.camera.getForwardRay().direction).cross(this.camera.upVector);
        this.camera.position.addInPlace(right.scale(speed));
      }
    });
    
    // Teleport on click
    this.setupTeleportNavigation();
  }

  setupTeleportNavigation() {
    console.log('📍 Teleport navigation enabled');
    
    this.scene.onPointerDown = (evt, pickResult) => {
      if (evt.button === 0 && pickResult.hit) { // Left click
        if (pickResult.pickedMesh && pickResult.pickedMesh.name.includes('ground')) {
          // Teleport to clicked position
          const targetPos = pickResult.pickedPoint.clone();
          targetPos.y = 1.6; // Eye height
          
          // Smooth teleport animation
          this.animateTeleport(this.camera.position, targetPos);
          
          console.log('✨ Teleported to:', targetPos);
        }
      }
    };
  }

  animateTeleport(from, to) {
    const frames = 10;
    let currentFrame = 0;
    
    const teleportInterval = setInterval(() => {
      currentFrame++;
      const t = currentFrame / frames;
      
      this.camera.position.x = from.x + (to.x - from.x) * t;
      this.camera.position.z = from.z + (to.z - from.z) * t;
      
      if (currentFrame >= frames) {
        clearInterval(teleportInterval);
      }
    }, 16);
  }

  setupVRMovement() {
    // Listen for XR session start
    window.addEventListener('xr-session-started', (e) => {
      const mode = e.detail.mode;
      
      if (mode === 'vr') {
        this.enableVRLocomotion();
      }
    });
  }

  enableVRLocomotion() {
    console.log('🎮 Enabling VR locomotion...');
    
    const xrHelper = this.xrEngine.xrHelper;
    
    if (!xrHelper) {
      console.warn('XR Helper not available');
      return;
    }

    // Enable teleportation
    if (this.teleportationEnabled && this.xrEngine.xrExperience?.teleportation) {
      this.setupTeleportation();
    }

    // Enable smooth locomotion
    if (this.movementMode === 'smooth' || this.movementMode === 'hybrid') {
      this.setupSmoothLocomotion();
    }

    // Enable snap turning
    this.setupSnapTurn();
  }

  setupTeleportation() {
    const teleportation = this.xrEngine.xrExperience.teleportation;
    
    if (teleportation) {
      // Customize teleportation visuals
      teleportation.rotationEnabled = true;
      teleportation.backwardsTeleportationDistance = 0.5;
      
      // Set teleportation color
      teleportation.parabolicRayEnabled = true;
      teleportation.straightRayEnabled = false;
      
      console.log('📍 Teleportation enabled');
    }
  }

  setupSmoothLocomotion() {
    const controllers = this.xrEngine.getControllers();
    
    controllers.forEach((controller, index) => {
      controller.onAxisValueChangedObservable.add((axes) => {
        if (axes.x !== undefined && axes.y !== undefined) {
          this.handleSmoothMovement(axes, index);
        }
      });
    });

    console.log('🏃 Smooth locomotion enabled');
  }

  handleSmoothMovement(axes, controllerIndex) {
    const camera = this.xrEngine.getCamera();
    if (!camera) return;

    const threshold = 0.2;
    if (Math.abs(axes.y) < threshold && Math.abs(axes.x) < threshold) return;

    // Get camera forward/right vectors
    const forward = camera.getForwardRay().direction;
    forward.y = 0; // Keep movement horizontal
    forward.normalize();

    const right = Vector3.Cross(forward, Vector3.Up());
    right.normalize();

    // Calculate movement
    const speed = this.smoothLocomotionSpeed * 0.016; // Per frame at ~60fps
    const movement = forward.scale(axes.y * speed).add(right.scale(axes.x * speed));

    // Apply movement
    camera.position.addInPlace(movement);
  }

  setupSnapTurn() {
    const controllers = this.xrEngine.getControllers();
    
    controllers.forEach((controller, index) => {
      let lastTurnTime = 0;
      const turnCooldown = 300; // ms

      controller.onAxisValueChangedObservable.add((axes) => {
        // Use thumbstick for snap turning (left/right on right controller)
        if (index === 1 && axes.x !== undefined) {
          const now = Date.now();
          if (now - lastTurnTime < turnCooldown) return;

          if (axes.x > 0.8) {
            this.snapTurn(this.snapTurnAngle);
            lastTurnTime = now;
          } else if (axes.x < -0.8) {
            this.snapTurn(-this.snapTurnAngle);
            lastTurnTime = now;
          }
        }
      });
    });

    console.log('🔄 Snap turn enabled');
  }

  snapTurn(angleDegrees) {
    const camera = this.xrEngine.getCamera();
    if (!camera) return;

    const angleRadians = (angleDegrees * Math.PI) / 180;
    
    // Rotate camera
    if (camera.rotationQuaternion) {
      const rotation = Vector3.RotationFromAxis(
        Vector3.Up(),
        angleRadians,
        Vector3.Zero()
      );
      camera.rotationQuaternion = camera.rotationQuaternion.multiply(
        rotation.toQuaternion()
      );
    } else {
      camera.rotation.y += angleRadians;
    }
  }

  setTeleportationEnabled(enabled) {
    this.teleportationEnabled = enabled;
    
    if (this.xrEngine.xrExperience?.teleportation) {
      if (enabled) {
        this.xrEngine.xrExperience.teleportation.attach();
      } else {
        this.xrEngine.xrExperience.teleportation.detach();
      }
    }
  }

  setMovementMode(mode) {
    this.movementMode = mode; // teleport, smooth, hybrid
    console.log(`🎯 Movement mode set to: ${mode}`);
  }

  setLocomotionSpeed(speed) {
    this.smoothLocomotionSpeed = speed;
  }

  setSnapTurnAngle(angle) {
    this.snapTurnAngle = angle;
  }

  teleportToPosition(position) {
    const camera = this.xrEngine.getCamera() || this.scene.activeCamera;
    if (camera) {
      camera.position = position.clone();
      console.log('📍 Teleported to:', position);
    }
  }

  dispose() {
    console.log('Movement controller disposed');
  }
}

export default MovementController;
