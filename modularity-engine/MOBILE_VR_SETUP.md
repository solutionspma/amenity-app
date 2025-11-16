# 📱 Mobile VR Testing Guide for Modularity Spatial OS

## How to Test VR on Your Phone (No Headset Needed!)

### Option 1: WebXR Device API Emulator (Easiest)
1. **On Desktop Chrome:**
   - Install [WebXR API Emulator extension](https://chrome.google.com/webstore/detail/webxr-api-emulator/mjddjgeghkdijejnciaefnkjmkafnnje)
   - Open DevTools (F12)
   - Go to "WebXR" tab
   - Select device: "Google Cardboard" or "Oculus Quest"
   - Click "Enter VR" button in Modularity
   - Use keyboard to simulate head movement

### Option 2: Phone + Google Cardboard (Immersive!)
1. **Get a Cardboard viewer** (~$10-15 on Amazon)
2. **On your phone:**
   - Open Chrome browser
   - Visit: `https://192.168.0.161:3001` (your local network IP)
   - Accept the security certificate warning
   - Click "Enter VR" button
   - Put phone in Cardboard viewer
   - Move your head to look around!

### Option 3: Phone Only (No Viewer)
1. **On your phone browser:**
   - Chrome: Visit your local IP
   - Click "Enter VR" button
   - Phone will enter stereo mode (split screen)
   - Move phone to look around (gyroscope)
   - Works without Cardboard, just less immersive

### Option 4: AR Mode Testing
1. **On phone (Android with ARCore or iPhone with ARKit):**
   - Click "Enter AR" button
   - Point camera at floor
   - Tap to place portal
   - Walk through to enter room!

---

## Current Setup

Your Vite server is already broadcasting on:
- **Local**: https://localhost:3001
- **Network**: https://192.168.0.161:3001 ← Use this on phone!

### Testing Steps:
1. Make sure phone is on same WiFi as your Mac
2. On phone, open Chrome
3. Go to: `https://192.168.0.161:3001`
4. Accept certificate warning (click "Advanced" → "Proceed")
5. Click "🚀 Click to Start"
6. Click "🥽 Enter VR"

---

## What You'll Experience

### VR Mode (Stereo)
- Split-screen view (left/right eye)
- Head tracking with phone gyroscope
- Can look around cathedral/rooms
- Works in any room (Sanctuary, Prayer Circle, Youth, etc.)

### AR Mode (Portal)
- Real world camera view
- Tap floor to spawn portal
- Portal opens to virtual room
- Walk around portal in real space

---

## Troubleshooting

**"Not Secure" Warning on Phone:**
- This is normal for self-signed HTTPS cert
- Click "Advanced" → "Proceed anyway"

**VR Button Says "Not Supported":**
- Make sure using HTTPS (not HTTP)
- Try Chrome browser (best WebXR support)
- Enable "WebXR" in chrome://flags

**Black Screen in VR:**
- Tap screen once to wake
- Check if audio unlocked
- Reload page

**Phone Won't Connect:**
- Confirm same WiFi network
- Try IP: 192.168.0.153 (alternate network interface)
- Check Mac firewall isn't blocking port 3001

---

## Next Level: Actual VR Headset Testing

When ready to test on real hardware:

### Meta Quest 2/3/Pro
1. Enable Developer Mode
2. Open Quest Browser
3. Visit your network IP
4. Full 6DOF VR with controllers!

### Apple Vision Pro
1. Open Safari
2. Visit network IP
3. Spatial computing mode

### PICO 4
1. Use PICO Browser
2. Same process as Quest

---

## 🔥 Pro Tip: Remote Testing

Want friends/church members to test from anywhere?

1. Deploy to Netlify (free):
   ```bash
   npm run build
   netlify deploy
   ```

2. Share the URL - works on ANY phone worldwide

3. They can test VR/AR from home!

---

**You're ready to experience Modularity in VR on your phone! 🚀**
