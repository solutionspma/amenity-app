/**
 * MODULARITY SPATIAL OS - PORTAL FX
 * Shader-based portal visual effects
 */

import { ShaderMaterial } from '@babylonjs/core/Materials/shaderMaterial';
import { Effect } from '@babylonjs/core/Materials/effect';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export class PortalFX {
  constructor(scene) {
    this.scene = scene;
    this.portals = [];
    this.time = 0;
  }

  initialize() {
    console.log('✨ Initializing Portal FX...');
    
    // Register custom shaders
    this.registerPortalShader();
    this.registerPrayerCircleShader();
    
    // Start animation loop
    this.scene.onBeforeRenderObservable.add(() => {
      this.update();
    });
    
    console.log('✅ Portal FX initialized');
  }

  registerPortalShader() {
    Effect.ShadersStore['portalVertexShader'] = `
      precision highp float;

      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      uniform mat4 worldViewProjection;
      uniform float time;

      varying vec2 vUV;
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        vUV = uv;
        vPosition = position;
        vNormal = normal;

        // Wave distortion
        vec3 pos = position;
        pos.x += sin(position.y * 3.0 + time) * 0.05;
        pos.z += cos(position.y * 3.0 + time) * 0.05;

        gl_Position = worldViewProjection * vec4(pos, 1.0);
      }
    `;

    Effect.ShadersStore['portalFragmentShader'] = `
      precision highp float;

      uniform float time;
      uniform vec3 color1;
      uniform vec3 color2;

      varying vec2 vUV;
      varying vec3 vPosition;
      varying vec3 vNormal;

      void main() {
        // Swirling portal effect
        vec2 uv = vUV * 2.0 - 1.0;
        float angle = atan(uv.y, uv.x);
        float radius = length(uv);

        // Rotating spiral
        float spiral = sin(radius * 10.0 - angle * 3.0 + time * 2.0);
        
        // Pulsing center
        float pulse = sin(time * 3.0) * 0.5 + 0.5;
        float center = 1.0 - smoothstep(0.0, 0.5, radius);

        // Mix colors
        vec3 color = mix(color1, color2, spiral * 0.5 + 0.5);
        color += center * pulse * 0.5;

        // Add glow
        float glow = pow(1.0 - radius, 2.0);
        color += glow * 0.3;

        gl_FragColor = vec4(color, 0.7 + pulse * 0.3);
      }
    `;
  }

  registerPrayerCircleShader() {
    Effect.ShadersStore['prayerCircleVertexShader'] = `
      precision highp float;

      attribute vec3 position;
      attribute vec3 normal;
      attribute vec2 uv;

      uniform mat4 worldViewProjection;
      uniform float time;

      varying vec2 vUV;
      varying vec3 vNormal;

      void main() {
        vUV = uv;
        vNormal = normal;

        // Gentle floating animation
        vec3 pos = position;
        pos.y += sin(time + position.x * 2.0) * 0.02;

        gl_Position = worldViewProjection * vec4(pos, 1.0);
      }
    `;

    Effect.ShadersStore['prayerCircleFragmentShader'] = `
      precision highp float;

      uniform float time;
      uniform vec3 holyColor;
      uniform float intensity;

      varying vec2 vUV;
      varying vec3 vNormal;

      void main() {
        // Radial holy glow
        vec2 center = vec2(0.5, 0.5);
        float dist = distance(vUV, center);
        
        // Pulsing holy light
        float pulse = sin(time * 1.5) * 0.3 + 0.7;
        float glow = pow(1.0 - dist * 2.0, 2.0);
        
        // Rays of light
        float angle = atan(vUV.y - 0.5, vUV.x - 0.5);
        float rays = sin(angle * 8.0 + time) * 0.5 + 0.5;
        
        vec3 color = holyColor * (glow + rays * 0.3) * pulse * intensity;
        
        gl_FragColor = vec4(color, glow * pulse * 0.5);
      }
    `;
  }

  createPortalMaterial(color1 = new Color3(0.5, 0, 1), color2 = new Color3(0, 1, 1)) {
    const material = new ShaderMaterial('portal-shader', this.scene, {
      vertex: 'portal',
      fragment: 'portal'
    }, {
      attributes: ['position', 'normal', 'uv'],
      uniforms: ['worldViewProjection', 'time', 'color1', 'color2'],
      needAlphaBlending: true
    });

    material.setFloat('time', 0);
    material.setColor3('color1', color1);
    material.setColor3('color2', color2);
    material.backFaceCulling = false;

    return material;
  }

  createPrayerCircleMaterial(holyColor = new Color3(1, 0.95, 0.8), intensity = 1.0) {
    const material = new ShaderMaterial('prayer-circle-shader', this.scene, {
      vertex: 'prayerCircle',
      fragment: 'prayerCircle'
    }, {
      attributes: ['position', 'normal', 'uv'],
      uniforms: ['worldViewProjection', 'time', 'holyColor', 'intensity'],
      needAlphaBlending: true
    });

    material.setFloat('time', 0);
    material.setColor3('holyColor', holyColor);
    material.setFloat('intensity', intensity);
    material.backFaceCulling = false;

    return material;
  }

  update() {
    this.time += 0.016; // ~60fps

    // Update all shader materials with current time
    this.scene.materials.forEach(material => {
      if (material instanceof ShaderMaterial) {
        if (material.name.includes('portal') || material.name.includes('prayer')) {
          material.setFloat('time', this.time);
        }
      }
    });
  }

  applyPortalEffect(mesh, color1, color2) {
    const material = this.createPortalMaterial(color1, color2);
    mesh.material = material;
    console.log('🌀 Portal effect applied to', mesh.name);
  }

  applyPrayerCircleEffect(mesh, holyColor, intensity) {
    const material = this.createPrayerCircleMaterial(holyColor, intensity);
    mesh.material = material;
    console.log('🙏 Prayer circle effect applied to', mesh.name);
  }

  dispose() {
    console.log('Portal FX disposed');
  }
}

export default PortalFX;
