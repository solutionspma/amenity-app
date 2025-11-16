//
//  IKAvatarNode.swift
//  Modularity Spatial OS - IK Avatar Node
//
//  Full-body IK avatar for VR multiplayer
//

import Foundation
import SceneKit

class IKAvatarNode {
    
    let rootNode: SCNNode
    
    // Body parts
    let headNode: SCNNode
    let torsoNode: SCNNode
    let leftArmNode: SCNNode
    let rightArmNode: SCNNode
    let leftLegNode: SCNNode
    let rightLegNode: SCNNode
    
    // Name tag
    let nameTagNode: SCNNode
    
    // IK parameters
    let armLength: Float = 0.6
    let legLength: Float = 0.8
    
    init(playerId: String) {
        rootNode = SCNNode()
        rootNode.name = "avatar_\(playerId)"
        
        // Create body parts
        headNode = Self.createHead()
        torsoNode = Self.createTorso()
        leftArmNode = Self.createArm()
        rightArmNode = Self.createArm()
        leftLegNode = Self.createLeg()
        rightLegNode = Self.createLeg()
        nameTagNode = Self.createNameTag(playerId)
        
        // Add to root
        rootNode.addChildNode(headNode)
        rootNode.addChildNode(torsoNode)
        rootNode.addChildNode(leftArmNode)
        rootNode.addChildNode(rightArmNode)
        rootNode.addChildNode(leftLegNode)
        rootNode.addChildNode(rightLegNode)
        rootNode.addChildNode(nameTagNode)
    }
    
    // MARK: - Update IK
    
    func updateIK(headPosition: SCNVector3, headRotation: SCNVector4) {
        // Update head
        headNode.position = headPosition
        headNode.rotation = headRotation
        
        // Update torso
        torsoNode.position = SCNVector3(headPosition.x, headPosition.y - 0.4, headPosition.z)
        torsoNode.rotation = headRotation
        
        // Calculate forward and right vectors
        let headEuler = SCNVector3(headRotation.x, headRotation.y, headRotation.z)
        let forward = SCNVector3(
            sin(headEuler.y),
            0,
            -cos(headEuler.y)
        )
        let right = SCNVector3(
            cos(headEuler.y),
            0,
            sin(headEuler.y)
        )
        
        // Position arms
        let shoulderHeight = headPosition.y - 0.2
        let shoulderWidth: Float = 0.3
        
        leftArmNode.position = SCNVector3(
            headPosition.x - right.x * shoulderWidth,
            shoulderHeight,
            headPosition.z - right.z * shoulderWidth
        )
        
        rightArmNode.position = SCNVector3(
            headPosition.x + right.x * shoulderWidth,
            shoulderHeight,
            headPosition.z + right.z * shoulderWidth
        )
        
        // Simple arm pointing forward
        leftArmNode.look(at: SCNVector3(
            headPosition.x + forward.x,
            shoulderHeight - 0.3,
            headPosition.z + forward.z
        ))
        
        rightArmNode.look(at: SCNVector3(
            headPosition.x + forward.x,
            shoulderHeight - 0.3,
            headPosition.z + forward.z
        ))
        
        // Position legs
        leftLegNode.position = SCNVector3(
            headPosition.x - 0.15,
            headPosition.y - 1.2,
            headPosition.z
        )
        
        rightLegNode.position = SCNVector3(
            headPosition.x + 0.15,
            headPosition.y - 1.2,
            headPosition.z
        )
        
        // Name tag above head
        nameTagNode.position = SCNVector3(headPosition.x, headPosition.y + 0.4, headPosition.z)
    }
    
    // MARK: - Create Body Parts
    
    static func createHead() -> SCNNode {
        let geometry = SCNSphere(radius: 0.18)
        geometry.firstMaterial?.diffuse.contents = UIColor(red: 1.0, green: 0.87, blue: 0.68, alpha: 1.0)
        return SCNNode(geometry: geometry)
    }
    
    static func createTorso() -> SCNNode {
        let geometry = SCNCylinder(radius: 0.18, height: 0.6)
        geometry.firstMaterial?.diffuse.contents = UIColor(red: 0.27, green: 0.4, blue: 1.0, alpha: 1.0)
        return SCNNode(geometry: geometry)
    }
    
    static func createArm() -> SCNNode {
        let geometry = SCNCylinder(radius: 0.05, height: 0.6)
        geometry.firstMaterial?.diffuse.contents = UIColor(red: 1.0, green: 0.87, blue: 0.68, alpha: 1.0)
        return SCNNode(geometry: geometry)
    }
    
    static func createLeg() -> SCNNode {
        let geometry = SCNCylinder(radius: 0.08, height: 0.8)
        geometry.firstMaterial?.diffuse.contents = UIColor(red: 0.2, green: 0.3, blue: 0.8, alpha: 1.0)
        return SCNNode(geometry: geometry)
    }
    
    static func createNameTag(_ text: String) -> SCNNode {
        let textGeometry = SCNText(string: text, extrusionDepth: 0.01)
        textGeometry.font = UIFont.systemFont(ofSize: 0.2, weight: .bold)
        textGeometry.firstMaterial?.diffuse.contents = UIColor.white
        textGeometry.firstMaterial?.emission.contents = UIColor.white
        
        let textNode = SCNNode(geometry: textGeometry)
        textNode.scale = SCNVector3(0.01, 0.01, 0.01)
        
        // Billboard constraint (always face camera)
        let constraint = SCNBillboardConstraint()
        textNode.constraints = [constraint]
        
        return textNode
    }
}
