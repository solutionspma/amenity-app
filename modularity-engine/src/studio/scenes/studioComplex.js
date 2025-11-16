/**
 * MODULARITY SPATIAL OS - STUDIO COMPLEX SCENE
 * Main hallway with doors to different studios
 */

import * as THREE from 'three';

export class StudioComplexScene {
  constructor(engine, camera) {
    this.engine = engine;
    this.scene = engine.scene;
    this.camera = camera;
  }

  init() {
    console.log('🏢 Initializing Studio Complex...');
    
    this.addLighting();
    this.addHallway();
    this.addRecordingStudioDoor();
    this.addTVStudioDoor();
    this.addDressingRoomDoor();
    
    // Set camera spawn position
    this.camera.position.set(0, 1.6, 10);
    this.camera.rotation.set(0, 0, 0);
    
    console.log('✅ Studio Complex ready');
  }

  addLighting() {
    // Ambient light
    const ambient = new THREE.AmbientLight(0xffffff, 0.4);
    this.scene.add(ambient);

    // Main hallway lights
    const ceiling1 = new THREE.PointLight(0xfff5e6, 1.5, 30);
    ceiling1.position.set(0, 4, 0);
    ceiling1.castShadow = true;
    this.scene.add(ceiling1);

    const ceiling2 = new THREE.PointLight(0xfff5e6, 1.5, 30);
    ceiling2.position.set(0, 4, -15);
    ceiling2.castShadow = true;
    this.scene.add(ceiling2);

    const ceiling3 = new THREE.PointLight(0xfff5e6, 1.5, 30);
    ceiling3.position.set(0, 4, 15);
    ceiling3.castShadow = true;
    this.scene.add(ceiling3);
  }

  addHallway() {
    // Floor
    const floorGeo = new THREE.PlaneGeometry(10, 50);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a2a,
      roughness: 0.8,
      metalness: 0.2
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(10, 50);
    const ceilingMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.9
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5;
    this.scene.add(ceiling);

    // Left wall
    const leftWallGeo = new THREE.PlaneGeometry(50, 5);
    const leftWallMat = new THREE.MeshStandardMaterial({ 
      color: 0x3a3a3a,
      roughness: 0.7
    });
    const leftWall = new THREE.Mesh(leftWallGeo, leftWallMat);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-5, 2.5, 0);
    leftWall.receiveShadow = true;
    this.scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(leftWallGeo.clone(), leftWallMat.clone());
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(5, 2.5, 0);
    rightWall.receiveShadow = true;
    this.scene.add(rightWall);
  }

  addRecordingStudioDoor() {
    // Door frame
    const frameGeo = new THREE.BoxGeometry(2.5, 3, 0.2);
    const frameMat = new THREE.MeshStandardMaterial({ 
      color: 0x8b4513,
      roughness: 0.6,
      metalness: 0.1
    });
    const door = new THREE.Mesh(frameGeo, frameMat);
    door.position.set(-4.8, 1.5, -10);
    door.rotation.y = Math.PI / 2;
    door.castShadow = true;
    this.scene.add(door);

    // Door label
    const labelGeo = new THREE.PlaneGeometry(2, 0.5);
    const labelMat = new THREE.MeshBasicMaterial({ 
      color: 0xff0000,
      emissive: 0xff0000,
      emissiveIntensity: 0.5
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(-4.7, 3.2, -10);
    label.rotation.y = Math.PI / 2;
    this.scene.add(label);

    // Add click interaction data
    door.userData = {
      type: 'portal',
      destination: 'recording',
      label: '🎙️ RECORDING STUDIO'
    };
  }

  addTVStudioDoor() {
    // Door frame
    const frameGeo = new THREE.BoxGeometry(2.5, 3, 0.2);
    const frameMat = new THREE.MeshStandardMaterial({ 
      color: 0x8b4513,
      roughness: 0.6,
      metalness: 0.1
    });
    const door = new THREE.Mesh(frameGeo, frameMat);
    door.position.set(4.8, 1.5, -10);
    door.rotation.y = -Math.PI / 2;
    door.castShadow = true;
    this.scene.add(door);

    // Door label
    const labelGeo = new THREE.PlaneGeometry(2, 0.5);
    const labelMat = new THREE.MeshBasicMaterial({ 
      color: 0x0000ff,
      emissive: 0x0000ff,
      emissiveIntensity: 0.5
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(4.7, 3.2, -10);
    label.rotation.y = -Math.PI / 2;
    this.scene.add(label);

    door.userData = {
      type: 'portal',
      destination: 'tv',
      label: '📺 TV STUDIO'
    };
  }

  addDressingRoomDoor() {
    const frameGeo = new THREE.BoxGeometry(2.5, 3, 0.2);
    const frameMat = new THREE.MeshStandardMaterial({ 
      color: 0x8b4513,
      roughness: 0.6
    });
    const door = new THREE.Mesh(frameGeo, frameMat);
    door.position.set(-4.8, 1.5, 10);
    door.rotation.y = Math.PI / 2;
    door.castShadow = true;
    this.scene.add(door);

    const labelGeo = new THREE.PlaneGeometry(2, 0.5);
    const labelMat = new THREE.MeshBasicMaterial({ 
      color: 0xffff00,
      emissive: 0xffff00,
      emissiveIntensity: 0.3
    });
    const label = new THREE.Mesh(labelGeo, labelMat);
    label.position.set(-4.7, 3.2, 10);
    label.rotation.y = Math.PI / 2;
    this.scene.add(label);

    door.userData = {
      type: 'portal',
      destination: 'dressing',
      label: '👔 DRESSING ROOM'
    };
  }

  update(delta) {
    // Optional: add animations here
  }
}
