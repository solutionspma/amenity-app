/**
 * MODULARITY SPATIAL OS v3.0 - MAIN ENTRY POINT
 * The Atomic Edition - Complete Faith-Based AR/VR Platform
 * 
 * Built with WebXR, Babylon.js, and Love ❤️
 * by Jason Harris - Amenity.Church
 */

import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import '@babylonjs/core/Helpers/sceneHelpers';

// Required Babylon.js components for effects
import '@babylonjs/core/Layers/effectLayerSceneComponent';
import '@babylonjs/core/Layers/glowLayer';
import '@babylonjs/core/Layers/highlightLayer';

import 'webxr-polyfill';

// Import all engine systems
import XREngine from './engine/xr.js';
import SceneManager from './engine/sceneManager.js';
import MovementController from './engine/movement.js';
import InteractionManager from './engine/interactions.js';
import SpatialAudioEngine from './engine/spatialAudio.js';
import ARMode from './engine/arMode.js';
import PortalFX from './engine/portalFX.js';
import LipSync from './engine/lipSync.js';
import VoiceChat from './engine/voiceChat.js';
import AdminTools from './engine/adminTools.js';
import CreatorMode from './engine/creatorMode.js';

// Import avatar system
import AvatarFactory from './avatars/avatarFactory.js';
import AvatarCreator from './avatars/avatarCreator.js';

class ModularityOS {
  constructor() {
    this.version = '3.0.0';
    this.edition = 'Atomic';
    this.canvas = null;
    this.engine = null;
    this.scene = null;
    
    // Engine systems
    this.xr = null;
    this.sceneManager = null;
    this.movement = null;
    this.interactions = null;
    this.spatialAudio = null;
    this.arMode = null;
    this.portalFX = null;
    this.lipSync = null;
    this.voiceChat = null;
    this.adminTools = null;
    this.creatorMode = null;
    
    // Avatar systems
    this.avatarFactory = null;
    this.avatarCreator = null;
    
    this.isInitialized = false;
  }

  async initialize(canvasId = 'renderCanvas') {
    console.log(`
    ╔═══════════════════════════════════════════════════════════╗
    ║                                                           ║
    ║          MODULARITY SPATIAL OS v${this.version}                 ║
    ║             The ${this.edition} Edition                         ║
    ║                                                           ║
    ║    Faith-Based AR/VR Platform for Churches & Creators    ║
    ║                                                           ║
    ║              by Jason Harris - Amenity.Church             ║
    ║                                                           ║
    ╚═══════════════════════════════════════════════════════════╝
    `);

    try {
      // Get canvas
      this.canvas = document.getElementById(canvasId);
      if (!this.canvas) {
        throw new Error(`Canvas with id '${canvasId}' not found`);
      }

      // Create Babylon.js engine
      console.log('🎮 Initializing Babylon.js Engine...');
      this.engine = new Engine(this.canvas, true, {
        preserveDrawingBuffer: true,
        stencil: true,
        antialias: true
      });

      // Create scene
      this.sceneManager = new SceneManager(this.engine);
      this.scene = this.sceneManager.createScene(this.canvas);

      // Setup default camera and lighting
      this.setupDefaultCamera();
      this.setupDefaultLighting();

      // Initialize XR
      console.log('🔮 Initializing XR Engine...');
      this.xr = new XREngine(this.scene, this.canvas);
      await this.xr.initialize();

      // Initialize movement
      console.log('🚶 Initializing Movement Controller...');
      this.movement = new MovementController(this.scene, this.xr);
      this.movement.initialize();

      // Initialize interactions
      console.log('👆 Initializing Interaction Manager...');
      this.interactions = new InteractionManager(this.scene, this.xr);
      this.interactions.initialize();

      // Initialize spatial audio
      console.log('🎧 Initializing Spatial Audio...');
      this.spatialAudio = new SpatialAudioEngine(this.scene, this.xr);
      try {
        await this.spatialAudio.initialize();
      } catch (error) {
        console.warn('⚠️ Spatial audio initialization skipped (needs user interaction)');
      }

      // Initialize AR mode
      console.log('📱 Initializing AR Mode...');
      this.arMode = new ARMode(this.scene, this.xr);
      await this.arMode.initialize();

      // Initialize portal FX
      console.log('✨ Initializing Portal FX...');
      this.portalFX = new PortalFX(this.scene);
      this.portalFX.initialize();

      // Initialize lip sync
      console.log('👄 Initializing Lip Sync...');
      this.lipSync = new LipSync(this.scene);
      this.lipSync.initialize();

      // Initialize voice chat
      console.log('🎤 Initializing Voice Chat...');
      this.voiceChat = new VoiceChat(this.scene, this.spatialAudio, null);
      // Note: Supabase client would be passed here if available

      // Initialize admin tools
      console.log('🛡️ Initializing Admin Tools...');
      this.adminTools = new AdminTools(this.scene, this.voiceChat, null);

      // Initialize creator mode
      console.log('🎨 Initializing Creator Mode...');
      this.creatorMode = new CreatorMode(this.scene, this.interactions);
      this.creatorMode.initialize();

      // Initialize avatar systems
      console.log('👤 Initializing Avatar Systems...');
      this.avatarFactory = new AvatarFactory(this.scene);
      await this.avatarFactory.initialize();
      
      this.avatarCreator = new AvatarCreator();
      this.avatarCreator.initialize();

      // Setup render loop
      this.engine.runRenderLoop(() => {
        this.scene.render();
      });

      // Handle window resize
      window.addEventListener('resize', () => {
        this.engine.resize();
      });

      this.isInitialized = true;
      
      console.log('✅ Modularity OS initialized successfully!');
      console.log('🚀 Ready to create immersive spiritual experiences!');

      // Dispatch ready event
      window.dispatchEvent(new CustomEvent('modularity-ready', {
        detail: { version: this.version, edition: this.edition }
      }));

      return true;

    } catch (error) {
      console.error('❌ Failed to initialize Modularity OS:', error);
      return false;
    }
  }

  setupDefaultCamera() {
    const camera = new ArcRotateCamera(
      'camera',
      -Math.PI / 2,
      Math.PI / 2.5,
      10,
      new Vector3(0, 0, 0),
      this.scene
    );

    camera.attachControl(this.canvas, true);
    camera.lowerRadiusLimit = 2;
    camera.upperRadiusLimit = 50;
    camera.wheelDeltaPercentage = 0.01;

    this.scene.activeCamera = camera;
  }

  setupDefaultLighting() {
    const light = new HemisphericLight(
      'light',
      new Vector3(0, 1, 0),
      this.scene
    );

    light.intensity = 0.7;
  }

  async loadRoom(roomName) {
    return await this.sceneManager.loadRoom(roomName);
  }

  async enterVR() {
    return await this.xr.enterVR();
  }

  async enterAR() {
    return await this.xr.enterAR();
  }

  async exitXR() {
    return await this.xr.exitXR();
  }

  activateCreatorMode() {
    this.creatorMode.activate();
  }

  deactivateCreatorMode() {
    this.creatorMode.deactivate();
  }

  getInfo() {
    return {
      name: 'Modularity Spatial OS',
      version: this.version,
      edition: this.edition,
      author: 'Jason Harris',
      organization: 'Amenity.Church',
      contact: 'devpartners@amenity.church',
      features: [
        'WebXR VR/AR Support',
        'Spatial Audio with Tone.js',
        'AI Avatar Generation',
        'Voice Chat with WebRTC',
        'Lip Sync Animation',
        'Portal Effects',
        'Admin & Moderation Tools',
        'Creator Mode (Drag-n-Drop)',
        '8 Faith-Based Rooms',
        'Multi-platform Support'
      ],
      supportedDevices: [
        'Meta Quest',
        'Apple Vision Pro',
        'HTC Vive',
        'Pico Neo',
        'XREAL / Nreal Air',
        'Magic Leap'
      ]
    };
  }

  dispose() {
    console.log('🧹 Disposing Modularity OS...');

    if (this.xr) this.xr.dispose();
    if (this.sceneManager) this.sceneManager.dispose();
    if (this.movement) this.movement.dispose();
    if (this.interactions) this.interactions.dispose();
    if (this.spatialAudio) this.spatialAudio.dispose();
    if (this.arMode) this.arMode.dispose();
    if (this.portalFX) this.portalFX.dispose();
    if (this.lipSync) this.lipSync.dispose();
    if (this.voiceChat) this.voiceChat.dispose();
    if (this.adminTools) this.adminTools.dispose();
    if (this.creatorMode) this.creatorMode.dispose();
    if (this.avatarFactory) this.avatarFactory.dispose();
    if (this.avatarCreator) this.avatarCreator.dispose();

    if (this.engine) {
      this.engine.dispose();
    }

    console.log('✅ Modularity OS disposed');
  }
}

// Export for use in browser or module environments
if (typeof window !== 'undefined') {
  window.ModularityOS = ModularityOS;
}

export default ModularityOS;

// Auto-initialize if script is loaded directly
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('📄 DOM loaded, ready to initialize Modularity OS');
  });
} else {
  console.log('📄 DOM already loaded, ready to initialize Modularity OS');
}
