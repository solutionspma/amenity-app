/**
 * vrNetworkAvatar.js
 * Manages remote player avatars in VR multiplayer
 */

export class VRNetworkAvatar {
  constructor(scene) {
    this.scene = scene;
    this.avatars = {};
  }

  updateRemote(id, pos, rot) {
    let avatar = this.avatars[id];
    
    // Create avatar if doesn't exist
    if (!avatar) {
      avatar = this.createAvatar(id);
      this.avatars[id] = avatar;
      this.scene.add(avatar.group);
      console.log('👤 Created remote avatar:', id);
    }

    // Update position and rotation with interpolation
    avatar.group.position.lerp(
      new THREE.Vector3(pos.x, pos.y, pos.z),
      0.2
    );
    
    avatar.group.rotation.set(rot.x, rot.y, rot.z);
  }

  createAvatar(id) {
    const group = new THREE.Group();
    group.name = `avatar_${id}`;

    // Head
    const headGeo = new THREE.SphereGeometry(0.18);
    const headMat = new THREE.MeshStandardMaterial({ 
      color: 0xddddff,
      metalness: 0.3,
      roughness: 0.7
    });
    const head = new THREE.Mesh(headGeo, headMat);
    head.position.y = 1.6;
    group.add(head);

    // Body
    const bodyGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.8);
    const bodyMat = new THREE.MeshStandardMaterial({ 
      color: 0x8888ff,
      metalness: 0.2,
      roughness: 0.8
    });
    const body = new THREE.Mesh(bodyGeo, bodyMat);
    body.position.y = 1.0;
    group.add(body);

    // Left arm
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, 0.6);
    const armMat = new THREE.MeshStandardMaterial({ 
      color: 0x6666dd,
      metalness: 0.2,
      roughness: 0.8
    });
    const leftArm = new THREE.Mesh(armGeo, armMat);
    leftArm.position.set(-0.3, 1.0, 0);
    group.add(leftArm);

    // Right arm
    const rightArm = new THREE.Mesh(armGeo, armMat);
    rightArm.position.set(0.3, 1.0, 0);
    group.add(rightArm);

    // Name tag
    const nameTag = this.createNameTag(id);
    nameTag.position.y = 2.0;
    group.add(nameTag);

    return {
      group,
      head,
      body,
      leftArm,
      rightArm,
      nameTag
    };
  }

  createNameTag(id) {
    const canvas = document.createElement('canvas');
    canvas.width = 256;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    
    // Background
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, 256, 64);
    
    // Text
    ctx.fillStyle = 'white';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(id.substring(0, 12), 128, 40);
    
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    const sprite = new THREE.Sprite(material);
    sprite.scale.set(1, 0.25, 1);
    
    return sprite;
  }

  removeAvatar(id) {
    const avatar = this.avatars[id];
    if (avatar) {
      this.scene.remove(avatar.group);
      delete this.avatars[id];
      console.log('🗑️ Removed avatar:', id);
    }
  }

  update(delta) {
    // Animate avatars (breathing, idle animations)
    Object.values(this.avatars).forEach(avatar => {
      const time = Date.now() * 0.001;
      avatar.body.scale.y = 1 + Math.sin(time * 2) * 0.05;
    });
  }
}
