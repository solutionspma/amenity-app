/**
 * MODULARITY SPATIAL OS - AVATAR FACTORY
 * Create and manage user avatars in the scene
 */

import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { StandardMaterial } from '@babylonjs/core/Materials/standardMaterial';
import { MeshBuilder } from '@babylonjs/core/Meshes/meshBuilder';

export class AvatarFactory {
  constructor(scene) {
    this.scene = scene;
    this.avatars = new Map();
    this.presets = [];
  }

  async initialize() {
    console.log('👤 Initializing Avatar Factory...');
    
    // Load avatar presets
    await this.loadPresets();
    
    console.log('✅ Avatar Factory initialized');
  }

  birthLocalAvatar(position = [0, 0, -3]) {
    console.log('👤 Birthing avatar in the Spirit...');
    
    // Create simple avatar
    const avatar = MeshBuilder.CreateSphere('localAvatar', {
      diameter: 0.4
    }, this.scene);
    
    avatar.position.set(position[0], position[1] + 1.6, position[2]);
    
    const avatarMat = new StandardMaterial('avatarMat', this.scene);
    avatarMat.diffuseColor = new Color3(0.3, 0.6, 0.9);
    avatarMat.emissiveColor = new Color3(0.1, 0.2, 0.3);
    avatar.material = avatarMat;
    
    // Add name tag
    const nameTag = MeshBuilder.CreatePlane('nameTag', {
      width: 1,
      height: 0.3
    }, this.scene);
    nameTag.position.y = 0.5;
    nameTag.parent = avatar;
    nameTag.billboardMode = 7; // Face camera
    
    const nameMat = new StandardMaterial('nameMat', this.scene);
    nameMat.diffuseColor = new Color3(1, 1, 1);
    nameMat.emissiveColor = new Color3(0.5, 0.5, 0.5);
    nameTag.material = nameMat;
    
    console.log('✅ Avatar birthed and ready to walk in the light!');
    return avatar;
  }

  async loadPresets() {
    // Define avatar presets
    this.presets = [
      { id: 'avatar1', name: 'Classic Male', file: 'avatar1.glb', gender: 'male' },
      { id: 'avatar2', name: 'Classic Female', file: 'avatar2.glb', gender: 'female' },
      { id: 'avatar3', name: 'Minister', file: 'avatar3.glb', gender: 'male' },
      { id: 'avatar4', name: 'Worship Leader', file: 'avatar4.glb', gender: 'female' },
      { id: 'avatar5', name: 'Youth Pastor', file: 'avatar5.glb', gender: 'male' },
      { id: 'avatar6', name: 'Modern Casual', file: 'avatar6.glb', gender: 'female' },
      { id: 'avatar7', name: 'Business Professional', file: 'avatar7.glb', gender: 'male' },
      { id: 'avatar8', name: 'Creative Artist', file: 'avatar8.glb', gender: 'female' },
      { id: 'avatar9', name: 'Elder', file: 'avatar9.glb', gender: 'male' },
      { id: 'avatar10', name: 'Deacon', file: 'avatar10.glb', gender: 'female' },
      { id: 'avatar11', name: 'Evangelist', file: 'avatar11.glb', gender: 'male' },
      { id: 'avatar12', name: 'Teacher', file: 'avatar12.glb', gender: 'female' }
    ];

    console.log(`📋 Loaded ${this.presets.length} avatar presets`);
  }

  async createAvatar(userId, presetId, position = new Vector3(0, 0, 0), customization = {}) {
    console.log(`👤 Creating avatar for user: ${userId}`);

    try {
      // Find preset
      const preset = this.presets.find(p => p.id === presetId);
      if (!preset) {
        throw new Error(`Preset ${presetId} not found`);
      }

      // Load avatar model
      const avatarPath = `/src/avatars/presets/${preset.file}`;
      const result = await SceneLoader.ImportMeshAsync(
        '',
        '',
        avatarPath,
        this.scene
      );

      const rootMesh = result.meshes[0];
      rootMesh.position = position;
      rootMesh.name = `avatar_${userId}`;

      // Apply customizations
      if (customization.skinColor) {
        this.applySkinColor(result.meshes, customization.skinColor);
      }

      if (customization.hairColor) {
        this.applyHairColor(result.meshes, customization.hairColor);
      }

      if (customization.outfitColor) {
        this.applyOutfitColor(result.meshes, customization.outfitColor);
      }

      // Add metadata
      rootMesh.metadata = {
        userId: userId,
        presetId: presetId,
        customization: customization,
        createdAt: Date.now()
      };

      // Add nameplate
      const nameplate = this.createNameplate(customization.displayName || userId);
      nameplate.parent = rootMesh;
      nameplate.position = new Vector3(0, 2.2, 0);

      // Store avatar
      this.avatars.set(userId, {
        rootMesh: rootMesh,
        meshes: result.meshes,
        nameplate: nameplate,
        preset: preset
      });

      console.log(`✅ Avatar created for ${userId}`);
      return rootMesh;

    } catch (error) {
      console.error(`Failed to create avatar for ${userId}:`, error);
      
      // Fallback to simple capsule avatar
      return this.createFallbackAvatar(userId, position);
    }
  }

  createFallbackAvatar(userId, position) {
    console.log('📦 Creating fallback avatar');

    // Simple capsule avatar
    const capsule = MeshBuilder.CreateCapsule(`avatar_${userId}`, {
      height: 1.8,
      radius: 0.3
    }, this.scene);

    capsule.position = position;

    const material = new StandardMaterial(`avatar_mat_${userId}`, this.scene);
    material.diffuseColor = new Color3(0.5, 0.5, 1);
    capsule.material = material;

    // Add nameplate
    const nameplate = this.createNameplate(userId);
    nameplate.parent = capsule;
    nameplate.position = new Vector3(0, 1.2, 0);

    capsule.metadata = {
      userId: userId,
      isFallback: true
    };

    this.avatars.set(userId, {
      rootMesh: capsule,
      meshes: [capsule],
      nameplate: nameplate,
      preset: null
    });

    return capsule;
  }

  createNameplate(displayName) {
    const plane = MeshBuilder.CreatePlane('nameplate', {
      width: 1.5,
      height: 0.3
    }, this.scene);

    const material = new StandardMaterial('nameplate_mat', this.scene);
    material.diffuseColor = new Color3(0.2, 0.2, 0.2);
    material.emissiveColor = new Color3(0.5, 0.5, 0.5);
    material.alpha = 0.8;
    plane.material = material;

    // Billboard mode - always face camera
    plane.billboardMode = 7;

    return plane;
  }

  applySkinColor(meshes, color) {
    meshes.forEach(mesh => {
      if (mesh.name.includes('skin') || mesh.name.includes('body')) {
        if (!mesh.material) {
          mesh.material = new StandardMaterial('skin_mat', this.scene);
        }
        mesh.material.diffuseColor = color;
      }
    });
  }

  applyHairColor(meshes, color) {
    meshes.forEach(mesh => {
      if (mesh.name.includes('hair')) {
        if (!mesh.material) {
          mesh.material = new StandardMaterial('hair_mat', this.scene);
        }
        mesh.material.diffuseColor = color;
      }
    });
  }

  applyOutfitColor(meshes, color) {
    meshes.forEach(mesh => {
      if (mesh.name.includes('clothes') || mesh.name.includes('outfit')) {
        if (!mesh.material) {
          mesh.material = new StandardMaterial('outfit_mat', this.scene);
        }
        mesh.material.diffuseColor = color;
      }
    });
  }

  updateAvatarPosition(userId, position) {
    const avatar = this.avatars.get(userId);
    if (avatar) {
      avatar.rootMesh.position = position;
    }
  }

  updateAvatarRotation(userId, rotation) {
    const avatar = this.avatars.get(userId);
    if (avatar) {
      avatar.rootMesh.rotation = rotation;
    }
  }

  playAnimation(userId, animationName) {
    const avatar = this.avatars.get(userId);
    if (avatar && avatar.rootMesh.animations) {
      const animation = avatar.rootMesh.animations.find(a => 
        a.name === animationName
      );
      
      if (animation) {
        this.scene.beginAnimation(avatar.rootMesh, 0, 120, true);
        console.log(`🎬 Playing animation: ${animationName}`);
      }
    }
  }

  removeAvatar(userId) {
    const avatar = this.avatars.get(userId);
    if (avatar) {
      avatar.meshes.forEach(mesh => mesh.dispose());
      avatar.nameplate.dispose();
      this.avatars.delete(userId);
      console.log(`🗑️ Removed avatar: ${userId}`);
    }
  }

  getAvatar(userId) {
    return this.avatars.get(userId);
  }

  getAllAvatars() {
    return Array.from(this.avatars.values());
  }

  getPresets() {
    return this.presets;
  }

  dispose() {
    this.avatars.forEach((avatar, userId) => {
      this.removeAvatar(userId);
    });
    
    console.log('Avatar Factory disposed');
  }
}

export default AvatarFactory;
