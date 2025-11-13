#!/usr/bin/env node

const { execSync } = require('child_process');

console.log('🚀 AMENITY PLATFORM - Quick Start');
console.log('═════════════════════════════════');

try {
  console.log('🌐 Starting Amenity Web Platform...');
  execSync('npm run dev', { stdio: 'inherit', cwd: __dirname + '/..' });
} catch (error) {
  console.error('❌ Error starting platform:', error.message);
  console.log('\n💡 Try running: amenity install');
  console.log('   Then: amenity start');
}