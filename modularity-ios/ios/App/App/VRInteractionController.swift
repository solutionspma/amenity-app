//
//  VRInteractionController.swift
//  Modularity Spatial OS - VR Interaction Controller
//
//  Manages VR interactions in native iOS environment
//

import UIKit
import SceneKit
import CoreMotion

class VRInteractionController: UIViewController {
    
    var scnView: SCNView!
    var scene: SCNScene!
    var camera: SCNNode!
    var cameraRig: SCNNode!
    
    // Interaction state
    var selectedObject: SCNNode?
    var grabbedObject: SCNNode?
    var teleportMarker: SCNNode!
    
    // MARK: - Lifecycle
    
    override func viewDidLoad() {
        super.viewDidLoad()
        
        setupScene()
        setupCamera()
        setupInteractionMarkers()
        setupGestures()
        
        // Start hand tracking
        VRHandTracking.shared.start()
        
        // Update loop
        scnView.delegate = self
        
        print("🎮 VR Interaction Controller initialized")
    }
    
    override func viewWillDisappear(_ animated: Bool) {
        super.viewWillDisappear(animated)
        VRHandTracking.shared.stop()
    }
    
    // MARK: - Scene Setup
    
    func setupScene() {
        scnView = SCNView(frame: self.view.bounds)
        scnView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
        scnView.backgroundColor = .black
        
        self.view.addSubview(scnView)
        
        scene = SCNScene()
        scnView.scene = scene
        
        // Lighting
        let ambient = SCNLight()
        ambient.type = .ambient
        ambient.intensity = 300
        let ambientNode = SCNNode()
        ambientNode.light = ambient
        scene.rootNode.addChildNode(ambientNode)
    }
    
    func setupCamera() {
        cameraRig = SCNNode()
        cameraRig.position = SCNVector3(0, 1.6, 0)
        scene.rootNode.addChildNode(cameraRig)
        
        camera = SCNNode()
        camera.camera = SCNCamera()
        camera.camera?.zNear = 0.01
        camera.camera?.zFar = 1000
        cameraRig.addChildNode(camera)
        
        scnView.pointOfView = camera
    }
    
    func setupInteractionMarkers() {
        // Teleport marker
        teleportMarker = SCNNode(geometry: SCNTorus(ringRadius: 0.4, pipeRadius: 0.05))
        teleportMarker.geometry?.firstMaterial?.diffuse.contents = UIColor.systemGreen
        teleportMarker.geometry?.firstMaterial?.emission.contents = UIColor.green
        teleportMarker.eulerAngles.x = -.pi / 2
        teleportMarker.isHidden = true
        scene.rootNode.addChildNode(teleportMarker)
    }
    
    // MARK: - Gesture Setup
    
    func setupGestures() {
        // Tap to select/interact
        let tapGesture = UITapGestureRecognizer(target: self, action: #selector(handleTap))
        scnView.addGestureRecognizer(tapGesture)
        
        // Long press to grab
        let longPress = UILongPressGestureRecognizer(target: self, action: #selector(handleLongPress))
        scnView.addGestureRecognizer(longPress)
        
        // Two-finger tap to teleport
        let twoFingerTap = UITapGestureRecognizer(target: self, action: #selector(handleTwoFingerTap))
        twoFingerTap.numberOfTouchesRequired = 2
        scnView.addGestureRecognizer(twoFingerTap)
    }
    
    // MARK: - Interaction Handlers
    
    @objc func handleTap(_ gesture: UITapGestureRecognizer) {
        let location = gesture.location(in: scnView)
        let hitResults = scnView.hitTest(location, options: [:])
        
        if let hit = hitResults.first {
            selectObject(hit.node)
        }
    }
    
    @objc func handleLongPress(_ gesture: UILongPressGestureRecognizer) {
        let location = gesture.location(in: scnView)
        let hitResults = scnView.hitTest(location, options: [:])
        
        switch gesture.state {
        case .began:
            if let hit = hitResults.first {
                grabObject(hit.node)
            }
        case .ended, .cancelled:
            releaseObject()
        default:
            break
        }
    }
    
    @objc func handleTwoFingerTap(_ gesture: UITapGestureRecognizer) {
        let location = gesture.location(in: scnView)
        let hitResults = scnView.hitTest(location, options: [:])
        
        if let hit = hitResults.first {
            teleportTo(hit.worldCoordinates)
        }
    }
    
    // MARK: - Interaction Methods
    
    func selectObject(_ node: SCNNode) {
        // Deselect previous
        selectedObject?.geometry?.firstMaterial?.emission.contents = UIColor.black
        
        // Select new
        selectedObject = node
        node.geometry?.firstMaterial?.emission.contents = UIColor.blue
        
        // Haptic feedback
        let impact = UIImpactFeedbackGenerator(style: .medium)
        impact.impactOccurred()
        
        print("✅ Selected:", node.name ?? "unnamed")
    }
    
    func grabObject(_ node: SCNNode) {
        guard node.name != "floor" else { return }
        
        grabbedObject = node
        node.geometry?.firstMaterial?.emission.contents = UIColor.yellow
        
        let impact = UIImpactFeedbackGenerator(style: .heavy)
        impact.impactOccurred()
        
        print("✋ Grabbed:", node.name ?? "unnamed")
    }
    
    func releaseObject() {
        if let obj = grabbedObject {
            obj.geometry?.firstMaterial?.emission.contents = UIColor.black
            print("🖐️ Released:", obj.name ?? "unnamed")
        }
        grabbedObject = nil
    }
    
    func teleportTo(_ position: SCNVector3) {
        cameraRig.position = SCNVector3(position.x, position.y + 1.6, position.z)
        
        // Flash teleport marker
        teleportMarker.position = position
        teleportMarker.isHidden = false
        
        SCNTransaction.begin()
        SCNTransaction.animationDuration = 0.3
        teleportMarker.opacity = 0
        SCNTransaction.completionBlock = {
            self.teleportMarker.isHidden = true
            self.teleportMarker.opacity = 1
        }
        SCNTransaction.commit()
        
        // Haptic feedback
        let impact = UIImpactFeedbackGenerator(style: .heavy)
        impact.impactOccurred()
        
        print("📍 Teleported to:", position)
    }
}

// MARK: - SCNSceneRendererDelegate

extension VRInteractionController: SCNSceneRendererDelegate {
    func renderer(_ renderer: SCNSceneRenderer, updateAtTime time: TimeInterval) {
        // Update camera rotation from hand tracking
        let rotation = VRHandTracking.shared.getRotation()
        camera.eulerAngles = SCNVector3(
            Float(rotation.pitch),
            Float(-rotation.yaw),
            Float(rotation.roll)
        )
        
        // Update grabbed object position
        if let obj = grabbedObject {
            let handOffset = SCNVector3(0, -0.3, -0.5)
            obj.position = camera.convertPosition(handOffset, to: scene.rootNode)
        }
    }
}
