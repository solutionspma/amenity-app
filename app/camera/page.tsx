'use client';

import { useState, useRef, useCallback } from 'react';
import Link from 'next/link';
import AmenityHeader from '@/components/AmenityHeader';
import AmenityFooter from '@/components/AmenityFooter';
import { useBackdrop } from '@/contexts/BackdropContext';

interface MediaFile {
  id: string;
  file: File;
  type: 'image' | 'video';
  preview: string;
  duration?: number;
}

export default function CameraPage() {
  const { getBackdropStyle } = useBackdrop();
  const [isRecording, setIsRecording] = useState(false);
  const [mediaFiles, setMediaFiles] = useState<MediaFile[]>([]);
  const [selectedMode, setSelectedMode] = useState<'photo' | 'video' | 'live'>('photo');
  const [cameraFacing, setCameraFacing] = useState<'user' | 'environment'>('user');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    
    files.forEach(file => {
      const preview = URL.createObjectURL(file);
      const mediaFile: MediaFile = {
        id: Math.random().toString(36).substr(2, 9),
        file,
        type: file.type.startsWith('video/') ? 'video' : 'image',
        preview
      };
      
      setMediaFiles(prev => [...prev, mediaFile]);
    });
  }, []);

  const removeMedia = (id: string) => {
    setMediaFiles(prev => prev.filter(media => media.id !== id));
  };

  const startRecording = () => {
    setIsRecording(true);
    // Camera logic would go here
  };

  const stopRecording = () => {
    setIsRecording(false);
    // Stop recording logic would go here
  };

  const switchCamera = () => {
    setCameraFacing(prev => prev === 'user' ? 'environment' : 'user');
  };

  return (
    <div className="min-h-screen" style={getBackdropStyle('camera')}>
      <AmenityHeader currentPage="/camera" />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Create Content</h1>
          <p className="text-gray-300">
            Capture photos, record videos, or start a live stream to share your faith
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-1 border border-white/20">
            {[
              { id: 'photo', label: 'Photo', icon: '📷' },
              { id: 'video', label: 'Video', icon: '🎥' },
              { id: 'live', label: 'Go Live', icon: '🔴' }
            ].map((mode) => (
              <button
                key={mode.id}
                onClick={() => setSelectedMode(mode.id as any)}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${
                  selectedMode === mode.id
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`}
              >
                <span className="mr-2">{mode.icon}</span>
                {mode.label}
              </button>
            ))}
          </div>
        </div>

        {/* Camera View */}
        <div className="bg-black/50 backdrop-blur-sm rounded-2xl border border-white/20 overflow-hidden mb-8">
          <div className="aspect-video bg-gradient-to-br from-purple-900/20 to-pink-900/20 flex items-center justify-center relative">
            {/* Mock Camera View */}
            <div className="text-center">
              <div className="text-8xl mb-4">
                {selectedMode === 'photo' && '📷'}
                {selectedMode === 'video' && '🎥'}
                {selectedMode === 'live' && '🔴'}
              </div>
              <p className="text-white text-lg mb-4">
                {selectedMode === 'photo' && 'Ready to capture photo'}
                {selectedMode === 'video' && (isRecording ? 'Recording...' : 'Ready to record video')}
                {selectedMode === 'live' && 'Ready to start live stream'}
              </p>
              
              {/* Camera Controls */}
              <div className="flex justify-center space-x-4">
                <button
                  onClick={switchCamera}
                  className="bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                  title="Switch Camera"
                >
                  🔄
                </button>
                
                {selectedMode === 'photo' && (
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-white text-black p-4 rounded-full font-bold text-2xl hover:bg-gray-200 transition-colors"
                  >
                    📸
                  </button>
                )}
                
                {selectedMode === 'video' && (
                  <button
                    onClick={isRecording ? stopRecording : startRecording}
                    className={`p-4 rounded-full font-bold text-2xl transition-colors ${
                      isRecording 
                        ? 'bg-red-500 text-white hover:bg-red-600' 
                        : 'bg-white text-black hover:bg-gray-200'
                    }`}
                  >
                    {isRecording ? '⏹️' : '⏺️'}
                  </button>
                )}
                
                {selectedMode === 'live' && (
                  <Link
                    href="/live"
                    className="bg-gradient-to-r from-red-500 to-red-600 text-white px-8 py-4 rounded-full font-bold hover:from-red-600 hover:to-red-700 transition-all"
                  >
                    🔴 Start Live Stream
                  </Link>
                )}
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-white/20 text-white p-3 rounded-full hover:bg-white/30 transition-colors"
                  title="Upload from Gallery"
                >
                  📱
                </button>
              </div>
            </div>
            
            {/* Recording Indicator */}
            {isRecording && (
              <div className="absolute top-4 left-4 flex items-center space-x-2 bg-red-500 text-white px-3 py-1 rounded-full">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="text-sm font-medium">REC</span>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Link
            href="/creator/upload"
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-4">📤</div>
            <h3 className="text-xl font-bold text-white mb-2">Upload Content</h3>
            <p className="text-gray-300">Upload existing photos and videos from your device</p>
          </Link>
          
          <Link
            href="/shorts"
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-4">⚡</div>
            <h3 className="text-xl font-bold text-white mb-2">Create Shorts</h3>
            <p className="text-gray-300">Make quick vertical videos to share your message</p>
          </Link>
          
          <Link
            href="/live"
            className="bg-white/10 backdrop-blur-sm rounded-xl border border-white/20 p-6 hover:bg-white/20 transition-all transform hover:scale-105"
          >
            <div className="text-4xl mb-4">🎬</div>
            <h3 className="text-xl font-bold text-white mb-2">Live Stream</h3>
            <p className="text-gray-300">Go live to connect with your audience in real-time</p>
          </Link>
        </div>

        {/* Recent Media */}
        {mediaFiles.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">Recent Captures</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {mediaFiles.map((media) => (
                <div key={media.id} className="relative group">
                  <div className="aspect-square bg-white/10 rounded-lg overflow-hidden">
                    {media.type === 'image' ? (
                      <img
                        src={media.preview}
                        alt="Captured media"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={media.preview}
                        className="w-full h-full object-cover"
                        muted
                      />
                    )}
                  </div>
                  <button
                    onClick={() => removeMedia(media.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </button>
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-black/50 text-white px-2 py-1 rounded text-xs">
                      {media.type === 'video' ? '🎥' : '📷'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tips */}
        <div className="bg-white/5 backdrop-blur-sm rounded-xl border border-white/20 p-6">
          <h3 className="text-xl font-bold text-white mb-4">📝 Content Tips</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-300">
            <div>
              <h4 className="font-semibold text-white mb-2">📱 Mobile Best Practices</h4>
              <ul className="space-y-1 text-sm">
                <li>• Hold phone vertically for shorts</li>
                <li>• Good lighting improves quality</li>
                <li>• Keep videos under 60 seconds</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-2">🎯 Content Ideas</h4>
              <ul className="space-y-1 text-sm">
                <li>• Daily devotionals</li>
                <li>• Behind-the-scenes ministry</li>
                <li>• Community testimonies</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Hidden File Input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,video/*"
          multiple
          onChange={handleFileSelect}
          className="hidden"
        />
      </div>

      <AmenityFooter />
    </div>
  );
}