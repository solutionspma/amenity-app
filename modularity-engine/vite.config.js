import { defineConfig } from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  plugins: [
    basicSsl() // HTTPS required for WebXR
  ],
  server: {
    https: true,
    port: 3000,
    host: true,
    cors: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'babylon': ['@babylonjs/core', '@babylonjs/loaders', '@babylonjs/materials', '@babylonjs/gui'],
          'vendor': ['@supabase/supabase-js', 'tone', 'ethers']
        }
      }
    }
  },
  optimizeDeps: {
    include: [
      '@babylonjs/core',
      '@babylonjs/loaders',
      '@babylonjs/materials',
      '@babylonjs/gui',
      '@supabase/supabase-js',
      'tone',
      'ethers',
      'webxr-polyfill'
    ]
  },
  resolve: {
    alias: {
      '@': '/src',
      '@engine': '/src/engine',
      '@dashboard': '/src/dashboard',
      '@avatars': '/src/avatars',
      '@rooms': '/src/rooms',
      '@assets': '/src/assets',
      '@shaders': '/src/shaders',
      '@audio': '/src/audio'
    }
  }
});
