//
//  ARViewController.swift
//  Modularity Spatial OS - ARKit Controller
//
//  Handles AR session, plane detection, model placement, and LiDAR scanning
//

import UIKit
import ARKit
import SceneKit

class ARViewController: UIViewController, ARSessionDelegate, ARSCNViewDelegate {
    
    var sceneView: ARSCNView!
    var config = ARWorldTrackingConfiguration()
    var placedModels: [SCNNode] = []
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        // Create AR scene view
        sceneView = ARSCNView(frame: self.view.bounds)
        sceneView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        self.view.addSubview(sceneView)
        
        // Configure AR session
        config.planeDetection = [.horizontal, .vertical]
        config.environmentTexturing = .automatic
        
        // Enable LiDAR depth if available (iPhone 12 Pro+)
        if ARWorldTrackingConfiguration.supportsFrameSemantics(.sceneDepth) {
            config.frameSemantics.insert(.sceneDepth)
        }
        
        // Enable realistic lighting
        sceneView.autoenablesDefaultLighting = true
        sceneView.automaticallyUpdatesLighting = true
        
        // Set delegates
        sceneView.session.delegate = self
        sceneView.delegate = self
        
        // Debug options (optional - remove for production)
        sceneView.debugOptions = [
            .showFeaturePoints,
            .showWorldOrigin
        ]
        
        // Add close button
        addCloseButton()
        
        // Listen for model placement notifications from JavaScript
        NotificationCenter.default.addObserver(
            forName: NSNotification.Name("PLACE_MODEL"),
            object: nil,
            queue: .main
        ) { [weak self] notification in
            if let modelName = notification.object as? String {
                self?.placeModel(named: modelName)
            }
        }
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        sceneView.session.run(config)
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        sceneView.session.pause()
    }
    
    // MARK: - UI Setup
    
    func addCloseButton() {
        let closeButton = UIButton(type: .system)
        closeButton.setTitle("✕ Exit AR", for: .normal)
        closeButton.backgroundColor = UIColor.black.withAlphaComponent(0.7)
        closeButton.setTitleColor(.white, for: .normal)
        closeButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 16)
        closeButton.layer.cornerRadius = 25
        closeButton.frame = CGRect(x: 20, y: 50, width: 120, height: 50)
        closeButton.addTarget(self, action: #selector(closeAR), for: .touchUpInside)
        self.view.addSubview(closeButton)
    }
    
    @objc func closeAR() {
        self.dismiss(animated: true, completion: nil)
    }
    
    // MARK: - Model Placement
    
    func placeModel(named modelName: String) {
        // Get current camera transform
        guard let frame = sceneView.session.currentFrame else {
            print("⚠️ No AR frame available")
            return
        }
        
        let cameraTransform = frame.camera.transform
        var translation = matrix_identity_float4x4
        translation.columns.3.z = -1.5 // 1.5 meters in front of camera
        let finalTransform = simd_mul(cameraTransform, translation)
        
        // Load and place model
        placeModelAtTransform(named: modelName, transform: finalTransform)
    }
    
    func placeModelAtTransform(named modelName: String, transform: simd_float4x4) {
        // Try loading from app bundle
        guard let modelURL = Bundle.main.url(forResource: modelName, withExtension: nil) else {
            print("⚠️ Model not found: \(modelName)")
            createPlaceholderObject(at: transform)
            return
        }
        
        do {
            let scene = try SCNScene(url: modelURL, options: nil)
            let node = scene.rootNode.clone()
            node.simdTransform = transform
            
            // Scale down if needed
            node.scale = SCNVector3(0.5, 0.5, 0.5)
            
            sceneView.scene.rootNode.addChildNode(node)
            placedModels.append(node)
            
            print("✅ Placed model: \(modelName)")
        } catch {
            print("❌ Error loading model: \(error)")
            createPlaceholderObject(at: transform)
        }
    }
    
    func createPlaceholderObject(at transform: simd_float4x4) {
        // Create a simple cube as placeholder
        let geometry = SCNBox(width: 0.2, height: 0.2, length: 0.2, chamferRadius: 0.01)
        geometry.firstMaterial?.diffuse.contents = UIColor.systemPurple
        geometry.firstMaterial?.emission.contents = UIColor.purple.withAlphaComponent(0.3)
        
        let node = SCNNode(geometry: geometry)
        node.simdTransform = transform
        
        sceneView.scene.rootNode.addChildNode(node)
        placedModels.append(node)
    }
    
    // MARK: - ARSCNViewDelegate
    
    func renderer(_ renderer: SCNSceneRenderer, didAdd node: SCNNode, for anchor: ARAnchor) {
        // Visualize detected planes
        guard let planeAnchor = anchor as? ARPlaneAnchor else { return }
        
        let planeGeometry = SCNPlane(
            width: CGFloat(planeAnchor.extent.x),
            height: CGFloat(planeAnchor.extent.z)
        )
        
        planeGeometry.firstMaterial?.diffuse.contents = UIColor.white.withAlphaComponent(0.2)
        
        let planeNode = SCNNode(geometry: planeGeometry)
        planeNode.position = SCNVector3(
            planeAnchor.center.x,
            0,
            planeAnchor.center.z
        )
        planeNode.eulerAngles.x = -.pi / 2
        
        node.addChildNode(planeNode)
    }
    
    func renderer(_ renderer: SCNSceneRenderer, didUpdate node: SCNNode, for anchor: ARAnchor) {
        // Update plane visualization when ARKit refines detection
        guard let planeAnchor = anchor as? ARPlaneAnchor,
              let planeNode = node.childNodes.first,
              let planeGeometry = planeNode.geometry as? SCNPlane else { return }
        
        planeGeometry.width = CGFloat(planeAnchor.extent.x)
        planeGeometry.height = CGFloat(planeAnchor.extent.z)
        
        planeNode.position = SCNVector3(
            planeAnchor.center.x,
            0,
            planeAnchor.center.z
        )
    }
    
    // MARK: - ARSessionDelegate
    
    func session(_ session: ARSession, didFailWithError error: Error) {
        print("❌ AR Session failed: \(error.localizedDescription)")
    }
    
    func sessionWasInterrupted(_ session: ARSession) {
        print("⚠️ AR Session interrupted")
    }
    
    func sessionInterruptionEnded(_ session: ARSession) {
        print("✅ AR Session resumed")
        sceneView.session.run(config, options: [.resetTracking, .removeExistingAnchors])
    }
}
