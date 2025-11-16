#!/bin/bash

# Build and Deploy Script for Modularity Spatial OS - Native iOS App
# This automates the entire build process from web app to Xcode

set -e

echo "🔮 Modularity Spatial OS - Native iOS Build"
echo "==========================================="
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Step 1: Install dependencies
echo -e "${BLUE}📦 Step 1: Installing dependencies...${NC}"
npm install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Step 2: Copy web app
echo -e "${BLUE}📋 Step 2: Copying web app to www/...${NC}"
rm -rf www/*
cp -r ../modularity-engine/* www/
echo -e "${GREEN}✅ Web app copied${NC}"
echo ""

# Step 3: Add AR/VR JavaScript APIs
echo -e "${BLUE}🎮 Step 3: Injecting AR/VR JavaScript APIs...${NC}"
if [ ! -f "www/index.html" ]; then
    echo -e "${YELLOW}⚠️  index.html not found in www/. Did the copy fail?${NC}"
    exit 1
fi

# Inject ar.js and vr.js before closing </body> tag
sed -i '' 's|</body>|<script src="src/ar.js"></script>\n<script src="src/vr.js"></script>\n</body>|' www/index.html

# Copy JS API files
mkdir -p www/src
cp src/ar.js www/src/
cp src/vr.js www/src/

echo -e "${GREEN}✅ AR/VR APIs injected${NC}"
echo ""

# Step 4: Sync with Capacitor
echo -e "${BLUE}🔄 Step 4: Syncing with Capacitor iOS...${NC}"
npx cap sync ios
echo -e "${GREEN}✅ Capacitor synced${NC}"
echo ""

# Step 5: Open Xcode
echo -e "${BLUE}🚀 Step 5: Opening Xcode...${NC}"
npx cap open ios
echo ""

echo -e "${GREEN}==========================================="
echo -e "✅ Build complete!"
echo -e "==========================================="
echo -e "${YELLOW}"
echo "Next steps in Xcode:"
echo "1. Select your iPhone from the device dropdown"
echo "2. Click Run ▶ to build and install"
echo "3. Trust the app on your iPhone (Settings → General → VPN & Device Management)"
echo "4. Launch Modularity Spatial OS!"
echo ""
echo "AR Commands:"
echo "  AR.enter()           - Enter AR mode"
echo "  AR.placeModel('sanctuary.glb') - Place model"
echo ""
echo "VR Commands:"
echo "  VR.enter()           - Enter VR mode"
echo "  VR.exit()            - Exit VR mode"
echo -e "${NC}"
