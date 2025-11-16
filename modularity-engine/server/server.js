/**
 * server.js
 * VR Multiplayer WebSocket Server
 * Handles real-time avatar position syncing for Modularity Spatial OS
 */

const WebSocket = require('ws');

const PORT = 8080;
const wss = new WebSocket.Server({ port: PORT });

// Store connected clients
const clients = new Map();

wss.on('connection', (ws) => {
  let playerId = null;

  console.log('🔌 New connection');

  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'join':
          playerId = data.id;
          clients.set(playerId, ws);
          console.log(`✅ Player joined: ${playerId} (${clients.size} total)`);
          
          // Broadcast to all other clients
          broadcast({ type: 'join', id: playerId }, ws);
          break;

        case 'update':
          // Relay position updates to all other clients
          broadcast(data, ws);
          break;

        case 'leave':
          handleDisconnect(ws, playerId);
          break;

        default:
          console.log('📨 Unknown message type:', data.type);
      }
    } catch (error) {
      console.error('❌ Error parsing message:', error);
    }
  });

  ws.on('close', () => {
    handleDisconnect(ws, playerId);
  });

  ws.on('error', (error) => {
    console.error('❌ WebSocket error:', error);
  });
});

function broadcast(data, sender) {
  wss.clients.forEach(client => {
    if (client !== sender && client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
}

function handleDisconnect(ws, playerId) {
  if (playerId) {
    clients.delete(playerId);
    console.log(`👋 Player left: ${playerId} (${clients.size} remaining)`);
    
    // Notify other clients
    broadcast({ type: 'leave', id: playerId }, ws);
  } else {
    console.log('🔌 Client disconnected (no player ID)');
  }
}

console.log(`🚀 VR Multiplayer Server running on port ${PORT}`);
console.log(`📡 WebSocket URL: ws://localhost:${PORT}`);
console.log(`🌐 Network URL: ws://YOUR-IP:${PORT}`);
console.log('\n⏳ Waiting for connections...\n');
