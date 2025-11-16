/**
 * MODULARITY SPATIAL OS - RECORDING STUDIO SCENE
 * Professional audio recording environment
 */

import * as THREE from 'three';

export class RecordingStudioScene {
  constructor(engine, camera) {
    this.engine = engine;
    this.scene = engine.scene;
    this.camera = camera;
  }

  init() {
    console.log('🎙️ Initializing Recording Studio...');
    
    this.loadControlRoom();
    this.loadVocalBooth();
    this.loadLiveRoom();
    this.loadLighting();
    
    // Set camera spawn
    this.camera.position.set(0, 1.6, 8);
    this.camera.rotation.set(0, 0, 0);
    
    console.log('✅ Recording Studio ready');
  }

  loadLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.3);
    this.scene.add(ambient);

    // Warm control room lighting
    const controlLight = new THREE.PointLight(0xffaa88, 1.2, 15);
    controlLight.position.set(0, 3, 5);
    controlLight.castShadow = true;
    this.scene.add(controlLight);

    // Cool booth lighting
    const boothLight = new THREE.PointLight(0x88aaff, 1.0, 10);
    boothLight.position.set(0, 3, -5);
    boothLight.castShadow = true;
    this.scene.add(boothLight);
  }

  loadControlRoom() {
    // Floor
    const floorGeo = new THREE.BoxGeometry(12, 0.2, 10);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.9
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.position.y = -0.1;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Mixing console
    const consoleGeo = new THREE.BoxGeometry(3, 0.8, 1.5);
    const consoleMat = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a2a,
      roughness: 0.5,
      metalness: 0.6
    });
    const mixingConsole = new THREE.Mesh(consoleGeo, consoleMat);
    mixingConsole.position.set(0, 0.9, 3);
    mixingConsole.castShadow = true;
    this.scene.add(mixingConsole);

    // Monitor speakers (left)
    const speakerGeo = new THREE.BoxGeometry(0.4, 0.6, 0.4);
    const speakerMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.7
    });
    const leftSpeaker = new THREE.Mesh(speakerGeo, speakerMat);
    leftSpeaker.position.set(-1.5, 1.8, 2.5);
    leftSpeaker.castShadow = true;
    this.scene.add(leftSpeaker);

    // Monitor speakers (right)
    const rightSpeaker = new THREE.Mesh(speakerGeo.clone(), speakerMat.clone());
    rightSpeaker.position.set(1.5, 1.8, 2.5);
    rightSpeaker.castShadow = true;
    this.scene.add(rightSpeaker);

    // Control room walls
    const wallGeo = new THREE.BoxGeometry(12, 4, 0.3);
    const wallMat = new THREE.MeshStandardMaterial({ 
      color: 0x3a3a3a,
      roughness: 0.8
    });
    const backWall = new THREE.Mesh(wallGeo, wallMat);
    backWall.position.set(0, 2, 5);
    backWall.receiveShadow = true;
    this.scene.add(backWall);
  }

  loadVocalBooth() {
    // Booth structure
    const boothGeo = new THREE.BoxGeometry(3, 3, 3);
    const boothMat = new THREE.MeshStandardMaterial({ 
      color: 0x4a4a4a,
      roughness: 0.9,
      transparent: true,
      opacity: 0.8,
      side: THREE.DoubleSide
    });
    const booth = new THREE.Mesh(boothGeo, boothMat);
    booth.position.set(0, 1.5, -5);
    this.scene.add(booth);

    // Microphone stand
    const standGeo = new THREE.CylinderGeometry(0.05, 0.05, 1.5, 16);
    const standMat = new THREE.MeshStandardMaterial({ 
      color: 0x666666,
      roughness: 0.3,
      metalness: 0.8
    });
    const micStand = new THREE.Mesh(standGeo, standMat);
    micStand.position.set(0, 0.75, -5);
    micStand.castShadow = true;
    this.scene.add(micStand);

    // Microphone
    const micGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.3, 16);
    const micMat = new THREE.MeshStandardMaterial({ 
      color: 0xaaaaaa,
      roughness: 0.2,
      metalness: 0.9
    });
    const mic = new THREE.Mesh(micGeo, micMat);
    mic.position.set(0, 1.6, -5);
    mic.rotation.x = Math.PI / 2;
    mic.castShadow = true;
    this.scene.add(mic);

    // Acoustic foam panels
    for (let i = 0; i < 4; i++) {
      const foamGeo = new THREE.BoxGeometry(0.5, 0.5, 0.1);
      const foamMat = new THREE.MeshStandardMaterial({ 
        color: 0x2a2a2a,
        roughness: 1.0
      });
      const foam = new THREE.Mesh(foamGeo, foamMat);
      const angle = (i / 4) * Math.PI * 2;
      foam.position.set(
        Math.cos(angle) * 1.4,
        2,
        -5 + Math.sin(angle) * 1.4
      );
      foam.rotation.y = -angle;
      this.scene.add(foam);
    }
  }

  loadLiveRoom() {
    // Additional instruments/equipment area
    const drumKitBase = new THREE.CylinderGeometry(0.6, 0.6, 0.1, 32);
    const drumMat = new THREE.MeshStandardMaterial({ 
      color: 0x8b0000,
      roughness: 0.4,
      metalness: 0.3
    });
    const bassDrum = new THREE.Mesh(drumKitBase, drumMat);
    bassDrum.position.set(4, 0.5, -2);
    bassDrum.rotation.x = Math.PI / 2;
    bassDrum.castShadow = true;
    this.scene.add(bassDrum);
  }

  update(delta) {
    // Optional: animate VU meters, etc.
  }
}
