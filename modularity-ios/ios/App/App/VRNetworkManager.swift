//
//  VRNetworkManager.swift
//  Modularity Spatial OS - VR Network Manager
//
//  Handles WebSocket connection for VR multiplayer
//

import Foundation

class VRNetworkManager: NSObject {
    
    static let shared = VRNetworkManager()
    
    private var webSocket: URLSessionWebSocketTask?
    private var session: URLSession?
    private var isConnected = false
    
    var onMessageReceived: ((Data) -> Void)?
    
    // MARK: - Connect
    
    func connect(to urlString: String) {
        guard let url = URL(string: urlString) else {
            print("❌ Invalid WebSocket URL")
            return
        }
        
        session = URLSession(configuration: .default, delegate: self, delegateQueue: OperationQueue())
        webSocket = session?.webSocketTask(with: url)
        webSocket?.resume()
        
        receiveMessage()
        
        print("🔌 Connecting to:", urlString)
    }
    
    // MARK: - Disconnect
    
    func disconnect() {
        webSocket?.cancel(with: .goingAway, reason: nil)
        isConnected = false
        print("🔌 Disconnected from VR multiplayer")
    }
    
    // MARK: - Send Message
    
    func send(_ data: Data) {
        guard isConnected else {
            print("⚠️ Not connected to server")
            return
        }
        
        let message = URLSessionWebSocketTask.Message.data(data)
        webSocket?.send(message) { error in
            if let error = error {
                print("❌ Send error:", error)
            }
        }
    }
    
    func sendJSON(_ dictionary: [String: Any]) {
        do {
            let data = try JSONSerialization.data(withJSONObject: dictionary)
            send(data)
        } catch {
            print("❌ JSON serialization error:", error)
        }
    }
    
    // MARK: - Receive Message
    
    private func receiveMessage() {
        webSocket?.receive { [weak self] result in
            switch result {
            case .success(let message):
                switch message {
                case .data(let data):
                    self?.onMessageReceived?(data)
                case .string(let text):
                    if let data = text.data(using: .utf8) {
                        self?.onMessageReceived?(data)
                    }
                @unknown default:
                    break
                }
                
                // Continue receiving
                self?.receiveMessage()
                
            case .failure(let error):
                print("❌ Receive error:", error)
            }
        }
    }
    
    // MARK: - Send Avatar Update
    
    func sendAvatarUpdate(playerId: String, position: (x: Float, y: Float, z: Float), rotation: (x: Float, y: Float, z: Float)) {
        let data: [String: Any] = [
            "type": "update",
            "id": playerId,
            "pos": [
                "x": position.x,
                "y": position.y,
                "z": position.z
            ],
            "rot": [
                "x": rotation.x,
                "y": rotation.y,
                "z": rotation.z
            ]
        ]
        
        sendJSON(data)
    }
}

// MARK: - URLSessionWebSocketDelegate

extension VRNetworkManager: URLSessionWebSocketDelegate {
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didOpenWithProtocol protocol: String?) {
        isConnected = true
        print("✅ Connected to VR multiplayer server")
    }
    
    func urlSession(_ session: URLSession, webSocketTask: URLSessionWebSocketTask, didCloseWith closeCode: URLSessionWebSocketTask.CloseCode, reason: Data?) {
        isConnected = false
        print("🔌 Connection closed")
    }
}
