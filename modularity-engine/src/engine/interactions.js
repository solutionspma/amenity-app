/**
 * MODULARITY SPATIAL OS - INTERACTIONS
 * Handle object interactions, grabbing, UI, and gestures
 */

import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Ray } from '@babylonjs/core/Culling/ray';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';

export class InteractionManager {
  constructor(scene, xrEngine) {
    this.scene = scene;
    this.xrEngine = xrEngine;
    this.interactables = new Map();
    this.grabbed = new Map(); // controller -> grabbed object
    this.raycastDistance = 10;
  }

  initialize() {
    console.log('👆 Initializing interaction manager...');
    
    // Setup desktop interactions (mouse/pointer)
    this.setupDesktopInteractions();
    this.setupObjectGrabbing();
    this.setupHoverEffects();
    
    // Setup VR interactions
    this.setupVRInteractions();
    
    console.log('✅ Interaction manager initialized');
  }

  setupObjectGrabbing() {
    let draggedMesh = null;
    let startingPoint;
    let isDragging = false;

    const getGroundPosition = () => {
      const pickinfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
      if (pickinfo.hit) {
        return pickinfo.pickedPoint;
      }
      return null;
    };

    const originalPointerDown = this.scene.onPointerDown;
    this.scene.onPointerDown = (evt) => {
      if (originalPointerDown) originalPointerDown(evt);
      
      // Only left click, no scroll wheel
      if (evt.button !== 0) return;
      
      const pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
      
      if (pickInfo.hit && pickInfo.pickedMesh) {
        const mesh = pickInfo.pickedMesh;
        
        if (mesh.name.includes('pew') || mesh.name.includes('chair') || 
            mesh.name.includes('table') || mesh.name.includes('seat') ||
            mesh.name.includes('desk') || mesh.name.includes('beanbag')) {
          
          startingPoint = getGroundPosition();
          if (startingPoint) {
            draggedMesh = mesh;
            isDragging = true;
            console.log('🖐️ Grabbed:', mesh.name);
          }
        }
      }
    };

    this.scene.onPointerUp = () => {
      if (draggedMesh) {
        console.log('✋ Released:', draggedMesh.name);
      }
      startingPoint = null;
      draggedMesh = null;
      isDragging = false;
    };

    this.scene.onPointerMove = (evt) => {
      // Ignore if not dragging or if it's a wheel event
      if (!isDragging || !startingPoint || !draggedMesh) return;
      if (evt.event && evt.event.type === 'wheel') return;
      
      const current = getGroundPosition();
      if (!current) return;

      const diff = current.subtract(startingPoint);
      draggedMesh.position.addInPlace(diff);
      startingPoint = current;
    };
    
    // Disable wheel scrolling on canvas to prevent interference
    if (this.canvas) {
      this.canvas.addEventListener('wheel', (evt) => {
        evt.preventDefault();
      }, { passive: false });
    }
  }

  setupHoverEffects() {
    let highlightedMesh = null;

    const originalPointerMove = this.scene.onPointerMove;
    this.scene.onPointerMove = (evt) => {
      if (originalPointerMove) originalPointerMove(evt);
      
      const pickInfo = this.scene.pick(this.scene.pointerX, this.scene.pointerY);
      
      if (highlightedMesh && (!pickInfo.hit || pickInfo.pickedMesh !== highlightedMesh)) {
        if (highlightedMesh.material && highlightedMesh.material.emissiveColor) {
          highlightedMesh.material.emissiveColor.set(0, 0, 0);
        }
        highlightedMesh = null;
      }
      
      if (pickInfo.hit && pickInfo.pickedMesh) {
        const mesh = pickInfo.pickedMesh;
        
        if (mesh.name.includes('pew') || mesh.name.includes('chair') || 
            mesh.name.includes('table') || mesh.name.includes('seat') ||
            mesh.name.includes('desk') || mesh.name.includes('beanbag')) {
          
          if (mesh.material && !highlightedMesh) {
            highlightedMesh = mesh;
            if (mesh.material.emissiveColor) {
              mesh.material.emissiveColor.set(0.2, 0.2, 0.1);
            }
          }
        }
      }
    };
  }

  setupDesktopInteractions() {
    this.scene.onPointerObservable.add((pointerInfo) => {
      switch (pointerInfo.type) {
        case 1: // POINTERDOWN
          this.handleDesktopClick(pointerInfo);
          break;
        case 2: // POINTERUP
          // Handle release
          break;
        case 4: // POINTERMOVE
          this.handleDesktopHover(pointerInfo);
          break;
      }
    });
  }

  setupVRInteractions() {
    window.addEventListener('xr-session-started', () => {
      this.enableVRInteractions();
    });
  }

  enableVRInteractions() {
    console.log('🎮 Enabling VR interactions...');
    
    const controllers = this.xrEngine.getControllers();
    
    controllers.forEach((controller, index) => {
      // Trigger button for grabbing
      controller.onTriggerStateChangedObservable.add((state) => {
        if (state.pressed) {
          this.handleVRTriggerPress(controller, index);
        } else {
          this.handleVRTriggerRelease(controller, index);
        }
      });

      // Squeeze/grip for secondary actions
      controller.onSqueezeStateChangedObservable?.add((state) => {
        if (state.pressed) {
          this.handleVRGripPress(controller, index);
        }
      });

      // Button A/X for primary actions
      controller.onPrimaryButtonStateChangedObservable?.add((state) => {
        if (state.pressed) {
          this.handleVRPrimaryButton(controller, index);
        }
      });
    });
  }

  handleDesktopClick(pointerInfo) {
    const pickInfo = pointerInfo.pickInfo;
    
    if (pickInfo.hit && pickInfo.pickedMesh) {
      const mesh = pickInfo.pickedMesh;
      const interactable = this.interactables.get(mesh.id);
      
      if (interactable && interactable.onInteract) {
        interactable.onInteract(mesh, 'click');
        console.log('🖱️ Interacted with:', mesh.name);
      }
    }
  }

  handleDesktopHover(pointerInfo) {
    const pickInfo = pointerInfo.pickInfo;
    
    if (pickInfo.hit && pickInfo.pickedMesh) {
      const mesh = pickInfo.pickedMesh;
      const interactable = this.interactables.get(mesh.id);
      
      if (interactable && interactable.onHover) {
        interactable.onHover(mesh);
      }
    }
  }

  handleVRTriggerPress(controller, index) {
    // Raycast from controller
    const ray = this.getControllerRay(controller);
    const pickInfo = this.scene.pickWithRay(ray);
    
    if (pickInfo.hit && pickInfo.pickedMesh) {
      const mesh = pickInfo.pickedMesh;
      const interactable = this.interactables.get(mesh.id);
      
      if (interactable) {
        if (interactable.grabbable) {
          this.grabObject(controller, index, mesh);
        } else if (interactable.onInteract) {
          interactable.onInteract(mesh, 'trigger');
        }
      }
    }
  }

  handleVRTriggerRelease(controller, index) {
    if (this.grabbed.has(index)) {
      this.releaseObject(controller, index);
    }
  }

  handleVRGripPress(controller, index) {
    console.log('🤜 Grip pressed on controller', index);
    // Can be used for secondary interactions
  }

  handleVRPrimaryButton(controller, index) {
    console.log('🔘 Primary button pressed on controller', index);
    // Can be used for menu, etc.
  }

  grabObject(controller, controllerIndex, mesh) {
    console.log('✊ Grabbed:', mesh.name);
    
    // Store grabbed object
    this.grabbed.set(controllerIndex, {
      mesh: mesh,
      originalParent: mesh.parent,
      originalPosition: mesh.position.clone(),
      originalRotation: mesh.rotation.clone()
    });

    // Parent to controller
    mesh.setParent(controller.grip || controller.pointer);
    
    // Trigger grab event
    const interactable = this.interactables.get(mesh.id);
    if (interactable?.onGrab) {
      interactable.onGrab(mesh);
    }

    // Haptic feedback
    this.triggerHaptic(controller, 0.5, 100);
  }

  releaseObject(controller, controllerIndex) {
    const grabbed = this.grabbed.get(controllerIndex);
    if (!grabbed) return;

    console.log('✋ Released:', grabbed.mesh.name);
    
    // Unparent
    grabbed.mesh.setParent(grabbed.originalParent);
    
    // Trigger release event
    const interactable = this.interactables.get(grabbed.mesh.id);
    if (interactable?.onRelease) {
      interactable.onRelease(grabbed.mesh);
    }

    // Clear grabbed
    this.grabbed.delete(controllerIndex);
    
    // Haptic feedback
    this.triggerHaptic(controller, 0.3, 50);
  }

  registerInteractable(mesh, config = {}) {
    this.interactables.set(mesh.id, {
      mesh: mesh,
      grabbable: config.grabbable || false,
      onInteract: config.onInteract || null,
      onHover: config.onHover || null,
      onGrab: config.onGrab || null,
      onRelease: config.onRelease || null,
      ...config
    });

    console.log('📝 Registered interactable:', mesh.name);
  }

  unregisterInteractable(mesh) {
    this.interactables.delete(mesh.id);
  }

  getControllerRay(controller) {
    const position = controller.pointer.position;
    const forward = controller.pointer.forward;
    
    return new Ray(position, forward, this.raycastDistance);
  }

  triggerHaptic(controller, intensity = 0.5, duration = 100) {
    try {
      const gamepad = controller.motionController?.gamepad;
      if (gamepad && gamepad.hapticActuators && gamepad.hapticActuators.length > 0) {
        gamepad.hapticActuators[0].pulse(intensity, duration);
      }
    } catch (error) {
      // Haptics not supported or failed
    }
  }

  dispose() {
    this.interactables.clear();
    this.grabbed.clear();
    console.log('Interaction manager disposed');
  }
}

export default InteractionManager;
