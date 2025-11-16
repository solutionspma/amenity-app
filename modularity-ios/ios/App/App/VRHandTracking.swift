//
//  VRHandTracking.swift
//  Modularity Spatial OS - VR Hand Tracking
//
//  Uses CoreMotion for real-time device orientation tracking
//

import Foundation
import CoreMotion
import Capacitor

class VRHandTracking {
    static let shared = VRHandTracking()
    private let motionManager = CMMotionManager()
    
    private var isTracking = false
    
    // MARK: - Start Tracking
    
    func start() {
        guard motionManager.isDeviceMotionAvailable else {
            print("⚠️ Device motion not available")
            return
        }
        
        motionManager.deviceMotionUpdateInterval = 1.0 / 60.0
        motionManager.startDeviceMotionUpdates(using: .xArbitraryZVertical)
        
        isTracking = true
        print("✅ VR Hand Tracking started (60Hz)")
    }
    
    // MARK: - Stop Tracking
    
    func stop() {
        motionManager.stopDeviceMotionUpdates()
        isTracking = false
        print("⏸ VR Hand Tracking stopped")
    }
    
    // MARK: - Get Current Rotation
    
    func getRotation() -> (pitch: Double, yaw: Double, roll: Double) {
        guard let motion = motionManager.deviceMotion else {
            return (0, 0, 0)
        }
        
        let attitude = motion.attitude
        return (
            pitch: attitude.pitch,
            yaw: attitude.yaw,
            roll: attitude.roll
        )
    }
    
    // MARK: - Get Rotation as Dictionary (for JS bridge)
    
    func getRotationDict() -> [String: Double] {
        let rotation = getRotation()
        return [
            "pitch": rotation.pitch,
            "yaw": rotation.yaw,
            "roll": rotation.roll
        ]
    }
    
    // MARK: - Get Acceleration
    
    func getAcceleration() -> (x: Double, y: Double, z: Double) {
        guard let motion = motionManager.deviceMotion else {
            return (0, 0, 0)
        }
        
        let accel = motion.userAcceleration
        return (
            x: accel.x,
            y: accel.y,
            z: accel.z
        )
    }
    
    // MARK: - Get Gravity
    
    func getGravity() -> (x: Double, y: Double, z: Double) {
        guard let motion = motionManager.deviceMotion else {
            return (0, -1, 0) // Default gravity
        }
        
        let gravity = motion.gravity
        return (
            x: gravity.x,
            y: gravity.y,
            z: gravity.z
        )
    }
}

// MARK: - Capacitor Plugin Bridge

@objc(VRHandTrackingBridge)
public class VRHandTrackingBridge: CAPPlugin {
    
    @objc func startTracking(_ call: CAPPluginCall) {
        VRHandTracking.shared.start()
        call.resolve(["success": true])
    }
    
    @objc func stopTracking(_ call: CAPPluginCall) {
        VRHandTracking.shared.stop()
        call.resolve(["success": true])
    }
    
    @objc func getRotation(_ call: CAPPluginCall) {
        let rotation = VRHandTracking.shared.getRotationDict()
        call.resolve(rotation)
    }
    
    @objc func getAcceleration(_ call: CAPPluginCall) {
        let accel = VRHandTracking.shared.getAcceleration()
        call.resolve([
            "x": accel.x,
            "y": accel.y,
            "z": accel.z
        ])
    }
}
