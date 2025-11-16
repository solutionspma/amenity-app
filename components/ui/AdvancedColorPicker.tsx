'use client';

import { useState, useCallback, useEffect } from 'react';
import { useBackdrop } from '@/contexts/BackdropContext';

interface ColorPickerProps {
  onClose?: () => void;
  isAdmin?: boolean;
}

export default function AdvancedColorPicker({ onClose, isAdmin = false }: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeColor, setActiveColor] = useState<'primary' | 'secondary'>('primary');
  const [primaryColor, setPrimaryColor] = useState('#667eea');
  const [secondaryColor, setSecondaryColor] = useState('#764ba2');
  const [backgroundType, setBackgroundType] = useState<'gradient' | 'solid' | 'image' | 'video'>('gradient');
  const [opacity, setOpacity] = useState(70);
  
  const { globalBackdrop, updateGlobalBackdrop } = useBackdrop();

  // Load current backdrop settings
  useEffect(() => {
    setPrimaryColor(globalBackdrop.primary || '#667eea');
    setSecondaryColor(globalBackdrop.secondary || '#764ba2');
    const backdropType = globalBackdrop.type || 'gradient';
    setBackgroundType(backdropType as 'gradient' | 'solid' | 'image' | 'video');
    setOpacity(globalBackdrop.overlay || 70);
  }, [globalBackdrop]);

  // Color swatches - popular themes
  const colorSwatches = [
    { name: 'Ocean', primary: '#667eea', secondary: '#764ba2' },
    { name: 'Sunset', primary: '#f093fb', secondary: '#f5576c' },
    { name: 'Forest', primary: '#4facfe', secondary: '#00f2fe' },
    { name: 'Royal', primary: '#a8edea', secondary: '#fed6e3' },
    { name: 'Fire', primary: '#ff9a9e', secondary: '#fecfef' },
    { name: 'Night', primary: '#2c3e50', secondary: '#fd746c' },
    { name: 'Aurora', primary: '#00c9ff', secondary: '#92fe9d' },
    { name: 'Grape', primary: '#667eea', secondary: '#764ba2' },
    { name: 'Peach', primary: '#FDBB2D', secondary: '#22C1C3' },
    { name: 'Mint', primary: '#74b9ff', secondary: '#0984e3' },
  ];

  const handleColorChange = useCallback((color: string, type: 'primary' | 'secondary') => {
    if (type === 'primary') {
      setPrimaryColor(color);
    } else {
      setSecondaryColor(color);
    }
  }, []);

  const handleSwatchSelect = useCallback((swatch: typeof colorSwatches[0]) => {
    setPrimaryColor(swatch.primary);
    setSecondaryColor(swatch.secondary);
  }, []);

  const handleSave = useCallback(() => {
    const newBackdrop = {
      type: backgroundType,
      primary: primaryColor,
      secondary: secondaryColor,
      overlay: opacity
    };
    updateGlobalBackdrop(newBackdrop);
    
    // Show success message
    console.log('✅ Color theme saved successfully!');
    
    if (onClose) {
      onClose();
    }
  }, [backgroundType, primaryColor, secondaryColor, opacity, updateGlobalBackdrop, onClose]);

  const handleReset = useCallback(() => {
    setPrimaryColor('#667eea');
    setSecondaryColor('#764ba2');
    setBackgroundType('gradient');
    setOpacity(70);
  }, []);

  // Generate preview style
  const previewStyle = {
    background: backgroundType === 'gradient' 
      ? `linear-gradient(135deg, ${primaryColor}, ${secondaryColor})`
      : primaryColor,
    opacity: opacity / 100
  };

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      {/* Floating Color Picker Toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-4 rounded-full shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 animate-pulse hover:animate-none"
        style={{
          boxShadow: '0 0 30px rgba(147, 51, 234, 0.5)'
        }}
      >
        🎨
      </button>

      {/* Color Picker Panel */}
      {isOpen && (
        <div className="fixed bottom-20 right-6 z-50 bg-black/90 backdrop-blur-md rounded-2xl border border-gray-700 p-6 w-80 shadow-2xl">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-white font-bold text-lg">🎨 Color Theme</h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>

          {/* Preview */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Preview</label>
            <div 
              className="h-24 rounded-lg border border-gray-600"
              style={previewStyle}
            ></div>
          </div>

          {/* Background Type */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Background Type</label>
            <div className="grid grid-cols-3 gap-2">
              {(['gradient', 'solid', 'image'] as const).map((type) => (
                <button
                  key={type}
                  onClick={() => setBackgroundType(type)}
                  className={`p-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                    backgroundType === type
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Color Controls */}
          {backgroundType !== 'image' && (
            <div className="mb-6">
              <label className="block text-white text-sm font-medium mb-2">Colors</label>
              
              {/* Active Color Selector */}
              <div className="flex space-x-2 mb-4">
                <button
                  onClick={() => setActiveColor('primary')}
                  className={`flex-1 p-2 rounded-lg text-sm font-medium transition-colors ${
                    activeColor === 'primary'
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  Primary
                </button>
                {backgroundType === 'gradient' && (
                  <button
                    onClick={() => setActiveColor('secondary')}
                    className={`flex-1 p-2 rounded-lg text-sm font-medium transition-colors ${
                      activeColor === 'secondary'
                        ? 'bg-purple-600 text-white'
                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                    }`}
                  >
                    Secondary
                  </button>
                )}
              </div>

              {/* Color Input */}
              <div className="flex space-x-2 mb-4">
                <input
                  type="color"
                  value={activeColor === 'primary' ? primaryColor : secondaryColor}
                  onChange={(e) => handleColorChange(e.target.value, activeColor)}
                  className="w-12 h-12 rounded-lg border border-gray-600"
                />
                <input
                  type="text"
                  value={activeColor === 'primary' ? primaryColor : secondaryColor}
                  onChange={(e) => handleColorChange(e.target.value, activeColor)}
                  className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white text-sm font-mono"
                  placeholder="#667eea"
                />
              </div>
            </div>
          )}

          {/* Color Swatches */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">Quick Themes</label>
            <div className="grid grid-cols-5 gap-2">
              {colorSwatches.map((swatch) => (
                <button
                  key={swatch.name}
                  onClick={() => handleSwatchSelect(swatch)}
                  className="aspect-square rounded-lg border border-gray-600 hover:scale-110 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${swatch.primary}, ${swatch.secondary})`
                  }}
                  title={swatch.name}
                ></button>
              ))}
            </div>
          </div>

          {/* Opacity Slider */}
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Opacity ({opacity}%)
            </label>
            <input
              type="range"
              min="0"
              max="100"
              value={opacity}
              onChange={(e) => setOpacity(Number(e.target.value))}
              className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <button
              onClick={handleReset}
              className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg font-medium transition-colors"
            >
              Reset
            </button>
            <button
              onClick={handleSave}
              className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white py-2 px-4 rounded-lg font-medium transition-all"
            >
              Save
            </button>
          </div>
        </div>
      )}

      {/* Custom Styles */}
      <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          border: 2px solid white;
        }
        
        .slider::-moz-range-thumb {
          height: 20px;
          width: 20px;
          border-radius: 50%;
          background: linear-gradient(135deg, #667eea, #764ba2);
          cursor: pointer;
          border: 2px solid white;
        }
      `}</style>
    </>
  );
}