/**
 * vrPointer.js
 * VR Laser Pointer for raycasting and object selection
 * Works with both Three.js and can be adapted for Babylon.js
 */

export class VRPointer {
  constructor(camera) {
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();

    // Laser beam visualization
    this.line = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 0, -5)
      ]),
      new THREE.LineBasicMaterial({ color: 0x66ccff, linewidth: 2 })
    );
    camera.add(this.line);

    // Pointer dot at end of laser
    this.dot = new THREE.Mesh(
      new THREE.SphereGeometry(0.05),
      new THREE.MeshBasicMaterial({ color: 0x66ccff })
    );
    this.dot.visible = false;
    camera.add(this.dot);
  }

  update() {
    // Cast ray from camera forward
    const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(this.camera.quaternion);
    this.raycaster.set(this.camera.position, dir);
  }

  hit(objects) {
    return this.raycaster.intersectObjects(objects, true);
  }

  showDot(position) {
    this.dot.visible = true;
    this.dot.position.copy(position);
  }

  hideDot() {
    this.dot.visible = false;
  }
}
