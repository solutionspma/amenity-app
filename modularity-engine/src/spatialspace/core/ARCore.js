/**
 * ARCore.js
 * Unified AR system for native ARKit and web AR Quick Look
 */

export class ARCore {
  constructor(engine) {
    this.engine = engine;
    this.isNativeAvailable = !!window.Capacitor?.Plugins?.ARBridge;
    this.modelViewer = null;
    
    console.log('📱 AR Core initialized (Native:', this.isNativeAvailable, ')');
  }

  /**
   * Enter native ARKit mode (iOS app only)
   * @param {string} modelName - GLB/USDZ filename
   */
  enterNativeAR(modelName) {
    if (!this.isNativeAvailable) {
      console.warn('⚠️ Native AR not available');
      return;
    }
    
    window.Capacitor.Plugins.ARBridge.place({ model: modelName })
      .then(() => console.log('✅ ARKit model placed:', modelName))
      .catch(err => console.error('❌ ARKit error:', err));
  }

  /**
   * Enter AR using model-viewer (iOS Quick Look)
   * @param {string} modelURL - URL to GLB/USDZ file
   */
  enterQuickLook(modelURL) {
    const viewer = document.getElementById('ar-viewer');
    if (viewer) {
      viewer.setAttribute('ios-src', modelURL);
      viewer.activateAR();
      console.log('✅ Quick Look AR activated:', modelURL);
    } else {
      // Fallback: create temporary anchor
      const a = document.createElement('a');
      a.rel = 'ar';
      a.href = modelURL;
      a.click();
    }
  }

  /**
   * Place model in AR (auto-detect method)
   * @param {string} modelPath - Path to model file
   */
  placeModel(modelPath) {
    if (this.isNativeAvailable) {
      this.enterNativeAR(modelPath);
    } else {
      this.enterQuickLook(modelPath);
    }
  }

  /**
   * Exit AR mode
   */
  exitAR() {
    if (this.isNativeAvailable) {
      window.Capacitor.Plugins.ARBridge.exitAR();
    }
    console.log('🚪 Exited AR mode');
  }
}
