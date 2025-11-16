//
//  ARBridge.swift
//  Modularity Spatial OS - AR Bridge Plugin
//
//  JavaScript <-> Swift bridge for AR commands
//

import Foundation
import Capacitor

@objc(ARBridge)
public class ARBridge: CAPPlugin {
    
    // MARK: - Place Model in AR
    
    @objc func place(_ call: CAPPluginCall) {
        guard let modelName = call.getString("model") else {
            call.reject("Model name required")
            return
        }
        
        DispatchQueue.main.async {
            // Post notification to ARViewController
            NotificationCenter.default.post(
                name: NSNotification.Name("PLACE_MODEL"),
                object: modelName
            )
        }
        
        call.resolve([
            "success": true,
            "model": modelName
        ])
    }
    
    // MARK: - Enter AR Mode
    
    @objc func enterAR(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            let arVC = ARViewController()
            arVC.modalPresentationStyle = .fullScreen
            
            self.bridge?.viewController?.present(arVC, animated: true) {
                call.resolve(["success": true])
            }
        }
    }
    
    // MARK: - Exit AR Mode
    
    @objc func exitAR(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            self.bridge?.viewController?.dismiss(animated: true) {
                call.resolve(["success": true])
            }
        }
    }
    
    // MARK: - Clear All Models
    
    @objc func clearModels(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            NotificationCenter.default.post(
                name: NSNotification.Name("CLEAR_AR_MODELS"),
                object: nil
            )
        }
        
        call.resolve(["success": true])
    }
}
