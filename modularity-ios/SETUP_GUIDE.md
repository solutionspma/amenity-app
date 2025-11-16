# 🔮 Modularity Spatial OS - Native iOS Setup Guide

## Quick Start (5 Steps)

### 1. Install Dependencies

```bash
cd modularity-ios
npm install
```

### 2. Run Build Script

```bash
chmod +x build.sh
./build.sh
```

This will:
- Copy your web app from `modularity-engine/`
- Inject AR/VR JavaScript APIs
- Sync with Capacitor
- Open Xcode

### 3. Add Swift Files in Xcode

After Xcode opens:

1. **Right-click** on the `App` folder (blue icon)
2. Select **New File... → Swift File**
3. Create these 4 files:
   - `ARViewController.swift`
   - `ARBridge.swift`
   - `VRViewController.swift`
   - `VRBridge.swift`

4. **Copy the code** from:
   - `ios/App/App/ARViewController.swift` (already created)
   - `ios/App/App/ARBridge.swift`
   - `ios/App/App/VRViewController.swift`
   - `ios/App/App/VRBridge.swift`

### 4. Register Plugins in AppDelegate

Open `AppDelegate.swift` and add to the `applicationDidFinishLaunching` method:

```swift
import Capacitor

class AppDelegate: UIResponder, UIApplicationDelegate {
    
    var window: UIWindow?
    
    func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {
        
        // Register AR/VR plugins
        let bridge = self.window?.rootViewController as? CAPBridgeViewController
        bridge?.registerPlugin(ARBridge.self)
        bridge?.registerPlugin(VRBridge.self)
        
        return true
    }
}
```

### 5. Build & Run

1. Connect your iPhone via USB
2. Select it from the device dropdown (top bar)
3. Click **Run ▶**
4. Enter your Apple ID for signing if prompted
5. On your iPhone: **Settings → General → VPN & Device Management → Trust app**

---

## Usage in Your Web App

### AR Mode

```javascript
// Check if available
if (AR.isAvailable()) {
    // Enter AR
    await AR.enter();
    
    // Place models
    await AR.placeModel('sanctuary.glb');
    await AR.placeSanctuary();
    await AR.placeStudioComplex();
    
    // Clear models
    await AR.clearModels();
    
    // Exit AR
    await AR.exit();
}
```

### VR Mode

```javascript
// Check if available
if (VR.isAvailable()) {
    // Enter VR
    await VR.enter();
    
    // Load world
    await VR.loadWorld({ scene: 'sanctuary' });
    
    // Get head orientation
    const orientation = await VR.getOrientation();
    console.log(orientation.pitch, orientation.yaw, orientation.roll);
    
    // Exit VR
    await VR.exit();
}
```

---

## Adding Models

Place your GLB/USDZ files in:

```
ios/App/App/Resources/
```

Then reference them by filename:

```javascript
AR.placeModel('my-model.glb');
```

---

## Troubleshooting

### "Command not found: npx"

Install Node.js from nodejs.org

### "Module 'Capacitor' not found"

Run `npx cap sync ios`

### "Signing for 'App' requires a development team"

In Xcode:
1. Click on the project name (blue icon)
2. Select your target
3. Signing & Capabilities tab
4. Select your Apple ID under Team

### "This app cannot be installed"

On your iPhone:
Settings → General → VPN & Device Management → Trust your developer certificate

### AR not working

- Device must support ARKit (iPhone 6s or newer)
- Camera permission must be granted
- Check `Info.plist` has `NSCameraUsageDescription`

### Web app not loading

Run `npm run copy-web` to sync latest files from `modularity-engine/`

---

## Development Workflow

1. Edit your web app in `modularity-engine/`
2. Run `npm run copy-web` to sync
3. Run `npx cap sync ios`
4. Hit **Run ▶** in Xcode

Or use the combined script:

```bash
./build.sh
```

---

## Next Steps

### Export 3D Models from Babylon.js

Use `BABYLON.GLTF2Export` to export your procedural church rooms:

```javascript
BABYLON.GLTF2Export.GLBAsync(scene, "sanctuary").then((glb) => {
    glb.downloadFiles();
});
```

### Add AR Buttons to UI

In `index.html`:

```html
<button onclick="AR.enter()">📱 Enter AR</button>
<button onclick="AR.placeSanctuary()">⛪ Place Sanctuary</button>
<button onclick="VR.enter()">🥽 Enter VR</button>
```

### Enable Spatial Audio

In VRViewController, add audio sources:

```swift
let audioSource = SCNAudioSource(fileNamed: "ambient.mp3")!
audioSource.loops = true
audioSource.isPositional = true
let audioPlayer = SCNAudioPlayer(source: audioSource)
node.addAudioPlayer(audioPlayer)
```

---

## Publishing to App Store

1. **Register** as Apple Developer ($99/year)
2. **Create App ID** in App Store Connect
3. **Configure signing** in Xcode
4. **Archive** your app (Product → Archive)
5. **Upload to App Store** via Organizer
6. **Submit for review**

---

Built with ❤️ by Pitch Marketing Agency  
Faith-based AR/VR for the next generation 🙏
