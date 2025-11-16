/**
 * vrTeleport.js
 * VR Teleportation System
 */

export class VRTeleport {
  constructor(scene, pointer) {
    this.pointer = pointer;
    this.scene = scene;
    this.teleportCooldown = 0;
    this.cooldownTime = 0.5; // seconds
    
    // Teleport marker
    this.marker = new THREE.Mesh(
      new THREE.RingGeometry(0.3, 0.5, 32),
      new THREE.MeshBasicMaterial({ 
        color: 0x00ff88,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.7
      })
    );
    this.marker.rotation.x = -Math.PI / 2;
    this.marker.visible = false;
    this.scene.add(this.marker);
  }

  update(delta) {
    // Update cooldown
    if (this.teleportCooldown > 0) {
      this.teleportCooldown -= delta;
    }

    // Check for teleport input
    if (!window.VRControls?.teleportPressed) {
      this.marker.visible = false;
      return;
    }

    // Show marker at raycast hit point
    const hit = this.pointer.hit(this.scene.children)[0];
    if (hit) {
      this.marker.visible = true;
      this.marker.position.copy(hit.point);
      this.marker.position.y += 0.01; // Slightly above floor
      
      // Teleport on cooldown reset
      if (this.teleportCooldown <= 0) {
        this.teleportTo(hit.point);
        this.teleportCooldown = this.cooldownTime;
      }
    } else {
      this.marker.visible = false;
    }
  }

  teleportTo(point) {
    // Move camera to point, maintaining height
    if (window.VR && window.VR.moveTo) {
      window.VR.moveTo(point.x, point.y + 1.6, point.z);
      console.log('📍 Teleported to:', point);
      
      // Haptic feedback
      if (navigator.vibrate) {
        navigator.vibrate([50, 30, 50]);
      }
    }
  }
}
