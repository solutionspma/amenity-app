/**
 * MODULARITY SPATIAL OS - SCENE MANAGER
 * Handles room loading, switching, and scene lifecycle
 */

import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Scene } from '@babylonjs/core/scene';
import { Vector3, Color4 } from '@babylonjs/core/Maths/math';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { SpotLight } from '@babylonjs/core/Lights/spotLight';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { VolumetricLightScatteringPostProcess } from '@babylonjs/core/PostProcesses/volumetricLightScatteringPostProcess';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';

// Babylon.js mesh builders (required for procedural geometry)
import '@babylonjs/core/Meshes/Builders/boxBuilder';
import '@babylonjs/core/Meshes/Builders/sphereBuilder';
import '@babylonjs/core/Meshes/Builders/groundBuilder';
import '@babylonjs/core/Meshes/Builders/cylinderBuilder';
import '@babylonjs/core/Meshes/Builders/planeBuilder';

import '@babylonjs/loaders/glTF';

export class SceneManager {
  constructor(engine) {
    this.engine = engine;
    this.scene = null;
    this.currentRoom = null;
    this.loadedRooms = new Map();
    this.roomMetadata = new Map();
  }

  createScene(canvas) {
    console.log('🎬 Creating Babylon.js scene...');
    
    this.scene = new Scene(this.engine);
    this.scene.clearColor = new Color4(0.1, 0.1, 0.15, 1.0);
    
    // Enable physics
    // this.scene.enablePhysics(); // Uncomment when physics needed
    
    // CRITICAL: Keep autoClear enabled so canvas clears between renders
    // This prevents room stacking/ghosting when switching rooms
    this.scene.autoClear = true;
    this.scene.autoClearDepthAndStencil = true;
    
    // Add global glow layer for emissive objects
    this.glowLayer = new GlowLayer('glow', this.scene);
    this.glowLayer.intensity = 0.5;
    
    // Add default ambient light
    const ambientLight = new HemisphericLight('ambient', new Vector3(0, 1, 0), this.scene);
    ambientLight.intensity = 0.3;
    ambientLight.groundColor = new Color3(0.2, 0.2, 0.3);
    
    console.log('✅ Scene created with glow layer');
    return this.scene;
  }

  /**
   * 🧨 NUCLEAR OPTION: Dispose EVERYTHING in the scene
   * This is the "turn it off and on again" fix
   */
  disposeAllRooms() {
    console.log('🧨 NUKING ALL ROOMS - Complete scene teardown');
    console.log(`   Scene has ${this.scene.meshes.length} meshes before cleanup`);
    
    // Dispose all loaded room data
    this.loadedRooms.forEach((roomData, roomName) => {
      console.log(`   💥 Disposing ${roomName} (${roomData.meshes.length} meshes)`);
      roomData.meshes.forEach(mesh => {
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach(mat => mat.dispose());
          } else {
            mesh.material.dispose();
          }
        }
        mesh.dispose();
      });
    });
    
    // Clear the maps
    this.loadedRooms.clear();
    this.roomMetadata.clear();
    this.currentRoom = null;
    
    console.log(`   Scene has ${this.scene.meshes.length} meshes after cleanup`);
    console.log('✅ Scene nuked - clean slate');
  }

  async loadRoom(roomName, metadata = {}) {
    console.log(`📦 Loading room: ${roomName}`);

    // 🧨 NUKE EVERYTHING FIRST - No more stacking!
    this.disposeAllRooms();

    try {
      // Try to load room GLB file (optional for now)
      try {
        const roomPath = `/src/rooms/${roomName}.glb`;
        const result = await SceneLoader.ImportMeshAsync(
          '',
          '',
          roomPath,
          this.scene
        );

        // Store loaded room data
        this.loadedRooms.set(roomName, {
          meshes: result.meshes,
          metadata: metadata,
          loadedAt: Date.now()
        });
      } catch (glbError) {
        console.warn(`⚠️ GLB file not found for ${roomName}, creating procedural geometry`);
        // Create basic 3D room using primitives
        const roomMeshes = this.createProceduralRoom(roomName, metadata);
        this.loadedRooms.set(roomName, {
          meshes: roomMeshes,
          metadata: metadata,
          loadedAt: Date.now()
        });
      }

      // Load room metadata
      await this.loadRoomMetadata(roomName);

      // Apply room-specific settings
      this.applyRoomSettings(roomName, metadata);

      // Make sure only this room is visible
      this.loadedRooms.forEach((roomData, name) => {
        if (name !== roomName) {
          roomData.meshes.forEach(mesh => mesh.setEnabled(false));
        }
      });

      this.currentRoom = roomName;
      
      // Reset camera to room's spawn point
      this.resetCameraPosition(roomName);
      
      console.log(`✅ Room ${roomName} ready`);
      
      // Dispatch room loaded event
      window.dispatchEvent(new CustomEvent('room-loaded', {
        detail: { roomName, metadata }
      }));

      return true;

    } catch (error) {
      console.error(`❌ Failed to load room ${roomName}:`, error);
      return false;
    }
  }

  async loadRoomMetadata(roomName) {
    try {
      const metadataPath = `/src/rooms/${roomName}.json`;
      const response = await fetch(metadataPath);
      const metadata = await response.json();
      
      this.roomMetadata.set(roomName, metadata);
      console.log(`📋 Metadata loaded for ${roomName}`);
      
      return metadata;
    } catch (error) {
      console.warn(`No metadata found for ${roomName}`);
      return null;
    }
  }

  async switchToRoom(roomName) {
    console.log(`🔄 Switching to room: ${roomName} (current: ${this.currentRoom})`);
    if (!this.loadedRooms.has(roomName)) {
      console.warn(`Room ${roomName} not loaded yet`);
      return await this.loadRoom(roomName);
    }

    // Hide ALL other rooms first
    this.loadedRooms.forEach((roomData, name) => {
      if (name !== roomName) {
        console.log(`   Hiding: ${name}`);
        roomData.meshes.forEach(mesh => mesh.setEnabled(false));
      }
    });

    // Show new room
    this.showRoom(roomName);
    this.currentRoom = roomName;

    console.log(`✅ Switched to ${roomName}`);
    return true;
  }

  hideRoom(roomName) {
    console.log(`👻 Hiding room: ${roomName}`);
    const roomData = this.loadedRooms.get(roomName);
    if (roomData) {
      console.log(`   Found ${roomData.meshes.length} meshes to hide`);
      roomData.meshes.forEach(mesh => {
        mesh.setEnabled(false);
      });
    } else {
      console.warn(`   Room data not found for ${roomName}`);
    }
  }

  showRoom(roomName) {
    console.log(`✨ Showing room: ${roomName}`);
    const roomData = this.loadedRooms.get(roomName);
    if (roomData) {
      console.log(`   Found ${roomData.meshes.length} meshes to show`);
      roomData.meshes.forEach(mesh => {
        mesh.setEnabled(true);
      });
    } else {
      console.warn(`   Room data not found for ${roomName}`);
    }
  }

  unloadRoom(roomName) {
    const roomData = this.loadedRooms.get(roomName);
    if (roomData) {
      // Dispose all meshes
      roomData.meshes.forEach(mesh => {
        mesh.dispose();
      });
      
      this.loadedRooms.delete(roomName);
      this.roomMetadata.delete(roomName);
      
      console.log(`🗑️ Unloaded room: ${roomName}`);
    }
  }

  applyRoomSettings(roomName, metadata) {
    const roomMeta = this.roomMetadata.get(roomName) || metadata;
    
    if (roomMeta) {
      // Apply lighting settings
      if (roomMeta.lighting) {
        this.applyLighting(roomMeta.lighting);
      }

      // Apply atmosphere settings
      if (roomMeta.atmosphere) {
        this.applyAtmosphere(roomMeta.atmosphere);
      }

      // Apply acoustic settings
      if (roomMeta.acoustics) {
        console.log('🎧 Acoustic settings:', roomMeta.acoustics);
        // Will be handled by spatialAudio.js
      }
    }
  }

  applyLighting(lightingConfig) {
    // Apply lighting based on config
    console.log('💡 Applying lighting configuration:', lightingConfig);
    // Implementation depends on specific lighting setup
  }

  applyAtmosphere(atmosphereConfig) {
    // Apply fog, color grading, etc.
    if (atmosphereConfig.fogMode) {
      this.scene.fogMode = Scene.FOGMODE_EXP;
      this.scene.fogDensity = atmosphereConfig.fogDensity || 0.01;
    }
  }

  getCurrentRoom() {
    return this.currentRoom;
  }

  getRoomMetadata(roomName) {
    return this.roomMetadata.get(roomName);
  }

  getLoadedRooms() {
    return Array.from(this.loadedRooms.keys());
  }

  resetCameraPosition(roomName) {
    const roomMeta = this.roomMetadata.get(roomName);
    const camera = this.scene.activeCamera;
    
    if (!camera) return;
    
    // Get spawn point from metadata or use default
    let spawnPos = { x: 0, y: 1.6, z: -10 };
    
    if (roomMeta && roomMeta.spawnPoints && roomMeta.spawnPoints.length > 0) {
      const spawn = roomMeta.spawnPoints[0]; // Use first spawn point
      spawnPos = {
        x: spawn.position[0],
        y: spawn.position[1] + 1.6, // Add eye height
        z: spawn.position[2]
      };
    }
    
    camera.position.set(spawnPos.x, spawnPos.y, spawnPos.z);
    
    // Reset camera rotation to look forward
    if (camera.rotation) {
      camera.rotation.set(0, 0, 0);
    }
    
    console.log(`📍 Camera reset to spawn point: (${spawnPos.x}, ${spawnPos.y}, ${spawnPos.z})`);
  }

  createProceduralRoom(roomName, metadata) {
    const meshes = [];
    
    console.log(`🏗️ Creating procedural ${roomName}...`);
    
    // Get room type from metadata or room name
    let roomType = metadata?.type || 'sanctuary';
    
    // Extract type from room name if not in metadata
    if (roomName.includes('sanctuary')) roomType = 'sanctuary';
    else if (roomName.includes('prayer')) roomType = 'prayerCircle';
    else if (roomName.includes('youth')) roomType = 'youthRoom';
    else if (roomName.includes('smallGroup')) roomType = 'smallGroup';
    else if (roomName.includes('classroom')) roomType = 'classroom';
    else if (roomName.includes('studio')) roomType = 'studio';
    else if (roomName.includes('fellowship')) roomType = 'hall';
    else if (roomName.includes('courtyard')) roomType = 'courtyard';
    
    console.log(`📐 Room type: ${roomType}`);
    
    // Create ground plane
    const ground = MeshBuilder.CreateGround(`${roomName}_ground`, {
      width: 40,
      height: 40
    }, this.scene);
    
    const groundMat = new StandardMaterial(`${roomName}_groundMat`, this.scene);
    groundMat.diffuseColor = new Color3(0.3, 0.25, 0.2); // Warm wood tone
    groundMat.specularColor = new Color3(0.1, 0.1, 0.1);
    ground.material = groundMat;
    ground.receiveShadows = true;
    meshes.push(ground);
    
    // Create walls based on room type
    if (roomType === 'sanctuary' || roomType === 'cathedral') {
      // Cathedral-style sanctuary
      this.createCathedralWalls(roomName, meshes);
      this.createAltar(roomName, meshes);
      this.createPews(roomName, meshes);
      this.createStainedGlassWindows(roomName, meshes);
      this.addGodRays(roomName, meshes); // Add volumetric lighting
    } else if (roomType === 'prayerCircle') {
      // Circular prayer space
      this.createCircularWalls(roomName, meshes);
      this.createPrayerSeats(roomName, meshes);
      this.createCenterPiece(roomName, meshes);
      this.addCandleParticles(roomName, meshes); // Add candle flicker effects
    } else if (roomType === 'youthRoom') {
      // Modern youth space
      this.createModernWalls(roomName, meshes);
      this.createCasualSeating(roomName, meshes);
      this.createStage(roomName, meshes);
      this.addNeonLights(roomName, meshes); // Add colored lighting
    } else if (roomType === 'smallGroup') {
      // Small group circle
      this.createCozyWalls(roomName, meshes);
      this.createCircleSeating(roomName, meshes);
      this.createCenterTable(roomName, meshes);
    } else if (roomType === 'classroom') {
      // Educational classroom
      this.createClassroomWalls(roomName, meshes);
      this.createDesks(roomName, meshes);
      this.createWhiteboard(roomName, meshes);
    } else if (roomType === 'studio') {
      // Recording studio
      this.createStudioWalls(roomName, meshes);
      this.createRecordingEquipment(roomName, meshes);
    } else if (roomType === 'hall') {
      // Fellowship hall
      this.createHallWalls(roomName, meshes);
      this.createBanquetTables(roomName, meshes);
    } else if (roomType === 'courtyard') {
      // Outdoor courtyard
      this.createOutdoorGround(roomName, meshes);
      this.createGardenElements(roomName, meshes);
      this.createFountain(roomName, meshes);
      this.addFireflies(roomName, meshes); // Add ambient particles
    } else {
      // Generic room
      this.createBasicWalls(roomName, meshes);
    }
    
    console.log(`✅ Created ${meshes.length} procedural meshes for ${roomName}`);
    return meshes;
  }

  // ✨ VISUAL EFFECTS METHODS

  addGodRays(roomName, meshes) {
    // Create a light source for god rays (sanctuary skylight)
    const lightSphere = MeshBuilder.CreateSphere(`${roomName}_lightSource`, {
      diameter: 2
    }, this.scene);
    lightSphere.position.set(0, 12, 10);
    
    const lightMat = new StandardMaterial(`${roomName}_lightMat`, this.scene);
    lightMat.emissiveColor = new Color3(1, 0.95, 0.8);
    lightSphere.material = lightMat;
    meshes.push(lightSphere);
    
    // Add volumetric light scattering (god rays)
    const godrays = new VolumetricLightScatteringPostProcess(
      'godrays',
      1.0,
      this.scene.activeCamera,
      lightSphere,
      100,
      Texture.BILINEAR_SAMPLINGMODE,
      this.engine,
      false
    );
    
    godrays.exposure = 0.3;
    godrays.decay = 0.96815;
    godrays.weight = 0.58767;
    godrays.density = 0.926;
    
    console.log('☀️ God rays added');
  }

  addCandleParticles(roomName, meshes) {
    // Create floating light particles around the prayer circle
    const particleSystem = new ParticleSystem(`${roomName}_candles`, 500, this.scene);
    
    // Particle emitter (center of circle)
    const emitter = MeshBuilder.CreateBox(`${roomName}_emitter`, { size: 0.1 }, this.scene);
    emitter.position.set(0, 2, 0);
    emitter.isVisible = false;
    particleSystem.emitter = emitter;
    
    particleSystem.particleTexture = new Texture('https://playground.babylonjs.com/textures/flare.png', this.scene);
    
    particleSystem.color1 = new Color4(1, 0.8, 0.3, 1);
    particleSystem.color2 = new Color4(1, 0.6, 0.2, 1);
    particleSystem.colorDead = new Color4(0.5, 0.3, 0.1, 0);
    
    particleSystem.minSize = 0.05;
    particleSystem.maxSize = 0.15;
    
    particleSystem.minLifeTime = 2;
    particleSystem.maxLifeTime = 4;
    
    particleSystem.emitRate = 20;
    
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
    
    particleSystem.gravity = new Vector3(0, 0.2, 0);
    
    particleSystem.direction1 = new Vector3(-0.5, 0.5, -0.5);
    particleSystem.direction2 = new Vector3(0.5, 1, 0.5);
    
    particleSystem.minEmitPower = 0.2;
    particleSystem.maxEmitPower = 0.4;
    particleSystem.updateSpeed = 0.01;
    
    particleSystem.start();
    
    console.log('🕯️ Candle particles added');
  }

  addNeonLights(roomName, meshes) {
    // Add colored point lights for youth room
    const colors = [
      new Color3(1, 0, 0.5),   // Pink
      new Color3(0, 0.5, 1),   // Blue
      new Color3(0.5, 1, 0)    // Green
    ];
    
    const positions = [
      new Vector3(-10, 8, 10),
      new Vector3(10, 8, 10),
      new Vector3(0, 8, -10)
    ];
    
    positions.forEach((pos, i) => {
      const light = new PointLight(`${roomName}_neon${i}`, pos, this.scene);
      light.diffuse = colors[i];
      light.intensity = 2;
      light.range = 20;
      
      // Create glowing sphere
      const lightMesh = MeshBuilder.CreateSphere(`${roomName}_neonMesh${i}`, { diameter: 0.5 }, this.scene);
      lightMesh.position = pos;
      const mat = new StandardMaterial(`${roomName}_neonMat${i}`, this.scene);
      mat.emissiveColor = colors[i];
      lightMesh.material = mat;
      meshes.push(lightMesh);
    });
    
    console.log('💡 Neon lights added');
  }

  addFireflies(roomName, meshes) {
    // Create firefly particle system for courtyard
    const particleSystem = new ParticleSystem(`${roomName}_fireflies`, 200, this.scene);
    
    const emitter = MeshBuilder.CreateBox(`${roomName}_fireflyEmitter`, { size: 30 }, this.scene);
    emitter.position.set(0, 2, 0);
    emitter.isVisible = false;
    particleSystem.emitter = emitter;
    
    particleSystem.particleTexture = new Texture('https://playground.babylonjs.com/textures/flare.png', this.scene);
    
    particleSystem.color1 = new Color4(0.8, 1, 0.6, 1);
    particleSystem.color2 = new Color4(0.6, 0.9, 0.4, 1);
    particleSystem.colorDead = new Color4(0.3, 0.5, 0.2, 0);
    
    particleSystem.minSize = 0.1;
    particleSystem.maxSize = 0.2;
    
    particleSystem.minLifeTime = 3;
    particleSystem.maxLifeTime = 6;
    
    particleSystem.emitRate = 10;
    
    particleSystem.blendMode = ParticleSystem.BLENDMODE_ADD;
    
    particleSystem.gravity = new Vector3(0, 0, 0);
    
    particleSystem.direction1 = new Vector3(-1, -0.5, -1);
    particleSystem.direction2 = new Vector3(1, 0.5, 1);
    
    particleSystem.minEmitPower = 0.5;
    particleSystem.maxEmitPower = 1;
    particleSystem.updateSpeed = 0.02;
    
    particleSystem.start();
    
    console.log('✨ Fireflies added');
  }

  createCathedralWalls(roomName, meshes) {
    // Front wall with arch
    const frontWall = MeshBuilder.CreateBox(`${roomName}_frontWall`, {
      width: 30,
      height: 15,
      depth: 1
    }, this.scene);
    frontWall.position.z = 20;
    frontWall.position.y = 7.5;
    
    const wallMat = new StandardMaterial(`${roomName}_wallMat`, this.scene);
    wallMat.diffuseColor = new Color3(0.85, 0.82, 0.75); // Stone color
    frontWall.material = wallMat;
    meshes.push(frontWall);
    
    // Side walls
    const leftWall = MeshBuilder.CreateBox(`${roomName}_leftWall`, {
      width: 1,
      height: 15,
      depth: 40
    }, this.scene);
    leftWall.position.x = -15;
    leftWall.position.y = 7.5;
    leftWall.material = wallMat;
    meshes.push(leftWall);
    
    const rightWall = leftWall.clone(`${roomName}_rightWall`);
    rightWall.position.x = 15;
    meshes.push(rightWall);
    
    // Back wall
    const backWall = frontWall.clone(`${roomName}_backWall`);
    backWall.position.z = -20;
    meshes.push(backWall);
  }

  createAltar(roomName, meshes) {
    // Altar platform
    const altar = MeshBuilder.CreateBox(`${roomName}_altar`, {
      width: 6,
      height: 0.5,
      depth: 3
    }, this.scene);
    altar.position.z = 15;
    altar.position.y = 0.25;
    
    const altarMat = new StandardMaterial(`${roomName}_altarMat`, this.scene);
    altarMat.diffuseColor = new Color3(0.6, 0.5, 0.3); // Golden wood
    altarMat.specularColor = new Color3(0.3, 0.3, 0.2);
    altar.material = altarMat;
    meshes.push(altar);
    
    // Cross above altar
    const crossVertical = MeshBuilder.CreateBox(`${roomName}_crossV`, {
      width: 0.3,
      height: 3,
      depth: 0.3
    }, this.scene);
    crossVertical.position.set(0, 9, 19);
    
    const crossMat = new StandardMaterial(`${roomName}_crossMat`, this.scene);
    crossMat.diffuseColor = new Color3(0.9, 0.85, 0.7); // Bright gold
    crossMat.emissiveColor = new Color3(0.3, 0.25, 0.2);
    crossVertical.material = crossMat;
    meshes.push(crossVertical);
    
    const crossHorizontal = MeshBuilder.CreateBox(`${roomName}_crossH`, {
      width: 2,
      height: 0.3,
      depth: 0.3
    }, this.scene);
    crossHorizontal.position.set(0, 9.5, 19); // Positioned 1/3 from top of vertical bar
    crossHorizontal.material = crossMat;
    meshes.push(crossHorizontal);
  }

  createPews(roomName, meshes) {
    const pewMat = new StandardMaterial(`${roomName}_pewMat`, this.scene);
    pewMat.diffuseColor = new Color3(0.4, 0.3, 0.2); // Dark wood
    
    // Create rows of pews
    for (let row = 0; row < 6; row++) {
      // Left side pews
      const leftPew = MeshBuilder.CreateBox(`${roomName}_pew_L${row}`, {
        width: 8,
        height: 1.2,
        depth: 1.5
      }, this.scene);
      leftPew.position.set(-6, 0.6, 10 - row * 3);
      leftPew.material = pewMat;
      meshes.push(leftPew);
      
      // Right side pews
      const rightPew = leftPew.clone(`${roomName}_pew_R${row}`);
      rightPew.position.x = 6;
      meshes.push(rightPew);
    }
  }

  createStainedGlassWindows(roomName, meshes) {
    const colors = [
      new Color3(0.8, 0.2, 0.2), // Red
      new Color3(0.2, 0.2, 0.8), // Blue
      new Color3(0.8, 0.6, 0.2), // Gold
      new Color3(0.2, 0.6, 0.8), // Cyan
    ];
    
    // Windows on left wall
    for (let i = 0; i < 4; i++) {
      const window = MeshBuilder.CreatePlane(`${roomName}_window_L${i}`, {
        width: 2,
        height: 6
      }, this.scene);
      window.position.set(-14.9, 6, 10 - i * 8);
      window.rotation.y = Math.PI / 2;
      
      const windowMat = new StandardMaterial(`${roomName}_windowMat_L${i}`, this.scene);
      windowMat.diffuseColor = colors[i % colors.length];
      windowMat.emissiveColor = colors[i % colors.length].scale(0.3);
      windowMat.alpha = 0.7;
      window.material = windowMat;
      meshes.push(window);
      
      // Mirror on right wall
      const windowR = window.clone(`${roomName}_window_R${i}`);
      windowR.position.x = 14.9;
      windowR.material = windowMat.clone(`${roomName}_windowMat_R${i}`);
      meshes.push(windowR);
    }
  }

  createCircularWalls(roomName, meshes) {
    // Circular outer wall
    const wall = MeshBuilder.CreateCylinder(`${roomName}_wall`, {
      diameter: 20,
      height: 8,
      tessellation: 32
    }, this.scene);
    wall.position.y = 4;
    
    const wallMat = new StandardMaterial(`${roomName}_wallMat`, this.scene);
    wallMat.diffuseColor = new Color3(0.9, 0.88, 0.85);
    wallMat.backFaceCulling = false;
    wall.material = wallMat;
    meshes.push(wall);
  }

  createPrayerSeats(roomName, meshes) {
    const seatMat = new StandardMaterial(`${roomName}_seatMat`, this.scene);
    seatMat.diffuseColor = new Color3(0.5, 0.4, 0.6); // Purple cushions
    
    // Create circle of seats
    const numSeats = 12;
    const radius = 6;
    
    for (let i = 0; i < numSeats; i++) {
      const angle = (i / numSeats) * Math.PI * 2;
      const seat = MeshBuilder.CreateBox(`${roomName}_seat${i}`, {
        width: 1.5,
        height: 0.8,
        depth: 1.5
      }, this.scene);
      
      seat.position.x = Math.cos(angle) * radius;
      seat.position.z = Math.sin(angle) * radius;
      seat.position.y = 0.4;
      seat.rotation.y = -angle + Math.PI / 2;
      seat.material = seatMat;
      meshes.push(seat);
    }
  }

  createCenterPiece(roomName, meshes) {
    // Glowing center orb (represents Holy Spirit)
    const orb = MeshBuilder.CreateSphere(`${roomName}_orb`, {
      diameter: 1.5
    }, this.scene);
    orb.position.y = 3;
    
    const orbMat = new StandardMaterial(`${roomName}_orbMat`, this.scene);
    orbMat.diffuseColor = new Color3(1, 1, 0.9);
    orbMat.emissiveColor = new Color3(0.9, 0.85, 0.6);
    orbMat.alpha = 0.8;
    orb.material = orbMat;
    meshes.push(orb);
  }

  createModernWalls(roomName, meshes) {
    const wallMat = new StandardMaterial(`${roomName}_wallMat`, this.scene);
    wallMat.diffuseColor = new Color3(0.3, 0.35, 0.4); // Modern gray
    
    // Create box room
    const walls = MeshBuilder.CreateBox(`${roomName}_walls`, {
      width: 25,
      height: 10,
      depth: 25
    }, this.scene);
    walls.position.y = 5;
    walls.material = wallMat;
    wallMat.backFaceCulling = false;
    meshes.push(walls);
  }

  createCasualSeating(roomName, meshes) {
    const colors = [
      new Color3(0.9, 0.3, 0.3), // Red
      new Color3(0.3, 0.6, 0.9), // Blue
      new Color3(0.9, 0.7, 0.2), // Yellow
      new Color3(0.4, 0.8, 0.4), // Green
    ];
    
    // Bean bags in clusters
    for (let i = 0; i < 8; i++) {
      const bag = MeshBuilder.CreateSphere(`${roomName}_beanbag${i}`, {
        diameter: 1.2,
        segments: 8
      }, this.scene);
      
      const angle = (i / 8) * Math.PI * 2;
      bag.position.x = Math.cos(angle) * 5;
      bag.position.z = Math.sin(angle) * 5;
      bag.position.y = 0.5;
      bag.scaling.y = 0.6; // Squash it
      
      const bagMat = new StandardMaterial(`${roomName}_bagMat${i}`, this.scene);
      bagMat.diffuseColor = colors[i % colors.length];
      bag.material = bagMat;
      meshes.push(bag);
    }
  }

  createStage(roomName, meshes) {
    const stage = MeshBuilder.CreateBox(`${roomName}_stage`, {
      width: 10,
      height: 1,
      depth: 5
    }, this.scene);
    stage.position.set(0, 0.5, -10);
    
    const stageMat = new StandardMaterial(`${roomName}_stageMat`, this.scene);
    stageMat.diffuseColor = new Color3(0.2, 0.2, 0.2); // Black stage
    stage.material = stageMat;
    meshes.push(stage);
  }

  createBasicWalls(roomName, meshes) {
    const wallMat = new StandardMaterial(`${roomName}_wallMat`, this.scene);
    wallMat.diffuseColor = new Color3(0.8, 0.8, 0.8);
    
    // Simple box room
    const walls = MeshBuilder.CreateBox(`${roomName}_walls`, {
      width: 20,
      height: 8,
      depth: 20
    }, this.scene);
    walls.position.y = 4;
    walls.material = wallMat;
    wallMat.backFaceCulling = false;
    meshes.push(walls);
  }

  // NEW ROOM BUILDERS

  createCozyWalls(roomName, meshes) {
    const wallMat = new StandardMaterial(`${roomName}_wallMat`, this.scene);
    wallMat.diffuseColor = new Color3(0.85, 0.75, 0.65); // Warm beige
    
    const walls = MeshBuilder.CreateBox(`${roomName}_walls`, {
      width: 15,
      height: 7,
      depth: 15
    }, this.scene);
    walls.position.y = 3.5;
    walls.material = wallMat;
    wallMat.backFaceCulling = false;
    meshes.push(walls);
  }

  createCircleSeating(roomName, meshes) {
    const seatMat = new StandardMaterial(`${roomName}_seatMat`, this.scene);
    seatMat.diffuseColor = new Color3(0.4, 0.5, 0.6); // Blue-gray cushions
    
    const numSeats = 10;
    const radius = 4;
    
    for (let i = 0; i < numSeats; i++) {
      const angle = (i / numSeats) * Math.PI * 2;
      const chair = MeshBuilder.CreateBox(`${roomName}_chair${i}`, {
        width: 1.2,
        height: 0.9,
        depth: 1.2
      }, this.scene);
      
      chair.position.x = Math.cos(angle) * radius;
      chair.position.z = Math.sin(angle) * radius;
      chair.position.y = 0.45;
      chair.rotation.y = -angle + Math.PI / 2;
      chair.material = seatMat;
      meshes.push(chair);
    }
  }

  createCenterTable(roomName, meshes) {
    const tableMat = new StandardMaterial(`${roomName}_tableMat`, this.scene);
    tableMat.diffuseColor = new Color3(0.5, 0.4, 0.3);
    
    const table = MeshBuilder.CreateCylinder(`${roomName}_table`, {
      diameter: 3,
      height: 0.8
    }, this.scene);
    table.position.y = 0.4;
    table.material = tableMat;
    meshes.push(table);
  }

  createClassroomWalls(roomName, meshes) {
    const wallMat = new StandardMaterial(`${roomName}_wallMat`, this.scene);
    wallMat.diffuseColor = new Color3(0.92, 0.92, 0.88);
    
    const walls = MeshBuilder.CreateBox(`${roomName}_walls`, {
      width: 25,
      height: 9,
      depth: 20
    }, this.scene);
    walls.position.y = 4.5;
    walls.material = wallMat;
    wallMat.backFaceCulling = false;
    meshes.push(walls);
  }

  createDesks(roomName, meshes) {
    const deskMat = new StandardMaterial(`${roomName}_deskMat`, this.scene);
    deskMat.diffuseColor = new Color3(0.7, 0.6, 0.5);
    
    // Create rows of desks
    for (let row = 0; row < 4; row++) {
      for (let col = 0; col < 5; col++) {
        const desk = MeshBuilder.CreateBox(`${roomName}_desk_${row}_${col}`, {
          width: 1.5,
          height: 0.8,
          depth: 1.0
        }, this.scene);
        desk.position.x = (col - 2) * 2.5;
        desk.position.z = (row - 1.5) * 2.5;
        desk.position.y = 0.4;
        desk.material = deskMat;
        meshes.push(desk);
      }
    }
  }

  createWhiteboard(roomName, meshes) {
    const board = MeshBuilder.CreatePlane(`${roomName}_whiteboard`, {
      width: 8,
      height: 4
    }, this.scene);
    board.position.set(0, 3, 9.9);
    
    const boardMat = new StandardMaterial(`${roomName}_boardMat`, this.scene);
    boardMat.diffuseColor = new Color3(0.95, 0.95, 0.95);
    board.material = boardMat;
    meshes.push(board);
  }

  createStudioWalls(roomName, meshes) {
    const wallMat = new StandardMaterial(`${roomName}_wallMat`, this.scene);
    wallMat.diffuseColor = new Color3(0.15, 0.15, 0.18); // Dark studio walls
    
    const walls = MeshBuilder.CreateBox(`${roomName}_walls`, {
      width: 12,
      height: 7,
      depth: 10
    }, this.scene);
    walls.position.y = 3.5;
    walls.material = wallMat;
    wallMat.backFaceCulling = false;
    meshes.push(walls);
  }

  createRecordingEquipment(roomName, meshes) {
    // Mic stand
    const micStand = MeshBuilder.CreateCylinder(`${roomName}_micStand`, {
      diameter: 0.1,
      height: 2
    }, this.scene);
    micStand.position.set(0, 1, 0);
    
    const metalMat = new StandardMaterial(`${roomName}_metal`, this.scene);
    metalMat.diffuseColor = new Color3(0.3, 0.3, 0.3);
    micStand.material = metalMat;
    meshes.push(micStand);
    
    // Mic
    const mic = MeshBuilder.CreateSphere(`${roomName}_mic`, {
      diameter: 0.3
    }, this.scene);
    mic.position.set(0, 2, 0);
    mic.material = metalMat;
    meshes.push(mic);
    
    // Mixing desk
    const desk = MeshBuilder.CreateBox(`${roomName}_mixingDesk`, {
      width: 3,
      height: 0.3,
      depth: 1.5
    }, this.scene);
    desk.position.set(-3, 1, 0);
    
    const deskMat = new StandardMaterial(`${roomName}_deskMat`, this.scene);
    deskMat.diffuseColor = new Color3(0.2, 0.2, 0.2);
    desk.material = deskMat;
    meshes.push(desk);
    
    // Monitor speakers (2)
    for (let i = 0; i < 2; i++) {
      const speaker = MeshBuilder.CreateBox(`${roomName}_speaker${i}`, {
        width: 0.4,
        height: 0.6,
        depth: 0.3
      }, this.scene);
      speaker.position.set(-3 + i * 2, 1.8, 2);
      speaker.material = metalMat;
      meshes.push(speaker);
    }
    
    // Acoustic foam panels on walls
    const foamMat = new StandardMaterial(`${roomName}_foam`, this.scene);
    foamMat.diffuseColor = new Color3(0.15, 0.1, 0.15);
    
    for (let i = 0; i < 8; i++) {
      const panel = MeshBuilder.CreateBox(`${roomName}_foam${i}`, {
        width: 1,
        height: 1,
        depth: 0.1
      }, this.scene);
      const angle = (i / 8) * Math.PI * 2;
      panel.position.x = Math.cos(angle) * 5.9;
      panel.position.z = Math.sin(angle) * 4.9;
      panel.position.y = 2;
      panel.rotation.y = -angle;
      panel.material = foamMat;
      meshes.push(panel);
    }
  }

  createHallWalls(roomName, meshes) {
    const wallMat = new StandardMaterial(`${roomName}_wallMat`, this.scene);
    wallMat.diffuseColor = new Color3(0.88, 0.85, 0.80);
    
    const walls = MeshBuilder.CreateBox(`${roomName}_walls`, {
      width: 40,
      height: 12,
      depth: 30
    }, this.scene);
    walls.position.y = 6;
    walls.material = wallMat;
    wallMat.backFaceCulling = false;
    meshes.push(walls);
  }

  createBanquetTables(roomName, meshes) {
    const tableMat = new StandardMaterial(`${roomName}_tableMat`, this.scene);
    tableMat.diffuseColor = new Color3(0.9, 0.9, 0.85);
    
    // Create grid of tables
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 4; col++) {
        const table = MeshBuilder.CreateBox(`${roomName}_table_${row}_${col}`, {
          width: 6,
          height: 0.8,
          depth: 2.5
        }, this.scene);
        table.position.x = (col - 1.5) * 8;
        table.position.z = (row - 1) * 6;
        table.position.y = 0.4;
        table.material = tableMat;
        meshes.push(table);
      }
    }
  }

  createOutdoorGround(roomName, meshes) {
    const groundMat = new StandardMaterial(`${roomName}_ground`, this.scene);
    groundMat.diffuseColor = new Color3(0.4, 0.6, 0.3); // Grass green
    
    const ground = MeshBuilder.CreateGround(`${roomName}_ground`, {
      width: 50,
      height: 50
    }, this.scene);
    ground.material = groundMat;
    meshes.push(ground);
  }

  createGardenElements(roomName, meshes) {
    const treeMat = new StandardMaterial(`${roomName}_tree`, this.scene);
    treeMat.diffuseColor = new Color3(0.2, 0.5, 0.2);
    
    const bushMat = new StandardMaterial(`${roomName}_bush`, this.scene);
    bushMat.diffuseColor = new Color3(0.3, 0.6, 0.3);
    
    // Trees
    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const tree = MeshBuilder.CreateSphere(`${roomName}_tree${i}`, {
        diameter: 3
      }, this.scene);
      tree.position.x = Math.cos(angle) * 15;
      tree.position.z = Math.sin(angle) * 15;
      tree.position.y = 2;
      tree.material = treeMat;
      meshes.push(tree);
    }
    
    // Bushes
    for (let i = 0; i < 8; i++) {
      const angle = (i / 8) * Math.PI * 2;
      const bush = MeshBuilder.CreateSphere(`${roomName}_bush${i}`, {
        diameter: 1.5
      }, this.scene);
      bush.position.x = Math.cos(angle) * 10;
      bush.position.z = Math.sin(angle) * 10;
      bush.position.y = 0.75;
      bush.scaling.y = 0.7;
      bush.material = bushMat;
      meshes.push(bush);
    }
    
    // Wooden benches (4)
    const benchMat = new StandardMaterial(`${roomName}_bench`, this.scene);
    benchMat.diffuseColor = new Color3(0.4, 0.3, 0.2);
    
    for (let i = 0; i < 4; i++) {
      const angle = (i / 4) * Math.PI * 2 + Math.PI / 4;
      const bench = MeshBuilder.CreateBox(`${roomName}_bench${i}`, {
        width: 2,
        height: 0.5,
        depth: 0.8
      }, this.scene);
      bench.position.x = Math.cos(angle) * 6;
      bench.position.z = Math.sin(angle) * 6;
      bench.position.y = 0.25;
      bench.rotation.y = -angle + Math.PI / 2;
      bench.material = benchMat;
      meshes.push(bench);
    }
    
    // Stone walkway
    const stoneMat = new StandardMaterial(`${roomName}_stone`, this.scene);
    stoneMat.diffuseColor = new Color3(0.5, 0.5, 0.5);
    
    for (let i = 0; i < 20; i++) {
      const stone = MeshBuilder.CreateCylinder(`${roomName}_stone${i}`, {
        diameter: 1.2,
        height: 0.1
      }, this.scene);
      const angle = (i / 20) * Math.PI * 2;
      stone.position.x = Math.cos(angle) * 4;
      stone.position.z = Math.sin(angle) * 4;
      stone.position.y = 0.05;
      stone.material = stoneMat;
      meshes.push(stone);
    }
  }

  createFountain(roomName, meshes) {
    const stoneMat = new StandardMaterial(`${roomName}_stone`, this.scene);
    stoneMat.diffuseColor = new Color3(0.6, 0.6, 0.65);
    
    const waterMat = new StandardMaterial(`${roomName}_water`, this.scene);
    waterMat.diffuseColor = new Color3(0.3, 0.5, 0.7);
    waterMat.alpha = 0.6;
    
    // Fountain base
    const base = MeshBuilder.CreateCylinder(`${roomName}_fountain`, {
      diameter: 4,
      height: 1
    }, this.scene);
    base.position.y = 0.5;
    base.material = stoneMat;
    meshes.push(base);
    
    // Water
    const water = MeshBuilder.CreateCylinder(`${roomName}_water`, {
      diameter: 3.5,
      height: 0.8
    }, this.scene);
    water.position.y = 0.9;
    water.material = waterMat;
    meshes.push(water);
  }

  dispose() {
    // Unload all rooms
    this.loadedRooms.forEach((_, roomName) => {
      this.unloadRoom(roomName);
    });

    if (this.scene) {
      this.scene.dispose();
    }

    console.log('Scene Manager disposed');
  }
}

export default SceneManager;
