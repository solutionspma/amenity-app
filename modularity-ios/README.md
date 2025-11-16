# 🔮 Modularity Spatial OS - Native iOS Edition

**The Atomic Edition** - Faith-Based AR/VR Platform with Native ARKit/VRKit

---

## 🎯 What This Is

This is the **native iOS wrapper** for **Modularity Spatial OS v3.0**, transforming your browser-based AR/VR platform into a **full-fledged iPhone/iPad app** with:

### ✅ Full ARKit Integration
- 🌍 **6-DoF spatial tracking** (move freely in 3D space)
- 📐 **Plane detection** (horizontal & vertical surfaces)
- 📡 **LiDAR depth sensing** (iPhone 12 Pro+)
- 💡 **Real-time lighting** estimation
- 🎯 **Object anchoring** in real space
- ⚡ **60fps AR rendering**

### ✅ Full VRKit Integration
- 👁️ **Stereoscopic dual-eye rendering**
- 🔄 **Gyroscope head tracking** (CoreMotion sensor fusion)
- 📹 **True VR camera rig**
- 🎮 **Smooth 60fps VR mode**

### ✅ No Browser Limitations
- 🚫 **Bypass WebXR errors** completely
- 📸 **Full camera permissions**
- 🚀 **Native performance**
- 🔗 **Deep ARKit/VRKit integration**

---

## 📁 Project Structure

```
modularity-ios/
├── README.md                   # You are here
├── SETUP_GUIDE.md              # Step-by-step setup instructions
├── build.sh                    # Automated build script
├── package.json                # npm dependencies
├── capacitor.config.json       # Capacitor iOS config
│
├── ios/                        # Xcode project (auto-generated)
│   └── App/
│       └── App/
│           ├── Info.plist               # iOS permissions
│           ├── ARViewController.swift   # ARKit controller
│           ├── ARBridge.swift           # JS ↔ Swift AR bridge
│           ├── VRViewController.swift   # VRKit controller
│           └── VRBridge.swift           # JS ↔ Swift VR bridge
│
├── src/                        # JavaScript APIs
│   ├── ar.js                   # AR API wrapper
│   └── vr.js                   # VR API wrapper
│
└── www/                        # Your web app (copied from modularity-engine/)
    ├── index.html
    ├── src/
    └── ...
```

---

## 🚀 Quick Start

### Option 1: Automated Build (Recommended)

```bash
cd modularity-ios
./build.sh
```

This will:
1. Install dependencies
2. Copy your web app from `modularity-engine/`
3. Inject AR/VR JavaScript APIs
4. Sync with Capacitor
5. Open Xcode

Then in Xcode:
1. Connect your iPhone via USB
2. Select it from the device dropdown
3. Click **Run ▶**

### Option 2: Manual Setup

See **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** for detailed step-by-step instructions.

---

## 🎮 JavaScript API Usage

### AR Mode

```javascript
// Enter AR
await AR.enter();

// Place models
await AR.placeModel('sanctuary.glb');
await AR.placeModel('studio-complex.glb');

// Shortcuts
await AR.placeSanctuary();
await AR.placeStudioComplex();

// Clear all models
await AR.clearModels();

// Exit AR
await AR.exit();
```

### VR Mode

```javascript
// Enter VR
await VR.enter();

// Load world data
await VR.loadWorld({
    scene: 'sanctuary',
    spawnPoint: { x: 0, y: 1.6, z: -10 }
});

// Get head orientation
const orientation = await VR.getOrientation();
console.log(orientation.pitch, orientation.yaw, orientation.roll);

// Exit VR
await VR.exit();
```

### Availability Check

```javascript
if (AR.isAvailable()) {
    console.log('Native AR available!');
}

if (VR.isAvailable()) {
    console.log('Native VR available!');
}
```

---

## 🏗️ Architecture

### How It Works

1. **Capacitor** wraps your web app in a native iOS shell
2. **WKWebView** renders your HTML/CSS/JavaScript
3. **Swift Bridges** expose ARKit/VRKit to JavaScript
4. **JavaScript APIs** provide clean interface for AR/VR commands
5. **Your Web App** runs unmodified with native AR/VR superpowers

```
┌─────────────────────────────────────┐
│  Your Web App (HTML/CSS/JS)        │
│  ├── Babylon.js (Church Spaces)    │
│  ├── Three.js (Studio Complex)     │
│  └── AR/VR JavaScript APIs          │
└─────────────────┬───────────────────┘
                  │
          ┌───────▼────────┐
          │  Capacitor     │
          │  (Bridge)      │
          └───────┬────────┘
                  │
      ┌───────────┴───────────┐
      │                       │
┌─────▼──────┐       ┌────────▼─────┐
│  ARBridge  │       │   VRBridge   │
│  (Swift)   │       │   (Swift)    │
└─────┬──────┘       └────────┬─────┘
      │                       │
┌─────▼──────────┐   ┌────────▼───────────┐
│ ARViewController│   │ VRViewController   │
│ (ARKit/SceneKit)│   │ (SceneKit/CoreMotion)│
└─────────────────┘   └────────────────────┘
```

---

## 📦 What You Get

### Inputs
- ✅ Your existing `modularity-engine/` web app
- ✅ Babylon.js church spaces (8 rooms)
- ✅ Three.js studio complex (3 scenes)
- ✅ Mobile touch controls
- ✅ Advanced gestures

### Outputs
- ✅ **Native iOS app** (runs on iPhone/iPad)
- ✅ **ARKit integration** (place 3D objects in real space)
- ✅ **VRKit integration** (immersive VR with head tracking)
- ✅ **App Store ready** (publish to millions of users)
- ✅ **No Safari limitations** (full native performance)

---

## 🎯 Use Cases

### Faith-Based AR
- Drop **entire church sanctuaries** in your living room
- Place **prayer circles** in real space
- Walk through **youth rooms** in AR
- Anchor **Bible study spaces** to physical locations

### Professional Studios
- Position **recording studios** in your space
- Place **TV studio sets** in your office
- Preview **studio layouts** before building

### Multiplayer (Future)
- See other users' avatars in AR
- Shared AR experiences
- Real-time collaboration in VR

---

## 🛠️ Development Workflow

### Daily Development

1. Edit your web app in `modularity-engine/`
2. Test in browser at `https://localhost:3002`
3. When ready for native testing:

```bash
cd modularity-ios
npm run copy-web      # Copy latest web app
npx cap sync ios      # Sync to Xcode
npx cap open ios      # Open Xcode
```

4. Click **Run ▶** in Xcode

### Combined Command

```bash
npm run build
```

Or use the automated script:

```bash
./build.sh
```

---

## 📱 Device Requirements

### Minimum
- **iPhone 6s** or newer
- **iOS 11** or later
- **ARKit support** (A9 chip+)

### Recommended
- **iPhone 12 Pro** or newer (LiDAR)
- **iOS 15** or later
- **5GB free storage**

### VR
- Any iPhone with **gyroscope** (all models since iPhone 4)

---

## 🔐 Permissions

The app requests these permissions (configured in `Info.plist`):

- **📸 Camera** - For AR experiences
- **📳 Motion & Orientation** - For VR head tracking  
- **🎙️ Microphone** - For future voice chat
- **📷 Photo Library** - To save AR/VR captures
- **📍 Location** - For location-based AR (optional)
- **📡 Bluetooth** - For controllers/multiplayer (optional)

---

## 🚢 Publishing to App Store

1. **Apple Developer Account** ($99/year)
2. **Create App ID** in App Store Connect
3. **Configure signing** in Xcode
4. **Archive** (Product → Archive)
5. **Upload** via Organizer
6. **Submit for review**

Estimated review time: 24-48 hours

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup instructions
- **[src/ar.js](./src/ar.js)** - AR API documentation
- **[src/vr.js](./src/vr.js)** - VR API documentation
- **[Capacitor Docs](https://capacitorjs.com/docs)** - Capacitor reference
- **[ARKit Docs](https://developer.apple.com/arkit/)** - Apple ARKit reference

---

## 🐛 Troubleshooting

### Build Issues

**"Command not found: npx"**
```bash
# Install Node.js from nodejs.org
brew install node
```

**"Module 'Capacitor' not found"**
```bash
npx cap sync ios
```

### Xcode Issues

**"Signing requires a development team"**
1. Click project name (blue icon)
2. Select target
3. Signing & Capabilities tab
4. Choose your Apple ID under Team

**"This app cannot be installed"**
1. On iPhone: Settings → General → VPN & Device Management
2. Trust your developer certificate

### Runtime Issues

**AR not working**
- Device must support ARKit (iPhone 6s+)
- Grant camera permission when prompted
- Check `Info.plist` has `NSCameraUsageDescription`

**VR head tracking not working**
- Grant motion permission when prompted
- Try calibrating by looking straight ahead

**Web app not loading**
```bash
npm run copy-web
npx cap sync ios
```

---

## 🎯 Next Steps

1. **Run the build** - `./build.sh`
2. **Test AR mode** - `AR.enter()` on your iPhone
3. **Test VR mode** - `VR.enter()` on your iPhone
4. **Export 3D models** - Convert Babylon scenes to GLB/USDZ
5. **Add AR buttons** - Integrate AR calls into your UI
6. **Publish** - Submit to App Store

---

## 🤝 Support

Built with ❤️ by **Pitch Marketing Agency**

Faith-based AR/VR for the next generation 🙏

---

## 📄 License

© 2025 Pitch Marketing Agency. All rights reserved.
