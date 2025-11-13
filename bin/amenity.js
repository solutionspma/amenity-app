#!/usr/bin/env node

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('🚀 Welcome to the AMENITY PLATFORM!');
console.log('The Ultimate Creator Economy - Meta + YouTube + TikTok + Patreon');
console.log('═══════════════════════════════════════════════════════════════');

const command = process.argv[2];

switch (command) {
  case 'start':
  case 'dev':
    console.log('🌐 Starting Amenity Web Platform...');
    try {
      execSync('npm run dev', { stdio: 'inherit', cwd: __dirname + '/..' });
    } catch (error) {
      console.error('❌ Error starting web platform:', error.message);
    }
    break;
    
  case 'mobile':
    console.log('📱 Starting Amenity Mobile App...');
    try {
      execSync('npm run mobile', { stdio: 'inherit', cwd: __dirname + '/..' });
    } catch (error) {
      console.error('❌ Error starting mobile app:', error.message);
    }
    break;
    
  case 'build':
    console.log('🏗️  Building Amenity Platform...');
    try {
      execSync('npm run build-all', { stdio: 'inherit', cwd: __dirname + '/..' });
      console.log('✅ Build completed successfully!');
    } catch (error) {
      console.error('❌ Build failed:', error.message);
    }
    break;
    
  case 'install':
    console.log('📦 Installing Amenity dependencies...');
    try {
      execSync('npm run install-all', { stdio: 'inherit', cwd: __dirname + '/..' });
      console.log('✅ Dependencies installed successfully!');
    } catch (error) {
      console.error('❌ Installation failed:', error.message);
    }
    break;
    
  case 'info':
  case '--info':
    console.log(`
🎯 AMENITY PLATFORM INFO:
━━━━━━━━━━━━━━━━━━━━━━━━━━━

📊 Stats:
• 10,917 lines of code
• 40 source files  
• 13 mobile screens
• 20+ database tables
• 80-90% creator revenue share

🌟 Features:
• Complete social media platform
• Live streaming with chat
• Creator monetization suite
• JAY-I AI assistant
• Cross-platform (Web + Mobile)
• Ministry-focused features

🚀 Commands:
• amenity start     - Start web platform
• amenity mobile    - Start mobile app
• amenity build     - Build all platforms
• amenity install   - Install dependencies
• amenity info      - Show this info

🌐 Learn more: https://amenity-platform.com
    `);
    break;
    
  default:
    console.log(`
🎯 AMENITY PLATFORM - Creator Economy Revolution
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Usage: amenity <command>

Available commands:
  start       Start the web platform (development mode)  
  mobile      Start the mobile app development server
  build       Build production version of all platforms
  install     Install all dependencies
  info        Show platform information

Examples:
  amenity start       # Start web development server
  amenity mobile      # Start mobile app with Expo
  amenity build       # Build for production
  
🚀 The most comprehensive creator platform ever built!
80-90% revenue share • AI Assistant • Live Streaming • Mobile Apps
    `);
}