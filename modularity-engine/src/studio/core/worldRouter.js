/**
 * MODULARITY SPATIAL OS - WORLD ROUTER
 * Scene switching for studio complex
 */

import { StudioComplexScene } from '../scenes/studioComplex.js';
import { RecordingStudioScene } from '../scenes/recordingStudio.js';
import { TVStudioScene } from '../scenes/tvStudio.js';
import { HallwayScene } from '../scenes/hallway.js';

export class WorldRouter {
  constructor(engine, camera) {
    this.engine = engine;
    this.camera = camera;
    this.currentScene = null;
    this.currentSceneName = null;
    
    console.log('🗺️ World router initialized');
  }

  load(sceneName) {
    console.log(`🔄 Loading scene: ${sceneName}`);
    
    // Clear current scene
    this.engine.clearScene();

    // Create new scene
    switch(sceneName) {
      case 'complex':
        this.currentScene = new StudioComplexScene(this.engine, this.camera);
        break;
      case 'recording':
        this.currentScene = new RecordingStudioScene(this.engine, this.camera);
        break;
      case 'tv':
        this.currentScene = new TVStudioScene(this.engine, this.camera);
        break;
      case 'hallway':
        this.currentScene = new HallwayScene(this.engine, this.camera);
        break;
      default:
        console.warn(`Unknown scene: ${sceneName}`);
        return;
    }

    this.currentSceneName = sceneName;
    this.currentScene.init();
    
    console.log(`✅ Scene ${sceneName} loaded`);
  }

  update(delta) {
    if (this.currentScene && this.currentScene.update) {
      this.currentScene.update(delta);
    }
  }
  
  getCurrentScene() {
    return this.currentSceneName;
  }
}
