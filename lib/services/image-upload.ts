/**
 * Image Upload Service - Handles profile and cover image uploads
 * Features: Validation, compression, preview generation, and storage
 */

export interface ImageUploadOptions {
  maxSize?: number; // in MB
  quality?: number; // 0.1 to 1.0
  maxWidth?: number;
  maxHeight?: number;
  format?: 'jpeg' | 'png' | 'webp';
}

export interface ImageUploadResult {
  success: boolean;
  url?: string;
  error?: string;
  preview?: string;
  size?: number;
  dimensions?: { width: number; height: number };
}

export class ImageUploadService {
  private static readonly DEFAULT_OPTIONS: ImageUploadOptions = {
    maxSize: 5, // 5MB
    quality: 0.8,
    maxWidth: 1920,
    maxHeight: 1080,
    format: 'jpeg'
  };

  /**
   * Validate image file before upload
   */
  static validateFile(file: File, options: ImageUploadOptions = {}): { valid: boolean; error?: string } {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    // Check file type
    if (!file.type.startsWith('image/')) {
      return { valid: false, error: 'Please select a valid image file' };
    }
    
    // Check file size
    const fileSizeMB = file.size / (1024 * 1024);
    if (fileSizeMB > (opts.maxSize || 5)) {
      return { valid: false, error: `File size must be less than ${opts.maxSize}MB` };
    }
    
    // Check supported formats
    const supportedFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
    if (!supportedFormats.includes(file.type)) {
      return { valid: false, error: 'Supported formats: JPEG, PNG, WebP' };
    }
    
    return { valid: true };
  }

  /**
   * Compress and resize image
   */
  static async compressImage(file: File, options: ImageUploadOptions = {}): Promise<Blob> {
    const opts = { ...this.DEFAULT_OPTIONS, ...options };
    
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        // Calculate new dimensions
        let { width, height } = img;
        const maxWidth = opts.maxWidth || 1920;
        const maxHeight = opts.maxHeight || 1080;
        
        if (width > maxWidth || height > maxHeight) {
          const ratio = Math.min(maxWidth / width, maxHeight / height);
          width *= ratio;
          height *= ratio;
        }
        
        // Set canvas dimensions
        canvas.width = width;
        canvas.height = height;
        
        // Draw and compress
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          canvas.toBlob(
            (blob) => {
              if (blob) {
                resolve(blob);
              } else {
                reject(new Error('Failed to compress image'));
              }
            },
            `image/${opts.format}`,
            opts.quality
          );
        } else {
          reject(new Error('Failed to get canvas context'));
        }
      };
      
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Generate preview URL for image
   */
  static generatePreview(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          resolve(e.target.result as string);
        } else {
          reject(new Error('Failed to read file'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  }

  /**
   * Upload profile image
   */
  static async uploadProfileImage(file: File, userId: string): Promise<ImageUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, {
        maxSize: 2, // 2MB for profile images
        maxWidth: 400,
        maxHeight: 400
      });
      
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate preview
      const preview = await this.generatePreview(file);
      
      // Compress image
      const compressedBlob = await this.compressImage(file, {
        maxSize: 2,
        maxWidth: 400,
        maxHeight: 400,
        format: 'jpeg',
        quality: 0.85
      });

      // Convert to base64 for storage (in a real app, upload to cloud storage)
      const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
      const compressedUrl = await this.generatePreview(compressedFile);
      
      // Store in localStorage (fallback storage)
      const storageKey = `amenity_profile_image_${userId}`;
      localStorage.setItem(storageKey, compressedUrl);
      
      // Get image dimensions
      const img = new Image();
      img.src = compressedUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      return {
        success: true,
        url: compressedUrl,
        preview,
        size: compressedBlob.size,
        dimensions: { width: img.width, height: img.height }
      };
      
    } catch (error) {
      console.error('Profile image upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Upload cover image
   */
  static async uploadCoverImage(file: File, userId: string): Promise<ImageUploadResult> {
    try {
      // Validate file
      const validation = this.validateFile(file, {
        maxSize: 5, // 5MB for cover images
        maxWidth: 1920,
        maxHeight: 600
      });
      
      if (!validation.valid) {
        return { success: false, error: validation.error };
      }

      // Generate preview
      const preview = await this.generatePreview(file);
      
      // Compress image
      const compressedBlob = await this.compressImage(file, {
        maxSize: 5,
        maxWidth: 1920,
        maxHeight: 600,
        format: 'jpeg',
        quality: 0.8
      });

      // Convert to base64 for storage
      const compressedFile = new File([compressedBlob], file.name, { type: compressedBlob.type });
      const compressedUrl = await this.generatePreview(compressedFile);
      
      // Store in localStorage
      const storageKey = `amenity_cover_image_${userId}`;
      localStorage.setItem(storageKey, compressedUrl);
      
      // Get image dimensions
      const img = new Image();
      img.src = compressedUrl;
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      return {
        success: true,
        url: compressedUrl,
        preview,
        size: compressedBlob.size,
        dimensions: { width: img.width, height: img.height }
      };
      
    } catch (error) {
      console.error('Cover image upload error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Upload failed' 
      };
    }
  }

  /**
   * Get stored profile image
   */
  static getProfileImage(userId: string): string | null {
    const storageKey = `amenity_profile_image_${userId}`;
    return localStorage.getItem(storageKey);
  }

  /**
   * Get stored cover image
   */
  static getCoverImage(userId: string): string | null {
    const storageKey = `amenity_cover_image_${userId}`;
    return localStorage.getItem(storageKey);
  }

  /**
   * Delete profile image
   */
  static deleteProfileImage(userId: string): void {
    const storageKey = `amenity_profile_image_${userId}`;
    localStorage.removeItem(storageKey);
  }

  /**
   * Delete cover image
   */
  static deleteCoverImage(userId: string): void {
    const storageKey = `amenity_cover_image_${userId}`;
    localStorage.removeItem(storageKey);
  }
}