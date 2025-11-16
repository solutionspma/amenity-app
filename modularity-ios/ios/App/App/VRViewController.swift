//
//  VRViewController.swift
//  Modularity Spatial OS - VRKit Controller
//
//  Stereoscopic VR with head tracking using CoreMotion
//

import UIKit
import SceneKit
import CoreMotion

class VRViewController: UIViewController {
    
    var scnView: SCNView!
    var scene: SCNScene!
    let motionManager = CMMotionManager()
    
    // Camera rig for stereoscopic rendering
    var leftCamera = SCNCamera()
    var rightCamera = SCNCamera()
    var leftNode = SCNNode()
    var rightNode = SCNNode()
    var rigNode = SCNNode()
    
    // Eye separation (interpupillary distance)
    let eyeSeparation: Float = 0.064 // 64mm average
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupScene()
        setupStereoCameras()
        setupEnvironment()
        addCloseButton()
        startHeadTracking()
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        stopHeadTracking()
    }
    
    // MARK: - Scene Setup
    
    func setupScene() {
        scnView = SCNView(frame: self.view.bounds)
        scnView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        scnView.backgroundColor = .black
        scnView.isPlaying = true
        scnView.loops = true
        
        self.view.addSubview(scnView)
        
        scene = SCNScene()
        scnView.scene = scene
    }
    
    func setupStereoCameras() {
        // Configure cameras for each eye
        leftCamera.zNear = 0.01
        leftCamera.zFar = 1000
        leftCamera.fieldOfView = 60
        
        rightCamera.zNear = 0.01
        rightCamera.zFar = 1000
        rightCamera.fieldOfView = 60
        
        // Create camera nodes
        leftNode.camera = leftCamera
        rightNode.camera = rightCamera
        
        // Position cameras for stereoscopic effect
        leftNode.position.x = -eyeSeparation / 2
        rightNode.position.x = eyeSeparation / 2
        
        // Add to rig
        rigNode.addChildNode(leftNode)
        rigNode.addChildNode(rightNode)
        
        // Position rig
        rigNode.position = SCNVector3(0, 1.6, 0) // Standing height
        
        scene.rootNode.addChildNode(rigNode)
        
        // Point of view for rendering (use left camera for single view)
        scnView.pointOfView = leftNode
    }
    
    func setupEnvironment() {
        // Add ambient light
        let ambientLight = SCNLight()
        ambientLight.type = .ambient
        ambientLight.color = UIColor.white
        ambientLight.intensity = 200
        
        let ambientNode = SCNNode()
        ambientNode.light = ambientLight
        scene.rootNode.addChildNode(ambientNode)
        
        // Add directional light
        let directionalLight = SCNLight()
        directionalLight.type = .directional
        directionalLight.color = UIColor.white
        directionalLight.intensity = 800
        
        let directionalNode = SCNNode()
        directionalNode.light = directionalLight
        directionalNode.position = SCNVector3(0, 10, 0)
        directionalNode.eulerAngles = SCNVector3(-Float.pi / 3, 0, 0)
        scene.rootNode.addChildNode(directionalNode)
        
        // Create sample environment (grid floor)
        createGridFloor()
        createSkybox()
    }
    
    func createGridFloor() {
        let gridSize: CGFloat = 50
        let divisions = 50
        
        for i in 0...divisions {
            let offset = (CGFloat(i) / CGFloat(divisions) - 0.5) * gridSize
            
            // Horizontal lines
            let hLine = SCNCylinder(radius: 0.01, height: gridSize)
            hLine.firstMaterial?.diffuse.contents = UIColor.white.withAlphaComponent(0.3)
            let hNode = SCNNode(geometry: hLine)
            hNode.position = SCNVector3(offset, 0, 0)
            hNode.eulerAngles = SCNVector3(0, 0, Float.pi / 2)
            scene.rootNode.addChildNode(hNode)
            
            // Vertical lines
            let vLine = SCNCylinder(radius: 0.01, height: gridSize)
            vLine.firstMaterial?.diffuse.contents = UIColor.white.withAlphaComponent(0.3)
            let vNode = SCNNode(geometry: vLine)
            vNode.position = SCNVector3(0, 0, offset)
            scene.rootNode.addChildNode(vNode)
        }
    }
    
    func createSkybox() {
        // Simple gradient skybox
        let skyboxGeometry = SCNBox(width: 500, height: 500, length: 500, chamferRadius: 0)
        skyboxGeometry.firstMaterial?.diffuse.contents = UIColor(red: 0.1, green: 0.1, blue: 0.15, alpha: 1.0)
        skyboxGeometry.firstMaterial?.isDoubleSided = true
        
        let skyboxNode = SCNNode(geometry: skyboxGeometry)
        scene.rootNode.addChildNode(skyboxNode)
    }
    
    // MARK: - Head Tracking
    
    func startHeadTracking() {
        guard motionManager.isDeviceMotionAvailable else {
            print("⚠️ Device motion not available")
            return
        }
        
        motionManager.deviceMotionUpdateInterval = 1.0 / 60.0
        
        motionManager.startDeviceMotionUpdates(
            using: .xArbitraryZVertical,
            to: OperationQueue.main
        ) { [weak self] motion, error in
            guard let self = self, let motion = motion else { return }
            
            let attitude = motion.attitude
            
            // Convert to Euler angles
            self.rigNode.eulerAngles = SCNVector3(
                Float(attitude.pitch),
                Float(attitude.yaw * -1), // Invert yaw for natural rotation
                Float(attitude.roll)
            )
        }
        
        print("✅ VR head tracking started")
    }
    
    func stopHeadTracking() {
        motionManager.stopDeviceMotionUpdates()
        print("⏸ VR head tracking stopped")
    }
    
    // MARK: - UI
    
    func addCloseButton() {
        let closeButton = UIButton(type: .system)
        closeButton.setTitle("✕ Exit VR", for: .normal)
        closeButton.backgroundColor = UIColor.black.withAlphaComponent(0.7)
        closeButton.setTitleColor(.white, for: .normal)
        closeButton.titleLabel?.font = UIFont.boldSystemFont(ofSize: 16)
        closeButton.layer.cornerRadius = 25
        closeButton.frame = CGRect(x: 20, y: 50, width: 120, height: 50)
        closeButton.addTarget(self, action: #selector(closeVR), for: .touchUpInside)
        self.view.addSubview(closeButton)
    }
    
    @objc func closeVR() {
        self.dismiss(animated: true, completion: nil)
    }
    
    // MARK: - Public Methods
    
    func loadWorldFromWeb(_ worldData: [String: Any]) {
        // This would receive scene data from JavaScript
        // and rebuild the 3D environment in VR
        print("📦 Loading VR world data: \(worldData)")
    }
}
