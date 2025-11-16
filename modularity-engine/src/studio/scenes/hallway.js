/**
 * MODULARITY SPATIAL OS - HALLWAY SCENE
 * Connector between studio spaces
 */

import * as THREE from 'three';

export class HallwayScene {
  constructor(engine, camera) {
    this.engine = engine;
    this.scene = engine.scene;
    this.camera = camera;
  }

  init() {
    console.log('🚪 Initializing Hallway...');
    
    this.loadStructure();
    this.loadLighting();
    
    this.camera.position.set(0, 1.6, 0);
    this.camera.rotation.set(0, 0, 0);
    
    console.log('✅ Hallway ready');
  }

  loadLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    const hallLight = new THREE.PointLight(0xfff5e6, 1.0, 20);
    hallLight.position.set(0, 4, 0);
    hallLight.castShadow = true;
    this.scene.add(hallLight);
  }

  loadStructure() {
    // Simple hallway placeholder
    const floorGeo = new THREE.PlaneGeometry(6, 30);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a2a,
      roughness: 0.8
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);
  }

  update(delta) {}
}
