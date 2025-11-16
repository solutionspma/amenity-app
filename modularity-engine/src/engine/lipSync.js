/**
 * MODULARITY SPATIAL OS - LIP SYNC
 * Volume-based mouth animation for avatars
 */

import { Animation } from '@babylonjs/core/Animations/animation';

export class LipSync {
  constructor(scene) {
    this.scene = scene;
    this.avatars = new Map();
    this.audioAnalyzers = new Map();
  }

  initialize() {
    console.log('👄 Initializing Lip Sync system...');
    console.log('✅ Lip Sync initialized');
  }

  registerAvatar(avatarId, avatarMesh, mouthBone = null) {
    // Register avatar for lip sync
    this.avatars.set(avatarId, {
      mesh: avatarMesh,
      mouthBone: mouthBone,
      mouthOpenAmount: 0,
      isTalking: false
    });

    console.log(`📝 Avatar registered for lip sync: ${avatarId}`);
  }

  connectAudioStream(avatarId, audioStream) {
    console.log(`🎤 Connecting audio stream for: ${avatarId}`);

    // Create audio context analyzer
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyzer = audioContext.createAnalyser();
    analyzer.fftSize = 256;

    // Connect stream to analyzer
    const source = audioContext.createMediaStreamSource(audioStream);
    source.connect(analyzer);

    const bufferLength = analyzer.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    this.audioAnalyzers.set(avatarId, {
      analyzer: analyzer,
      dataArray: dataArray,
      audioContext: audioContext
    });

    // Start analyzing
    this.startLipSyncAnalysis(avatarId);
  }

  startLipSyncAnalysis(avatarId) {
    const analyzerData = this.audioAnalyzers.get(avatarId);
    const avatarData = this.avatars.get(avatarId);

    if (!analyzerData || !avatarData) return;

    const analyze = () => {
      if (!this.audioAnalyzers.has(avatarId)) return;

      analyzerData.analyzer.getByteFrequencyData(analyzerData.dataArray);

      // Calculate average volume
      let sum = 0;
      for (let i = 0; i < analyzerData.dataArray.length; i++) {
        sum += analyzerData.dataArray[i];
      }
      const average = sum / analyzerData.dataArray.length;

      // Normalize to 0-1 range
      const volume = Math.min(average / 128, 1.0);

      // Apply smoothing
      const smoothing = 0.3;
      avatarData.mouthOpenAmount = 
        avatarData.mouthOpenAmount * (1 - smoothing) + volume * smoothing;

      // Determine if talking (above threshold)
      avatarData.isTalking = volume > 0.1;

      // Update mouth animation
      this.updateMouthAnimation(avatarId, avatarData.mouthOpenAmount);

      // Continue analyzing
      requestAnimationFrame(analyze);
    };

    analyze();
  }

  updateMouthAnimation(avatarId, openAmount) {
    const avatarData = this.avatars.get(avatarId);
    if (!avatarData) return;

    if (avatarData.mouthBone) {
      // Animate mouth bone
      const maxRotation = Math.PI / 6; // 30 degrees max
      avatarData.mouthBone.rotation.x = openAmount * maxRotation;
    } else if (avatarData.mesh.morphTargetManager) {
      // Use morph targets if available
      const morphTargets = avatarData.mesh.morphTargetManager;
      const mouthOpenIndex = morphTargets.getTarget('mouth_open')?.influence;
      
      if (mouthOpenIndex !== undefined) {
        morphTargets.getTarget('mouth_open').influence = openAmount;
      }
    }
  }

  manualTrigger(avatarId, phoneme, duration = 100) {
    // Manually trigger specific phoneme shapes
    const avatarData = this.avatars.get(avatarId);
    if (!avatarData) return;

    const phonemeShapes = {
      'A': 0.8,  // Open mouth (ah)
      'E': 0.4,  // Medium open (eh)
      'I': 0.2,  // Narrow (ee)
      'O': 0.6,  // Round (oh)
      'U': 0.5,  // Round narrow (oo)
      'M': 0.0,  // Closed (m)
      'F': 0.1,  // Teeth (f/v)
      'L': 0.3,  // Tongue (l)
      'TH': 0.2  // Tongue out (th)
    };

    const openAmount = phonemeShapes[phoneme] || 0;
    
    // Animate to shape
    this.animateToShape(avatarId, openAmount, duration);
  }

  animateToShape(avatarId, targetAmount, duration) {
    const avatarData = this.avatars.get(avatarId);
    if (!avatarData) return;

    const startAmount = avatarData.mouthOpenAmount;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1.0);

      // Ease in-out
      const eased = progress < 0.5
        ? 2 * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 2) / 2;

      const currentAmount = startAmount + (targetAmount - startAmount) * eased;
      this.updateMouthAnimation(avatarId, currentAmount);

      if (progress < 1.0) {
        requestAnimationFrame(animate);
      }
    };

    animate();
  }

  setTalkingState(avatarId, isTalking) {
    const avatarData = this.avatars.get(avatarId);
    if (avatarData) {
      avatarData.isTalking = isTalking;
    }
  }

  isTalking(avatarId) {
    const avatarData = this.avatars.get(avatarId);
    return avatarData ? avatarData.isTalking : false;
  }

  disconnectAvatar(avatarId) {
    // Stop audio analysis
    const analyzerData = this.audioAnalyzers.get(avatarId);
    if (analyzerData) {
      analyzerData.audioContext.close();
      this.audioAnalyzers.delete(avatarId);
    }

    // Remove avatar
    this.avatars.delete(avatarId);
    
    console.log(`🔌 Disconnected lip sync for: ${avatarId}`);
  }

  dispose() {
    // Disconnect all
    this.avatars.forEach((_, avatarId) => {
      this.disconnectAvatar(avatarId);
    });

    console.log('Lip Sync disposed');
  }
}

export default LipSync;
