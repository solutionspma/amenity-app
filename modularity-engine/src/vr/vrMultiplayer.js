/**
 * vrMultiplayer.js
 * VR Multiplayer Network Client
 * Connects to WebSocket server and syncs avatar positions
 */

export class VRMultiplayer {
  constructor(avatarManager) {
    this.avatarManager = avatarManager;
    this.socket = null;
    this.connected = false;
    this.playerId = this.generatePlayerId();
    this.serverUrl = 'ws://localhost:8080'; // Change to your server IP
    
    this.connect();
  }

  connect() {
    console.log('🔌 Connecting to VR multiplayer server...');
    
    try {
      this.socket = new WebSocket(this.serverUrl);

      this.socket.onopen = () => {
        this.connected = true;
        console.log('✅ Connected to multiplayer server');
        
        // Send join message
        this.send({
          type: 'join',
          id: this.playerId
        });
      };

      this.socket.onmessage = (msg) => {
        try {
          const data = JSON.parse(msg.data);
          this.handleMessage(data);
        } catch (error) {
          console.error('❌ Failed to parse message:', error);
        }
      };

      this.socket.onerror = (error) => {
        console.error('❌ WebSocket error:', error);
      };

      this.socket.onclose = () => {
        this.connected = false;
        console.log('🔌 Disconnected from multiplayer server');
        
        // Attempt reconnection after 5 seconds
        setTimeout(() => this.connect(), 5000);
      };

    } catch (error) {
      console.error('❌ Failed to connect:', error);
    }
  }

  handleMessage(data) {
    switch (data.type) {
      case 'update':
        // Update remote player avatar
        if (data.id !== this.playerId) {
          this.avatarManager.updateRemote(data.id, data.pos, data.rot);
        }
        break;
      
      case 'leave':
        // Remove disconnected player
        this.avatarManager.removeAvatar(data.id);
        console.log('👋 Player left:', data.id);
        break;
      
      default:
        console.log('📨 Received:', data);
    }
  }

  sendLocal(pos, rot) {
    if (!this.connected || !this.socket) return;

    this.send({
      type: 'update',
      id: this.playerId,
      pos: { x: pos.x, y: pos.y, z: pos.z },
      rot: { x: rot.x, y: rot.y, z: rot.z }
    });
  }

  send(data) {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(JSON.stringify(data));
    }
  }

  generatePlayerId() {
    return 'player_' + Math.random().toString(36).substr(2, 9);
  }

  disconnect() {
    if (this.socket) {
      this.send({ type: 'leave', id: this.playerId });
      this.socket.close();
    }
  }
}
