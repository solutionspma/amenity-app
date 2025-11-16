/**
 * MultiplayerCore.js
 * Global WebSocket multiplayer system
 */

import { VRMultiplayer } from '../../vr/vrMultiplayer.js';

export class MultiplayerCore {
  constructor(engine) {
    this.engine = engine;
    this.client = null;
    this.enabled = false;
    this.serverURL = 'ws://localhost:8080';
    this.playerId = null;
    this.players = new Map();
    
    console.log('🌐 Multiplayer Core initialized');
  }

  /**
   * Connect to multiplayer server
   * @param {string} url - WebSocket server URL
   */
  connect(url = this.serverURL) {
    this.serverURL = url;
    
    if (this.engine.getCurrentRenderer() === 'three') {
      this.client = new VRMultiplayer(this.engine.scene, this.serverURL);
      this.enabled = true;
      console.log('✅ Multiplayer connected:', url);
    } else {
      // Fallback: create basic WebSocket connection
      this.connectBasic(url);
    }
  }

  /**
   * Basic WebSocket connection (for non-Three.js scenes)
   */
  connectBasic(url) {
    const ws = new WebSocket(url);
    
    ws.onopen = () => {
      console.log('✅ Basic multiplayer connected');
      this.enabled = true;
    };
    
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'player-joined':
          this.onPlayerJoined(data);
          break;
        case 'player-left':
          this.onPlayerLeft(data);
          break;
        case 'player-moved':
          this.onPlayerMoved(data);
          break;
      }
    };
    
    ws.onerror = (error) => {
      console.error('❌ Multiplayer error:', error);
    };
    
    ws.onclose = () => {
      console.log('🚪 Multiplayer disconnected');
      this.enabled = false;
    };
    
    this.client = ws;
  }

  /**
   * Send player position update
   * @param {Object} position - {x, y, z}
   * @param {Object} rotation - {x, y, z, w}
   */
  sendPosition(position, rotation) {
    if (!this.enabled || !this.client) return;
    
    const message = {
      type: 'player-moved',
      id: this.playerId,
      position,
      rotation
    };
    
    if (this.client instanceof WebSocket) {
      this.client.send(JSON.stringify(message));
    } else if (this.client.sendPosition) {
      this.client.sendPosition(position, rotation);
    }
  }

  /**
   * Handle player joined event
   */
  onPlayerJoined(data) {
    this.players.set(data.id, data);
    console.log('👤 Player joined:', data.id);
  }

  /**
   * Handle player left event
   */
  onPlayerLeft(data) {
    this.players.delete(data.id);
    console.log('👋 Player left:', data.id);
  }

  /**
   * Handle player moved event
   */
  onPlayerMoved(data) {
    const player = this.players.get(data.id);
    if (player) {
      player.position = data.position;
      player.rotation = data.rotation;
    }
  }

  /**
   * Update multiplayer systems
   */
  update(delta) {
    if (!this.enabled) return;
    
    // Send own position if camera exists
    if (this.engine.camera) {
      const pos = this.engine.camera.position;
      const rot = this.engine.camera.quaternion || this.engine.camera.rotation;
      
      // Throttle updates (send every 50ms)
      if (!this.lastUpdate || Date.now() - this.lastUpdate > 50) {
        this.sendPosition(pos, rot);
        this.lastUpdate = Date.now();
      }
    }
  }

  /**
   * Disconnect from server
   */
  disconnect() {
    if (this.client) {
      if (this.client instanceof WebSocket) {
        this.client.close();
      } else if (this.client.disconnect) {
        this.client.disconnect();
      }
    }
    
    this.enabled = false;
    this.players.clear();
    console.log('🚪 Disconnected from multiplayer');
  }

  dispose() {
    this.disconnect();
    this.client = null;
  }
}
