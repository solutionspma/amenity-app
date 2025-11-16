/**
 * MODULARITY SPATIAL OS - TV STUDIO SCENE
 * Professional broadcast television studio
 */

import * as THREE from 'three';

export class TVStudioScene {
  constructor(engine, camera) {
    this.engine = engine;
    this.scene = engine.scene;
    this.camera = camera;
  }

  init() {
    console.log('📺 Initializing TV Studio...');
    
    this.loadMainSet();
    this.loadNewsDesk();
    this.loadInterviewSet();
    this.loadCameraRails();
    this.loadLighting();
    
    // Set camera spawn
    this.camera.position.set(0, 1.6, 12);
    this.camera.rotation.set(0, 0, 0);
    
    console.log('✅ TV Studio ready');
  }

  loadLighting() {
    const ambient = new THREE.AmbientLight(0xffffff, 0.5);
    this.scene.add(ambient);

    // Studio key lights
    const keyLight1 = new THREE.SpotLight(0xffffff, 2.0);
    keyLight1.position.set(-5, 8, 0);
    keyLight1.angle = Math.PI / 6;
    keyLight1.penumbra = 0.3;
    keyLight1.castShadow = true;
    this.scene.add(keyLight1);

    const keyLight2 = new THREE.SpotLight(0xffffff, 2.0);
    keyLight2.position.set(5, 8, 0);
    keyLight2.angle = Math.PI / 6;
    keyLight2.penumbra = 0.3;
    keyLight2.castShadow = true;
    this.scene.add(keyLight2);

    // Backlight
    const backLight = new THREE.SpotLight(0x88ccff, 1.5);
    backLight.position.set(0, 6, -8);
    backLight.angle = Math.PI / 4;
    this.scene.add(backLight);
  }

  loadMainSet() {
    // Studio floor
    const floorGeo = new THREE.PlaneGeometry(25, 20);
    const floorMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.6
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    // Cyclorama (curved backdrop)
    const cycGeo = new THREE.CylinderGeometry(10, 10, 8, 32, 1, true, 0, Math.PI);
    const cycMat = new THREE.MeshStandardMaterial({ 
      color: 0x0066ff,
      roughness: 0.9,
      side: THREE.DoubleSide
    });
    const cyc = new THREE.Mesh(cycGeo, cycMat);
    cyc.position.set(0, 4, -8);
    this.scene.add(cyc);

    // Ceiling
    const ceilingGeo = new THREE.PlaneGeometry(25, 20);
    const ceilingMat = new THREE.MeshStandardMaterial({ 
      color: 0x0a0a0a,
      roughness: 0.9
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 10;
    this.scene.add(ceiling);

    // Lighting grid
    for (let x = -10; x <= 10; x += 5) {
      for (let z = -8; z <= 8; z += 4) {
        const lightFixture = new THREE.Mesh(
          new THREE.CylinderGeometry(0.3, 0.3, 0.5, 16),
          new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.9 })
        );
        lightFixture.position.set(x, 9.5, z);
        this.scene.add(lightFixture);
      }
    }
  }

  loadNewsDesk() {
    // Desk structure
    const deskGeo = new THREE.BoxGeometry(4, 1, 1.5);
    const deskMat = new THREE.MeshStandardMaterial({ 
      color: 0x8b4513,
      roughness: 0.3,
      metalness: 0.2
    });
    const desk = new THREE.Mesh(deskGeo, deskMat);
    desk.position.set(0, 0.5, -3);
    desk.castShadow = true;
    this.scene.add(desk);

    // Desk monitors (left)
    const monitorGeo = new THREE.BoxGeometry(0.8, 0.5, 0.05);
    const monitorMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.2,
      metalness: 0.8,
      emissive: 0x003366,
      emissiveIntensity: 0.5
    });
    const leftMonitor = new THREE.Mesh(monitorGeo, monitorMat);
    leftMonitor.position.set(-1.2, 1.3, -3);
    leftMonitor.rotation.y = Math.PI / 8;
    this.scene.add(leftMonitor);

    // Desk monitors (right)
    const rightMonitor = new THREE.Mesh(monitorGeo.clone(), monitorMat.clone());
    rightMonitor.position.set(1.2, 1.3, -3);
    rightMonitor.rotation.y = -Math.PI / 8;
    this.scene.add(rightMonitor);

    // Anchor chair
    const chairGeo = new THREE.CylinderGeometry(0.4, 0.4, 1, 16);
    const chairMat = new THREE.MeshStandardMaterial({ 
      color: 0x2a2a2a,
      roughness: 0.6
    });
    const chair = new THREE.Mesh(chairGeo, chairMat);
    chair.position.set(0, 0.5, -1.5);
    chair.castShadow = true;
    this.scene.add(chair);
  }

  loadInterviewSet() {
    // Interview couch (left side of studio)
    const couchGeo = new THREE.BoxGeometry(3, 0.8, 1.2);
    const couchMat = new THREE.MeshStandardMaterial({ 
      color: 0x4a4a6a,
      roughness: 0.8
    });
    const couch = new THREE.Mesh(couchGeo, couchMat);
    couch.position.set(-6, 0.4, 2);
    couch.rotation.y = Math.PI / 4;
    couch.castShadow = true;
    this.scene.add(couch);

    // Coffee table
    const tableGeo = new THREE.BoxGeometry(1.2, 0.1, 0.8);
    const tableMat = new THREE.MeshStandardMaterial({ 
      color: 0x654321,
      roughness: 0.3,
      metalness: 0.1
    });
    const coffeeTable = new THREE.Mesh(tableGeo, tableMat);
    coffeeTable.position.set(-5, 0.5, 3);
    coffeeTable.castShadow = true;
    this.scene.add(coffeeTable);
  }

  loadCameraRails() {
    // Camera dolly track
    const railGeo = new THREE.BoxGeometry(0.2, 0.1, 15);
    const railMat = new THREE.MeshStandardMaterial({ 
      color: 0x666666,
      roughness: 0.3,
      metalness: 0.8
    });
    const leftRail = new THREE.Mesh(railGeo, railMat);
    leftRail.position.set(-1.5, 0.05, 4);
    this.scene.add(leftRail);

    const rightRail = new THREE.Mesh(railGeo.clone(), railMat.clone());
    rightRail.position.set(1.5, 0.05, 4);
    this.scene.add(rightRail);

    // Camera pedestal
    const pedestalGeo = new THREE.CylinderGeometry(0.3, 0.3, 1.5, 16);
    const pedestalMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.4,
      metalness: 0.7
    });
    const cameraPedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    cameraPedestal.position.set(0, 0.75, 8);
    cameraPedestal.castShadow = true;
    this.scene.add(cameraPedestal);

    // Camera body
    const cameraGeo = new THREE.BoxGeometry(0.6, 0.4, 0.8);
    const cameraMat = new THREE.MeshStandardMaterial({ 
      color: 0x1a1a1a,
      roughness: 0.3,
      metalness: 0.8
    });
    const cameraBody = new THREE.Mesh(cameraGeo, cameraMat);
    cameraBody.position.set(0, 1.8, 8);
    cameraBody.castShadow = true;
    this.scene.add(cameraBody);
  }

  update(delta) {
    // Optional: animate camera movement on rails
  }
}
