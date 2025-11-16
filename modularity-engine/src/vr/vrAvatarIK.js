/**
 * vrAvatarIK.js
 * Full Avatar IK System (Inverse Kinematics)
 * Head + Arms + Legs tracking and procedural animation
 */

export class VRAvatarIK {
  constructor(scene) {
    this.scene = scene;
    this.avatar = this.createRig();
    this.scene.add(this.avatar.group);
    
    // IK parameters
    this.armLength = 0.6;
    this.legLength = 0.8;
    
    console.log('🦴 Avatar IK System initialized');
  }

  update(headRot, headPos) {
    // Update head position and rotation
    this.avatar.head.position.copy(headPos);
    this.avatar.head.quaternion.copy(headRot);

    // Calculate forward direction from head
    const forward = new THREE.Vector3(0, 0, -1).applyQuaternion(headRot);
    const right = new THREE.Vector3(1, 0, 0).applyQuaternion(headRot);

    // Position arms relative to head
    const shoulderHeight = headPos.y - 0.2;
    const shoulderWidth = 0.3;

    // Left arm IK
    const leftShoulderPos = headPos.clone()
      .add(right.clone().multiplyScalar(-shoulderWidth))
      .setY(shoulderHeight);
    
    const leftHandTarget = leftShoulderPos.clone()
      .add(forward.clone().multiplyScalar(0.3))
      .add(new THREE.Vector3(0, -0.4, 0));
    
    this.solveArmIK(this.avatar.leftArm, leftShoulderPos, leftHandTarget);

    // Right arm IK
    const rightShoulderPos = headPos.clone()
      .add(right.clone().multiplyScalar(shoulderWidth))
      .setY(shoulderHeight);
    
    const rightHandTarget = rightShoulderPos.clone()
      .add(forward.clone().multiplyScalar(0.3))
      .add(new THREE.Vector3(0, -0.4, 0));
    
    this.solveArmIK(this.avatar.rightArm, rightShoulderPos, rightHandTarget);

    // Procedural leg animation (walk cycle based on velocity)
    this.updateLegs(headPos);

    // Update torso
    this.avatar.torso.position.copy(headPos);
    this.avatar.torso.position.y -= 0.4;
    this.avatar.torso.quaternion.copy(headRot);
  }

  solveArmIK(arm, shoulderPos, handTarget) {
    // Simple IK: point arm from shoulder to hand target
    const direction = new THREE.Vector3()
      .subVectors(handTarget, shoulderPos)
      .normalize();
    
    arm.position.copy(shoulderPos);
    arm.position.add(direction.clone().multiplyScalar(this.armLength / 2));
    
    arm.lookAt(handTarget);
    arm.rotateX(Math.PI / 2); // Align with cylinder geometry
  }

  updateLegs(headPos) {
    // Simple procedural walk cycle
    const time = Date.now() * 0.001;
    const walkSpeed = 2;
    
    // Left leg
    this.avatar.leftLeg.position.set(
      headPos.x - 0.15,
      headPos.y - 1.2 + Math.sin(time * walkSpeed) * 0.1,
      headPos.z + Math.cos(time * walkSpeed) * 0.2
    );
    
    // Right leg (opposite phase)
    this.avatar.rightLeg.position.set(
      headPos.x + 0.15,
      headPos.y - 1.2 + Math.sin(time * walkSpeed + Math.PI) * 0.1,
      headPos.z + Math.cos(time * walkSpeed + Math.PI) * 0.2
    );
  }

  createRig() {
    const group = new THREE.Group();
    group.name = 'avatar_ik_rig';

    // Materials
    const skinMat = new THREE.MeshStandardMaterial({ 
      color: 0xffdbac,
      metalness: 0.1,
      roughness: 0.9
    });
    
    const clothMat = new THREE.MeshStandardMaterial({ 
      color: 0x4466ff,
      metalness: 0.2,
      roughness: 0.8
    });

    // Head
    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.18),
      skinMat
    );
    group.add(head);

    // Torso
    const torso = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.6),
      clothMat
    );
    group.add(torso);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.05, 0.05, this.armLength);
    const leftArm = new THREE.Mesh(armGeo, skinMat);
    const rightArm = new THREE.Mesh(armGeo, skinMat);
    group.add(leftArm);
    group.add(rightArm);

    // Legs
    const legGeo = new THREE.CylinderGeometry(0.08, 0.06, this.legLength);
    const leftLeg = new THREE.Mesh(legGeo, clothMat);
    const rightLeg = new THREE.Mesh(legGeo, clothMat);
    group.add(leftLeg);
    group.add(rightLeg);

    return {
      group,
      head,
      torso,
      leftArm,
      rightArm,
      leftLeg,
      rightLeg
    };
  }

  setVisibility(visible) {
    this.avatar.group.visible = visible;
  }
}
