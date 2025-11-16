//
//  VRBridge.swift
//  Modularity Spatial OS - VR Bridge Plugin
//
//  JavaScript <-> Swift bridge for VR commands
//

import Foundation
import Capacitor

@objc(VRBridge)
public class VRBridge: CAPPlugin {
    
    private var vrViewController: VRViewController?
    
    // MARK: - Enter VR Mode
    
    @objc func enterVR(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let vrVC = VRViewController()
            vrVC.modalPresentationStyle = .fullScreen
            self.vrViewController = vrVC
            
            self.bridge?.viewController?.present(vrVC, animated: true) {
                call.resolve([
                    "success": true,
                    "message": "VR mode activated"
                ])
            }
        }
    }
    
    // MARK: - Exit VR Mode
    
    @objc func exitVR(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.bridge?.viewController?.dismiss(animated: true) {
                self.vrViewController = nil
                call.resolve([
                    "success": true,
                    "message": "VR mode exited"
                ])
            }
        }
    }
    
    // MARK: - Load World Data
    
    @objc func loadWorld(_ call: CAPPluginCall) {
        guard let worldData = call.getObject("world") else {
            call.reject("World data required")
            return
        }
        
        DispatchQueue.main.async {
            self.vrViewController?.loadWorldFromWeb(worldData)
            call.resolve(["success": true])
        }
    }
    
    // MARK: - Get Head Orientation
    
    @objc func getOrientation(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            guard let vrVC = self.vrViewController else {
                call.reject("VR not active")
                return
            }
            
            let eulers = vrVC.rigNode.eulerAngles
            
            call.resolve([
                "pitch": eulers.x,
                "yaw": eulers.y,
                "roll": eulers.z
            ])
        }
    }
}
