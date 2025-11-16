/**
 * MODULARITY SPATIAL OS - CREATOR MODE
 * Drag-and-drop room builder for churches and creators
 */

import { Vector3, Quaternion } from '@babylonjs/core/Maths/math';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import { Color3 } from '@babylonjs/core/Maths/math.color';
import { HighlightLayer } from '@babylonjs/core/Layers/highlightLayer';

export class CreatorMode {
  constructor(scene, interactionManager) {
    this.scene = scene;
    this.interactionManager = interactionManager;
    this.isActive = false;
    this.selectedObject = null;
    this.placedObjects = [];
    this.highlightLayer = null;
    this.gridHelper = null;
    this.snapToGrid = true;
    this.gridSize = 0.5;
  }

  initialize() {
    console.log('🎨 Initializing Creator Mode...');
    
    // Create highlight layer for selected objects
    this.highlightLayer = new HighlightLayer('highlight', this.scene);
    
    // Setup controls
    this.setupControls();
    
    console.log('✅ Creator Mode initialized');
  }

  activate() {
    this.isActive = true;
    console.log('🎨 Creator Mode ACTIVATED');
    
    // Show grid
    this.showGrid();
    
    // Enable creator controls
    this.enableCreatorControls();
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('creator-mode-activated'));
  }

  deactivate() {
    this.isActive = false;
    console.log('🎨 Creator Mode DEACTIVATED');
    
    // Hide grid
    this.hideGrid();
    
    // Clear selection
    this.deselectObject();
    
    // Dispatch event
    window.dispatchEvent(new CustomEvent('creator-mode-deactivated'));
  }

  setupControls() {
    // Keyboard shortcuts
    window.addEventListener('keydown', (e) => {
      if (!this.isActive) return;

      switch (e.key) {
        case 'Delete':
        case 'Backspace':
          this.deleteSelected();
          break;
        case 'Escape':
          this.deselectObject();
          break;
        case 'd':
        case 'D':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.duplicateSelected();
          }
          break;
        case 'g':
        case 'G':
          this.snapToGrid = !this.snapToGrid;
          console.log(`Grid snap: ${this.snapToGrid ? 'ON' : 'OFF'}`);
          break;
        case 's':
        case 'S':
          if (e.ctrlKey || e.metaKey) {
            e.preventDefault();
            this.saveRoom();
          }
          break;
      }
    });
  }

  enableCreatorControls() {
    // Enable object selection and manipulation
    this.scene.onPointerObservable.add((pointerInfo) => {
      if (!this.isActive) return;

      switch (pointerInfo.type) {
        case 1: // POINTERDOWN
          this.handleObjectClick(pointerInfo);
          break;
        case 4: // POINTERMOVE
          this.handleObjectDrag(pointerInfo);
          break;
        case 2: // POINTERUP
          this.handleDragEnd();
          break;
      }
    });
  }

  async loadPrefab(prefabName, position = new Vector3(0, 0, 0)) {
    console.log(`📦 Loading prefab: ${prefabName}`);

    try {
      const prefabPath = `/src/assets/prefabs/${prefabName}.glb`;
      const result = await SceneLoader.ImportMeshAsync(
        '',
        '',
        prefabPath,
        this.scene
      );

      const rootMesh = result.meshes[0];
      rootMesh.position = this.snapToGrid ? this.snapPosition(position) : position;
      
      // Make prefab interactable
      rootMesh.metadata = {
        isPrefab: true,
        prefabName: prefabName,
        createdAt: Date.now()
      };

      // Register for interaction
      this.interactionManager.registerInteractable(rootMesh, {
        grabbable: true,
        onInteract: () => this.selectObject(rootMesh),
        onGrab: () => console.log('Grabbed:', prefabName),
        onRelease: () => console.log('Released:', prefabName)
      });

      this.placedObjects.push(rootMesh);
      
      console.log(`✅ Prefab placed: ${prefabName}`);
      return rootMesh;

    } catch (error) {
      console.error(`Failed to load prefab ${prefabName}:`, error);
      return null;
    }
  }

  selectObject(mesh) {
    // Deselect previous
    this.deselectObject();

    this.selectedObject = mesh;
    
    // Highlight selected object
    this.highlightLayer.addMesh(mesh, Color3.Cyan());
    
    console.log('🎯 Selected:', mesh.name);
    
    // Dispatch selection event
    window.dispatchEvent(new CustomEvent('object-selected', {
      detail: { mesh }
    }));
  }

  deselectObject() {
    if (this.selectedObject) {
      this.highlightLayer.removeMesh(this.selectedObject);
      this.selectedObject = null;
      
      window.dispatchEvent(new CustomEvent('object-deselected'));
    }
  }

  handleObjectClick(pointerInfo) {
    const pickInfo = pointerInfo.pickInfo;
    
    if (pickInfo.hit && pickInfo.pickedMesh) {
      const mesh = pickInfo.pickedMesh;
      
      // Check if it's a placed object
      if (mesh.metadata && mesh.metadata.isPrefab) {
        this.selectObject(mesh);
      }
    } else {
      this.deselectObject();
    }
  }

  handleObjectDrag(pointerInfo) {
    if (!this.selectedObject) return;

    const pickInfo = pointerInfo.pickInfo;
    if (pickInfo.hit) {
      const newPosition = pickInfo.pickedPoint;
      this.selectedObject.position = this.snapToGrid 
        ? this.snapPosition(newPosition)
        : newPosition;
    }
  }

  handleDragEnd() {
    // Object placement complete
  }

  duplicateSelected() {
    if (!this.selectedObject) return;

    const prefabName = this.selectedObject.metadata.prefabName;
    const offset = new Vector3(1, 0, 0);
    const newPosition = this.selectedObject.position.add(offset);

    this.loadPrefab(prefabName, newPosition);
    
    console.log('📋 Duplicated:', prefabName);
  }

  deleteSelected() {
    if (!this.selectedObject) return;

    const index = this.placedObjects.indexOf(this.selectedObject);
    if (index > -1) {
      this.placedObjects.splice(index, 1);
    }

    this.selectedObject.dispose();
    this.selectedObject = null;
    
    console.log('🗑️ Deleted object');
  }

  rotateSelected(axis, angle) {
    if (!this.selectedObject) return;

    switch (axis) {
      case 'x':
        this.selectedObject.rotation.x += angle;
        break;
      case 'y':
        this.selectedObject.rotation.y += angle;
        break;
      case 'z':
        this.selectedObject.rotation.z += angle;
        break;
    }
  }

  scaleSelected(factor) {
    if (!this.selectedObject) return;

    const newScale = this.selectedObject.scaling.scale(factor);
    this.selectedObject.scaling = newScale;
  }

  snapPosition(position) {
    return new Vector3(
      Math.round(position.x / this.gridSize) * this.gridSize,
      Math.round(position.y / this.gridSize) * this.gridSize,
      Math.round(position.z / this.gridSize) * this.gridSize
    );
  }

  showGrid() {
    // Create grid helper (visual guide)
    // Implementation depends on how you want to visualize the grid
    console.log('📐 Grid visible');
  }

  hideGrid() {
    console.log('📐 Grid hidden');
  }

  async saveRoom() {
    console.log('💾 Saving room layout...');

    const roomData = {
      name: prompt('Room name:') || 'Custom Room',
      objects: this.placedObjects.map(obj => ({
        prefabName: obj.metadata.prefabName,
        position: {
          x: obj.position.x,
          y: obj.position.y,
          z: obj.position.z
        },
        rotation: {
          x: obj.rotation.x,
          y: obj.rotation.y,
          z: obj.rotation.z
        },
        scaling: {
          x: obj.scaling.x,
          y: obj.scaling.y,
          z: obj.scaling.z
        }
      })),
      createdAt: new Date().toISOString()
    };

    // Save to local storage or database
    const roomJson = JSON.stringify(roomData, null, 2);
    
    // Option 1: Download as JSON
    this.downloadJSON(roomData.name, roomJson);
    
    // Option 2: Save to database (if Supabase available)
    // await this.saveToDatabase(roomData);

    console.log('✅ Room saved successfully');
    
    return roomData;
  }

  async loadRoom(roomData) {
    console.log('📂 Loading room layout...');

    // Clear existing objects
    this.clearAll();

    // Load each object
    for (const objData of roomData.objects) {
      const mesh = await this.loadPrefab(
        objData.prefabName,
        new Vector3(objData.position.x, objData.position.y, objData.position.z)
      );

      if (mesh) {
        mesh.rotation = new Vector3(
          objData.rotation.x,
          objData.rotation.y,
          objData.rotation.z
        );
        mesh.scaling = new Vector3(
          objData.scaling.x,
          objData.scaling.y,
          objData.scaling.z
        );
      }
    }

    console.log('✅ Room loaded successfully');
  }

  clearAll() {
    this.placedObjects.forEach(obj => obj.dispose());
    this.placedObjects = [];
    this.deselectObject();
    console.log('🧹 All objects cleared');
  }

  downloadJSON(filename, jsonString) {
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  getPlacedObjectsCount() {
    return this.placedObjects.length;
  }

  exportToJSON() {
    return this.saveRoom();
  }

  dispose() {
    this.clearAll();
    
    if (this.highlightLayer) {
      this.highlightLayer.dispose();
    }

    console.log('Creator Mode disposed');
  }
}

export default CreatorMode;
