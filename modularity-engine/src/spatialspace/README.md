# SpatialSpace Unified Engine

**Version:** 3.0 - "The Atomic Edition"  
**Architecture:** Pittman Directive - Unified AR/VR/Multiplayer Engine

---

## 🌐 Overview

SpatialSpace is a **unified 3D engine architecture** that combines:
- **Babylon.js** (Faith-based church worlds)
- **Three.js** (Professional studio environments)
- **VR/AR Systems** (Native iOS + JavaScript)
- **Multiplayer** (WebSocket real-time sync)
- **Avatar IK** (Full-body inverse kinematics)
- **Unified Controls** (Desktop, Mobile, VR, AR)

All under **one master engine** using the **adapter pattern** to normalize rendering APIs.

---

## 📁 Architecture

```
src/spatialspace/
├── core/                      # Core engine systems
│   ├── EngineCore.js         # Master engine controller
│   ├── RenderRegistry.js     # Babylon + Three.js adapter registry
│   ├── ControlCore.js        # Unified input (keyboard, mouse, touch, gamepad)
│   ├── InteractionCore.js    # VR interaction wrapper
│   ├── ARCore.js             # Unified AR (native ARKit + web Quick Look)
│   ├── VRCore.js             # Unified VR (native VRKit + JS VR)
│   ├── MultiplayerCore.js    # Global WebSocket multiplayer
│   ├── AvatarCore.js         # Avatar management (local + network)
│   └── SceneRouter.js        # Module switching system
│
├── renderers/                 # Rendering engine adapters
│   ├── babylonAdapter.js     # Babylon.js adapter
│   └── threeAdapter.js       # Three.js adapter
│
├── modules/                   # World/scene modules
│   ├── modularityOS/         # Faith-based church worlds (Babylon.js)
│   │   └── modularityOS.js
│   └── studioComplex/        # Professional studios (Three.js)
│       └── studioComplex.js
│
└── index.js                   # Engine initialization
```

---

## 🚀 Quick Start

### 1. Initialize SpatialSpace Engine

```javascript
import { initSpatialSpace, loadDefaultModule } from './src/spatialspace/index.js';

// Initialize engine and subsystems
const engine = initSpatialSpace();

// Load default module (ModularityOS church)
loadDefaultModule();
```

### 2. Switch Between Modules

```javascript
// Switch to church worlds (Babylon.js)
window.switchSpatialModule('modularityOS');

// Switch to professional studios (Three.js)
window.switchSpatialModule('studioComplex');
```

### 3. Access Global Engine

```javascript
// Global singleton instance
const engine = window.SpatialSpace;

// Access subsystems
engine.ar.placeModel('models/cross.usdz');
engine.vr.enterNativeVR();
engine.multi.connect('ws://localhost:8080');
engine.avatar.createLocalAvatar(scene);
```

---

## 🎮 Subsystems

### EngineCore
Master controller that manages:
- Renderer (Babylon.js or Three.js)
- Scene and camera
- All subsystems (AR, VR, multiplayer, avatar, controls)
- Main update loop

```javascript
const engine = window.SpatialSpace;
engine.loadScene(sceneConfig);
engine.update(deltaTime);
engine.startRenderLoop();
```

### RenderRegistry
Maps rendering engines to adapters:
- `babylon` → BabylonAdapter
- `three` → ThreeAdapter

```javascript
const adapter = engine.registry.get('babylon');
const renderer = adapter.createRenderer();
const scene = adapter.createScene();
const camera = adapter.createCamera();
```

### ControlCore
Unified input handling:
- Keyboard (WASD, arrows, custom keys)
- Mouse (position, buttons)
- Touch (multi-touch, gestures)
- Gamepad (axes, buttons)

```javascript
if (engine.controls.isKeyPressed('w')) {
  camera.position.z -= 0.1;
}
```

### ARCore
Unified AR system:
- **Native ARKit** (iOS Capacitor app)
- **AR Quick Look** (Web fallback)

```javascript
// Auto-detect native or web AR
engine.ar.placeModel('models/sanctuary.usdz');

// Force native ARKit
engine.ar.enterNativeAR('sanctuary.usdz');

// Force web Quick Look
engine.ar.enterQuickLook('sanctuary.glb');
```

### VRCore
Unified VR system:
- **Native VRKit** (iOS Capacitor app)
- **JavaScript VR** (Three.js VR interaction pack)

```javascript
// Native VR
engine.vr.enterNativeVR();

// JS VR (Three.js only)
engine.vr.initJSVR(scene, camera);
```

### MultiplayerCore
Global WebSocket multiplayer:
- Auto-reconnect
- Player join/leave events
- Position synchronization

```javascript
// Connect to server
engine.multi.connect('ws://localhost:8080');

// Send position updates
engine.multi.sendPosition(position, rotation);

// Get all players
const players = engine.multi.players;
```

### AvatarCore
Avatar management:
- **Local avatar** with full-body IK
- **Network avatars** for remote players

```javascript
// Create local avatar
const avatar = engine.avatar.createLocalAvatar(scene);

// Create network avatar
engine.avatar.createNetworkAvatar('player123', scene, 'John');

// Update from multiplayer
engine.avatar.updateNetworkAvatar('player123', position, rotation);
```

### SceneRouter
Module switching system:

```javascript
// Register module
engine.router.register('myModule', moduleConfig);

// Load module
engine.router.load('myModule');

// List all modules
const modules = engine.router.listModules();
```

---

## 📦 Modules

### ModularityOS (Babylon.js)
**Faith-based church worlds**

- 8 procedural rooms (Sanctuary, Chapel, Fellowship, etc.)
- God rays, particles, neon lights, glow layers
- Existing `SceneManager` integration

```javascript
const church = engine.router.load('modularityOS');
church.switchRoom('sanctuary');
```

### StudioComplex (Three.js)
**Professional studio environments**

- Recording studio, TV studio, hallway
- VR interaction enabled
- Existing `StudioScene` integration

```javascript
const studio = engine.router.load('studioComplex');
studio.switchStudio('recording');
```

---

## 🔌 Integration with Existing Code

### Babylon.js (Church)
The existing `sceneManager.js` is **wrapped** by `ModularityOS` module:

```javascript
// Before (direct Babylon.js)
const sceneManager = new SceneManager(scene, camera);
sceneManager.loadRoom('sanctuary');

// After (SpatialSpace)
const engine = initSpatialSpace();
engine.switchModule('modularityOS');
engine.currentModule.switchRoom('sanctuary');
```

### Three.js (Studio)
The existing `studioScene.js` is **wrapped** by `StudioComplex` module:

```javascript
// Before (direct Three.js)
const studio = new StudioScene(scene, camera);
studio.init();

// After (SpatialSpace)
const engine = initSpatialSpace();
engine.switchModule('studioComplex');
```

---

## 🎯 Usage Examples

### Example 1: Church VR with Multiplayer

```javascript
const engine = initSpatialSpace();

// Load church
engine.switchModule('modularityOS');

// Enable VR
engine.vr.enterNativeVR();

// Connect multiplayer
engine.multi.connect('ws://localhost:8080');

// Create avatar
engine.avatar.createLocalAvatar(engine.scene);

// Start render loop
engine.startRenderLoop();
```

### Example 2: Studio AR with Camera

```javascript
const engine = initSpatialSpace();

// Load studio
engine.switchModule('studioComplex');

// Place AR microphone
engine.ar.placeModel('models/microphone.usdz');

// Enable VR interactions
engine.vr.initJSVR(engine.scene, engine.camera);
```

### Example 3: Switch Between Worlds

```javascript
const engine = initSpatialSpace();

// Start in church
engine.switchModule('modularityOS');

// Switch to studio after 10 seconds
setTimeout(() => {
  engine.switchModule('studioComplex');
}, 10000);
```

---

## 🛠️ Development Workflow

1. **Create Module**: Define `init()`, `update()`, `dispose()` methods
2. **Register Module**: `engine.router.register('myModule', config)`
3. **Load Module**: `engine.switchModule('myModule')`
4. **Test**: Render loop auto-updates all subsystems

---

## 📊 Performance

- **Delta Time**: Auto-calculated in `EngineCore.update()`
- **Render Loop**: Single `requestAnimationFrame` for all systems
- **Disposal**: Proper cleanup when switching modules
- **Auto-Resize**: Window resize handled by adapters

---

## 🔒 Error Handling

All subsystems include error checking:
- Missing dependencies (Babylon.js, Three.js)
- Invalid modules
- Renderer mismatches (VR only on Three.js)
- Network errors (auto-reconnect)

---

## 🌟 Key Features

✅ **Dual-Engine**: Babylon.js + Three.js in one system  
✅ **Adapter Pattern**: Normalized API across renderers  
✅ **Module Router**: Hot-swap between worlds  
✅ **Unified Controls**: Desktop, mobile, VR, AR  
✅ **Global Multiplayer**: WebSocket sync  
✅ **Avatar IK**: Full-body inverse kinematics  
✅ **Native iOS**: ARKit + VRKit bridges  
✅ **Backward Compatible**: Wraps existing implementations  

---

## 📝 Next Steps

1. ✅ Core engine files created
2. ✅ Adapters for Babylon.js and Three.js
3. ✅ Module configurations (ModularityOS, StudioComplex)
4. 🔄 Update `index.html` to use SpatialSpace
5. 🔄 Test module switching
6. 🔄 Test multiplayer sync
7. 🔄 Test VR/AR integration
8. 🔄 Add more modules (CreatorMode, DesignSpace, etc.)

---

## 📚 Resources

- [Babylon.js Docs](https://doc.babylonjs.com/)
- [Three.js Docs](https://threejs.org/docs/)
- [WebXR API](https://developer.mozilla.org/en-US/docs/Web/API/WebXR_Device_API)
- [Capacitor ARKit](https://capacitorjs.com/)

---

**Built with ❤️ for Modularity Spatial OS v3.0**
