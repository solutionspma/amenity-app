/**
 * vrGrab.js
 * VR Object Grabbing and Manipulation System
 */

export class VRGrab {
  constructor(scene, pointer) {
    this.scene = scene;
    this.pointer = pointer;
    this.heldObject = null;
    this.originalParent = null;
    this.offset = new THREE.Vector3();
  }

  update(delta) {
    // If holding object, move it with camera
    if (this.heldObject) {
      const handPos = new THREE.Vector3(0, -0.3, -0.5);
      handPos.applyQuaternion(this.pointer.camera.quaternion);
      handPos.add(this.pointer.camera.position);
      
      this.heldObject.position.copy(handPos);
      this.heldObject.position.add(this.offset);
      return;
    }

    // Check for grab input
    const hits = this.pointer.hit(this.scene.children);
    if (hits.length > 0 && window.VRControls?.grabPressed) {
      const target = hits[0].object;
      
      // Only grab objects marked as grabbable
      if (target.userData.grabbable) {
        this.grab(target, hits[0].point);
      }
    }

    // Release on button release
    if (!window.VRControls?.grabPressed && this.heldObject) {
      this.release();
    }
  }

  grab(object, hitPoint) {
    this.heldObject = object;
    this.originalParent = object.parent;
    
    // Calculate offset from grab point to object center
    this.offset.copy(object.position).sub(hitPoint);
    
    // Visual feedback
    if (object.material) {
      object.material.emissive = new THREE.Color(0x4466ff);
    }
    
    console.log('✋ Grabbed:', object.name || 'object');
  }

  release() {
    if (this.heldObject) {
      // Reset visual feedback
      if (this.heldObject.material) {
        this.heldObject.material.emissive = new THREE.Color(0x000000);
      }
      
      console.log('🖐️ Released:', this.heldObject.name || 'object');
      this.heldObject = null;
      this.originalParent = null;
      this.offset.set(0, 0, 0);
    }
  }
}
