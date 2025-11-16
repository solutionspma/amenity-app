/**
 * MODULARITY SPATIAL OS - VOICE CHAT
 * WebRTC voice communication with spatial audio integration
 */

export class VoiceChat {
  constructor(scene, spatialAudio, supabase) {
    this.scene = scene;
    this.spatialAudio = spatialAudio;
    this.supabase = supabase;
    this.localStream = null;
    this.peerConnections = new Map();
    this.isMuted = false;
    this.isDeafened = false;
  }

  async initialize() {
    console.log('🎤 Initializing Voice Chat...');

    try {
      // Request microphone access
      this.localStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        },
        video: false
      });

      console.log('✅ Microphone access granted');
      return true;

    } catch (error) {
      console.error('❌ Failed to access microphone:', error);
      return false;
    }
  }

  async connectToPeer(peerId, offerData = null) {
    console.log(`🔗 Connecting to peer: ${peerId}`);

    // Create RTCPeerConnection
    const peerConnection = new RTCPeerConnection({
      iceServers: [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' }
      ]
    });

    // Add local stream tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => {
        peerConnection.addTrack(track, this.localStream);
      });
    }

    // Handle incoming remote stream
    peerConnection.ontrack = (event) => {
      console.log(`📡 Received remote stream from: ${peerId}`);
      this.handleRemoteStream(peerId, event.streams[0]);
    };

    // Handle ICE candidates
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        this.sendSignal(peerId, {
          type: 'ice-candidate',
          candidate: event.candidate
        });
      }
    };

    // Connection state monitoring
    peerConnection.onconnectionstatechange = () => {
      console.log(`Peer ${peerId} connection state:`, peerConnection.connectionState);
      
      if (peerConnection.connectionState === 'disconnected') {
        this.disconnectPeer(peerId);
      }
    };

    this.peerConnections.set(peerId, peerConnection);

    // If we received an offer, create answer
    if (offerData) {
      await peerConnection.setRemoteDescription(new RTCSessionDescription(offerData));
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      this.sendSignal(peerId, {
        type: 'answer',
        answer: answer
      });
    } else {
      // Create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      this.sendSignal(peerId, {
        type: 'offer',
        offer: offer
      });
    }

    return peerConnection;
  }

  handleRemoteStream(peerId, stream) {
    // Integrate with spatial audio
    if (this.spatialAudio) {
      this.spatialAudio.createVoiceChat(peerId, stream);
    }

    // Dispatch event for UI
    window.dispatchEvent(new CustomEvent('peer-voice-connected', {
      detail: { peerId, stream }
    }));
  }

  async sendSignal(peerId, data) {
    // Send signaling data through Supabase realtime
    if (this.supabase) {
      await this.supabase
        .from('voice_signals')
        .insert({
          from_peer: this.getLocalPeerId(),
          to_peer: peerId,
          signal_data: data,
          timestamp: new Date().toISOString()
        });
    }
  }

  handleSignal(fromPeerId, signalData) {
    const peerConnection = this.peerConnections.get(fromPeerId);

    if (!peerConnection) {
      // New connection
      if (signalData.type === 'offer') {
        this.connectToPeer(fromPeerId, signalData.offer);
      }
      return;
    }

    // Handle answer
    if (signalData.type === 'answer') {
      peerConnection.setRemoteDescription(new RTCSessionDescription(signalData.answer));
    }

    // Handle ICE candidate
    if (signalData.type === 'ice-candidate') {
      peerConnection.addIceCandidate(new RTCIceCandidate(signalData.candidate));
    }
  }

  updatePeerPosition(peerId, position) {
    // Update spatial audio position
    if (this.spatialAudio) {
      this.spatialAudio.updateVoicePosition(peerId, position);
    }
  }

  mute() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = false;
      });
      this.isMuted = true;
      console.log('🔇 Muted');
    }
  }

  unmute() {
    if (this.localStream) {
      this.localStream.getAudioTracks().forEach(track => {
        track.enabled = true;
      });
      this.isMuted = false;
      console.log('🎤 Unmuted');
    }
  }

  toggleMute() {
    if (this.isMuted) {
      this.unmute();
    } else {
      this.mute();
    }
  }

  deafen() {
    // Mute all incoming audio
    this.peerConnections.forEach((pc, peerId) => {
      const receivers = pc.getReceivers();
      receivers.forEach(receiver => {
        if (receiver.track.kind === 'audio') {
          receiver.track.enabled = false;
        }
      });
    });
    this.isDeafened = true;
    console.log('🔇 Deafened');
  }

  undeafen() {
    this.peerConnections.forEach((pc, peerId) => {
      const receivers = pc.getReceivers();
      receivers.forEach(receiver => {
        if (receiver.track.kind === 'audio') {
          receiver.track.enabled = true;
        }
      });
    });
    this.isDeafened = false;
    console.log('🔊 Undeafened');
  }

  disconnectPeer(peerId) {
    const pc = this.peerConnections.get(peerId);
    if (pc) {
      pc.close();
      this.peerConnections.delete(peerId);
    }

    // Remove from spatial audio
    if (this.spatialAudio) {
      this.spatialAudio.removeVoiceChat(peerId);
    }

    console.log(`🔌 Disconnected from peer: ${peerId}`);
  }

  getLocalPeerId() {
    // Get from session or generate
    return localStorage.getItem('peer_id') || this.generatePeerId();
  }

  generatePeerId() {
    const id = 'peer_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('peer_id', id);
    return id;
  }

  dispose() {
    // Stop local stream
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }

    // Close all peer connections
    this.peerConnections.forEach((pc, peerId) => {
      this.disconnectPeer(peerId);
    });

    console.log('Voice Chat disposed');
  }
}

export default VoiceChat;
