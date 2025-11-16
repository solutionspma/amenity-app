/**
 * MODULARITY SPATIAL OS - SPATIAL AUDIO
 * 3D positional audio with Tone.js integration
 */

import * as Tone from 'tone';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';

export class SpatialAudioEngine {
  constructor(scene, xrEngine) {
    this.scene = scene;
    this.xrEngine = xrEngine;
    this.audioContext = null;
    this.listener = null;
    this.audioSources = new Map();
    this.initialized = false;
  }

  async initialize() {
    console.log('🎧 Initializing spatial audio engine...');
    
    try {
      // NOTE: Tone.start() will be called AFTER user gesture in main boot
      // Just create the audio context reference here
      console.log('⚠️ AudioContext will unlock after user click');
      
      // Get audio context (may be suspended until user gesture)
      this.audioContext = Tone.context.rawContext;
      
      // Create listener
      this.listener = this.audioContext.listener;
      
      // Setup listener updates
      this.setupListenerUpdates();
      
      this.initialized = true;
      console.log('✅ Spatial audio initialized');
      
      return true;
    } catch (error) {
      console.error('❌ Failed to initialize spatial audio:', error);
      return false;
    }
  }

  setupListenerUpdates() {
    // Update listener position every frame
    this.scene.onBeforeRenderObservable.add(() => {
      this.updateListener();
    });
  }

  updateListener() {
    const camera = this.xrEngine.getCamera() || this.scene.activeCamera;
    if (!camera || !this.listener) return;

    const position = camera.position;
    const forward = camera.getForwardRay().direction;
    const up = Vector3.Up();

    // Update listener position and orientation
    if (this.listener.positionX) {
      // Modern Web Audio API
      this.listener.positionX.value = position.x;
      this.listener.positionY.value = position.y;
      this.listener.positionZ.value = position.z;
      
      this.listener.forwardX.value = forward.x;
      this.listener.forwardY.value = forward.y;
      this.listener.forwardZ.value = forward.z;
      
      this.listener.upX.value = up.x;
      this.listener.upY.value = up.y;
      this.listener.upZ.value = up.z;
    } else {
      // Legacy API fallback
      this.listener.setPosition(position.x, position.y, position.z);
      this.listener.setOrientation(
        forward.x, forward.y, forward.z,
        up.x, up.y, up.z
      );
    }
  }

  createAudioSource(id, audioUrl, position, options = {}) {
    console.log(`🔊 Creating audio source: ${id}`);

    const player = new Tone.Player({
      url: audioUrl,
      loop: options.loop || false,
      autostart: options.autostart || false,
      volume: options.volume || 0
    }).toDestination();

    // Create panner for 3D positioning
    const panner = this.audioContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = options.distanceModel || 'inverse';
    panner.refDistance = options.refDistance || 1;
    panner.maxDistance = options.maxDistance || 100;
    panner.rolloffFactor = options.rolloffFactor || 1;

    // Set position
    if (panner.positionX) {
      panner.positionX.value = position.x;
      panner.positionY.value = position.y;
      panner.positionZ.value = position.z;
    } else {
      panner.setPosition(position.x, position.y, position.z);
    }

    // Connect player to panner
    const playerNode = player.context.rawContext.createMediaStreamDestination();
    // player.connect(panner); // Connect through panner for spatial audio

    this.audioSources.set(id, {
      player: player,
      panner: panner,
      position: position.clone(),
      options: options
    });

    return player;
  }

  updateSourcePosition(id, position) {
    const source = this.audioSources.get(id);
    if (!source) return;

    source.position = position.clone();
    
    const panner = source.panner;
    if (panner.positionX) {
      panner.positionX.value = position.x;
      panner.positionY.value = position.y;
      panner.positionZ.value = position.z;
    } else {
      panner.setPosition(position.x, position.y, position.z);
    }
  }

  playSound(id) {
    const source = this.audioSources.get(id);
    if (source && source.player) {
      source.player.start();
      console.log(`▶️ Playing audio: ${id}`);
    }
  }

  stopSound(id) {
    const source = this.audioSources.get(id);
    if (source && source.player) {
      source.player.stop();
      console.log(`⏹️ Stopped audio: ${id}`);
    }
  }

  setVolume(id, volume) {
    const source = this.audioSources.get(id);
    if (source && source.player) {
      source.player.volume.value = volume;
    }
  }

  async createVoiceChat(peerId, stream) {
    console.log(`🎤 Creating voice chat for peer: ${peerId}`);

    // Create audio element from stream
    const audioElement = new Audio();
    audioElement.srcObject = stream;
    audioElement.autoplay = true;

    // Create Web Audio source from element
    const source = this.audioContext.createMediaStreamSource(stream);
    
    // Create panner for spatial positioning
    const panner = this.audioContext.createPanner();
    panner.panningModel = 'HRTF';
    panner.distanceModel = 'inverse';
    panner.refDistance = 1;
    panner.maxDistance = 50;
    
    // Connect source -> panner -> destination
    source.connect(panner);
    panner.connect(this.audioContext.destination);

    this.audioSources.set(`voice_${peerId}`, {
      source: source,
      panner: panner,
      stream: stream,
      position: new Vector3(0, 0, 0),
      isVoice: true
    });

    return panner;
  }

  updateVoicePosition(peerId, position) {
    this.updateSourcePosition(`voice_${peerId}`, position);
  }

  removeVoiceChat(peerId) {
    const id = `voice_${peerId}`;
    const source = this.audioSources.get(id);
    
    if (source) {
      if (source.stream) {
        source.stream.getTracks().forEach(track => track.stop());
      }
      this.audioSources.delete(id);
      console.log(`🔇 Removed voice chat: ${peerId}`);
    }
  }

  setRoomAcoustics(acousticsConfig) {
    console.log('🎚️ Applying room acoustics:', acousticsConfig);

    // Apply reverb based on room type
    if (acousticsConfig.reverb) {
      const reverb = new Tone.Reverb({
        decay: acousticsConfig.reverb.decay || 2,
        preDelay: acousticsConfig.reverb.preDelay || 0.01,
        wet: acousticsConfig.reverb.wet || 0.3
      }).toDestination();

      // Connect all audio sources to reverb
      this.audioSources.forEach(source => {
        if (source.player) {
          source.player.connect(reverb);
        }
      });
    }

    // Apply EQ for room characteristics
    if (acousticsConfig.eq) {
      const eq = new Tone.EQ3({
        low: acousticsConfig.eq.low || 0,
        mid: acousticsConfig.eq.mid || 0,
        high: acousticsConfig.eq.high || 0
      }).toDestination();
    }
  }

  mute() {
    Tone.Destination.mute = true;
    console.log('🔇 Audio muted');
  }

  unmute() {
    Tone.Destination.mute = false;
    console.log('🔊 Audio unmuted');
  }

  setMasterVolume(volume) {
    Tone.Destination.volume.value = volume;
  }

  dispose() {
    // Stop all sounds
    this.audioSources.forEach((source, id) => {
      if (source.player) {
        source.player.stop();
        source.player.dispose();
      }
      if (source.stream) {
        source.stream.getTracks().forEach(track => track.stop());
      }
    });

    this.audioSources.clear();
    console.log('Spatial audio engine disposed');
  }
}

export default SpatialAudioEngine;
