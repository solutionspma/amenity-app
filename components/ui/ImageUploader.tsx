'use client';

import { useState, useRef, useCallback } from 'react';
import { ImageUploadService, type ImageUploadResult } from '@/lib/services/image-upload';

interface ImageUploaderProps {
  type: 'profile' | 'cover';
  userId: string;
  currentImage?: string;
  onUploadSuccess: (result: ImageUploadResult) => void;
  onUploadError: (error: string) => void;
  className?: string;
}

export default function ImageUploader({
  type,
  userId,
  currentImage,
  onUploadSuccess,
  onUploadError,
  className = ''
}: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isProfile = type === 'profile';
  const maxSize = isProfile ? 2 : 5;
  const dimensions = isProfile ? '400x400' : '1920x600';
  const aspectRatio = isProfile ? 'aspect-square' : 'aspect-[16/5]';

  const handleFile = useCallback(async (file: File) => {
    if (isUploading) return;
    
    setIsUploading(true);
    
    try {
      // Generate preview immediately
      const previewUrl = await ImageUploadService.generatePreview(file);
      setPreview(previewUrl);
      
      // Upload image
      const result = isProfile 
        ? await ImageUploadService.uploadProfileImage(file, userId)
        : await ImageUploadService.uploadCoverImage(file, userId);
      
      if (result.success) {
        onUploadSuccess(result);
      } else {
        onUploadError(result.error || 'Upload failed');
        setPreview(null);
      }
    } catch (error) {
      console.error('Upload error:', error);
      onUploadError('Upload failed. Please try again.');
      setPreview(null);
    } finally {
      setIsUploading(false);
    }
  }, [isProfile, userId, onUploadSuccess, onUploadError, isUploading]);

  const handleDragEnter = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));
    
    if (imageFile) {
      handleFile(imageFile);
    } else {
      onUploadError('Please drop an image file');
    }
  }, [handleFile, onUploadError]);

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFile(file);
    }
  }, [handleFile]);

  const handleClick = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  const handleDelete = useCallback(() => {
    if (isProfile) {
      ImageUploadService.deleteProfileImage(userId);
    } else {
      ImageUploadService.deleteCoverImage(userId);
    }
    setPreview(null);
    onUploadSuccess({ success: true, url: '' });
  }, [isProfile, userId, onUploadSuccess]);

  const displayImage = preview || currentImage;

  return (
    <div className={`${className}`}>
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-white mb-2">
          {isProfile ? '👤 Profile Picture' : '🖼️ Cover Image'}
        </h3>
        <p className="text-sm text-gray-400">
          {isProfile 
            ? `Upload a square image (${dimensions}px recommended, max ${maxSize}MB)`
            : `Upload a wide image (${dimensions}px recommended, max ${maxSize}MB)`
          }
        </p>
      </div>

      <div
        className={`
          relative ${aspectRatio} w-full border-2 border-dashed rounded-xl overflow-hidden
          transition-all duration-200 cursor-pointer group
          ${isDragging 
            ? 'border-purple-400 bg-purple-500/10' 
            : 'border-gray-600 hover:border-purple-500 bg-gray-800/50 hover:bg-gray-700/50'
          }
          ${isUploading ? 'pointer-events-none opacity-75' : ''}
        `}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={isProfile ? 'Profile preview' : 'Cover preview'}
              className="w-full h-full object-cover"
            />
            
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-200 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex space-x-3">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleClick();
                  }}
                  className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  📤 Change
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete();
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                >
                  🗑️ Remove
                </button>
              </div>
            </div>

            {isUploading && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <div className="bg-white/90 rounded-lg p-4 flex items-center space-x-3">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                  <span className="text-gray-900 font-medium">Uploading...</span>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center p-6">
            {isUploading ? (
              <>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-400 mb-4"></div>
                <p className="text-purple-300 font-medium">Uploading image...</p>
                <p className="text-sm text-gray-400 mt-1">Please wait</p>
              </>
            ) : (
              <>
                <div className="text-4xl mb-4 text-gray-400 group-hover:text-purple-400 transition-colors">
                  {isProfile ? '👤' : '🖼️'}
                </div>
                <p className="text-white font-medium mb-2">
                  {isDragging ? 'Drop image here' : `Upload ${isProfile ? 'Profile' : 'Cover'} Image`}
                </p>
                <p className="text-sm text-gray-400 mb-4">
                  Drag & drop or click to select
                </p>
                <div className="text-xs text-gray-500 space-y-1">
                  <div>Max size: {maxSize}MB</div>
                  <div>Formats: JPEG, PNG, WebP</div>
                  <div>Recommended: {dimensions}px</div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
}