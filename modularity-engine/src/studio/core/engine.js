/**
 * MODULARITY SPATIAL OS - STUDIO ENGINE
 * Three.js engine for studio/production environments
 */

import * as THREE from 'three';

export class StudioEngine {
  constructor(canvas) {
    this.canvas = canvas;
    
    // Create Three.js renderer
    this.renderer = new THREE.WebGLRenderer({ 
      canvas: canvas,
      antialias: true,
      alpha: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.0;
    
    // CRITICAL: Enable autoClear for proper scene switching
    this.renderer.autoClear = true;
    this.renderer.autoClearDepth = true;
    this.renderer.autoClearStencil = true;

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x0a0a0f);
    this.scene.fog = new THREE.FogExp2(0x0a0a0f, 0.005);
    
    this.clock = new THREE.Clock();
    
    console.log('🎬 Three.js Studio Engine initialized');
  }

  render(camera) {
    const delta = this.clock.getDelta();
    this.renderer.render(this.scene, camera);
    return delta;
  }

  clearScene() {
    console.log('🧨 Clearing Three.js scene');
    
    while (this.scene.children.length > 0) {
      const obj = this.scene.children[0];
      
      // Dispose geometry
      if (obj.geometry) {
        obj.geometry.dispose();
      }
      
      // Dispose materials
      if (obj.material) {
        if (Array.isArray(obj.material)) {
          obj.material.forEach(m => {
            if (m.map) m.map.dispose();
            if (m.lightMap) m.lightMap.dispose();
            if (m.bumpMap) m.bumpMap.dispose();
            if (m.normalMap) m.normalMap.dispose();
            if (m.specularMap) m.specularMap.dispose();
            if (m.envMap) m.envMap.dispose();
            m.dispose();
          });
        } else {
          if (obj.material.map) obj.material.map.dispose();
          if (obj.material.lightMap) obj.material.lightMap.dispose();
          if (obj.material.bumpMap) obj.material.bumpMap.dispose();
          if (obj.material.normalMap) obj.material.normalMap.dispose();
          if (obj.material.specularMap) obj.material.specularMap.dispose();
          if (obj.material.envMap) obj.material.envMap.dispose();
          obj.material.dispose();
        }
      }
      
      this.scene.remove(obj);
    }
    
    console.log('✅ Three.js scene cleared');
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
