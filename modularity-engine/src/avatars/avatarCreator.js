/**
 * MODULARITY SPATIAL OS - AVATAR CREATOR
 * AI-powered avatar generation and customization
 */

export class AvatarCreator {
  constructor() {
    this.apiEndpoint = 'https://api.amenity.church/ai/avatar';
    this.customizationOptions = this.getDefaultOptions();
  }

  initialize() {
    console.log('🎨 Initializing Avatar Creator...');
    console.log('✅ Avatar Creator initialized');
  }

  getDefaultOptions() {
    return {
      bodyTypes: ['slim', 'average', 'athletic', 'heavyset'],
      heights: ['short', 'average', 'tall'],
      skinTones: [
        { name: 'Fair', value: [1.0, 0.9, 0.85] },
        { name: 'Light', value: [0.95, 0.82, 0.71] },
        { name: 'Medium', value: [0.85, 0.68, 0.55] },
        { name: 'Olive', value: [0.75, 0.6, 0.45] },
        { name: 'Brown', value: [0.55, 0.42, 0.33] },
        { name: 'Dark', value: [0.35, 0.25, 0.18] }
      ],
      hairStyles: [
        'short', 'medium', 'long', 'bald', 'afro', 'dreadlocks',
        'ponytail', 'bun', 'braids', 'buzzcut'
      ],
      hairColors: [
        { name: 'Black', value: [0.1, 0.1, 0.1] },
        { name: 'Brown', value: [0.4, 0.25, 0.15] },
        { name: 'Blonde', value: [0.9, 0.85, 0.6] },
        { name: 'Red', value: [0.7, 0.2, 0.1] },
        { name: 'Grey', value: [0.6, 0.6, 0.6] },
        { name: 'White', value: [0.95, 0.95, 0.95] }
      ],
      outfitStyles: [
        'casual', 'business', 'ministry', 'worship_leader',
        'youth_pastor', 'formal', 'creative', 'athletic'
      ],
      accessories: [
        'glasses', 'cross_necklace', 'watch', 'ring',
        'earrings', 'bracelet', 'headband', 'hat'
      ]
    };
  }

  async generateAvatarAI(description) {
    console.log('🤖 Generating AI avatar from description...');
    
    try {
      const response = await fetch(`${this.apiEndpoint}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          description: description,
          style: 'faith-based-realistic',
          format: 'glb'
        })
      });

      const result = await response.json();
      
      if (result.success) {
        console.log('✅ AI avatar generated');
        return {
          modelUrl: result.modelUrl,
          thumbnail: result.thumbnail,
          customization: result.detectedCustomization
        };
      } else {
        throw new Error(result.error);
      }

    } catch (error) {
      console.error('❌ AI avatar generation failed:', error);
      return null;
    }
  }

  async createFromPhoto(imageFile) {
    console.log('📷 Creating avatar from photo...');

    const formData = new FormData();
    formData.append('photo', imageFile);
    formData.append('style', 'faith-based');

    try {
      const response = await fetch(`${this.apiEndpoint}/from-photo`, {
        method: 'POST',
        body: formData
      });

      const result = await response.json();

      if (result.success) {
        console.log('✅ Avatar created from photo');
        return {
          modelUrl: result.modelUrl,
          thumbnail: result.thumbnail,
          customization: result.customization
        };
      }

    } catch (error) {
      console.error('❌ Photo avatar creation failed:', error);
      return null;
    }
  }

  createCustomization(options = {}) {
    return {
      bodyType: options.bodyType || 'average',
      height: options.height || 'average',
      skinTone: options.skinTone || this.customizationOptions.skinTones[2].value,
      hairStyle: options.hairStyle || 'short',
      hairColor: options.hairColor || this.customizationOptions.hairColors[0].value,
      outfitStyle: options.outfitStyle || 'casual',
      outfitColor: options.outfitColor || [0.3, 0.3, 0.8],
      accessories: options.accessories || [],
      displayName: options.displayName || 'User'
    };
  }

  async saveCustomization(userId, customization) {
    try {
      const response = await fetch(`${this.apiEndpoint}/save-customization`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          userId: userId,
          customization: customization
        })
      });

      const result = await response.json();
      return result.success;

    } catch (error) {
      console.error('Failed to save customization:', error);
      return false;
    }
  }

  async loadCustomization(userId) {
    try {
      const response = await fetch(`${this.apiEndpoint}/load-customization/${userId}`);
      const result = await response.json();
      
      return result.success ? result.customization : null;

    } catch (error) {
      console.error('Failed to load customization:', error);
      return null;
    }
  }

  exportAvatarData(customization) {
    return {
      version: '1.0',
      timestamp: new Date().toISOString(),
      customization: customization
    };
  }

  importAvatarData(data) {
    if (data.version === '1.0' && data.customization) {
      return data.customization;
    }
    return null;
  }

  getRandomCustomization() {
    const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

    return this.createCustomization({
      bodyType: random(this.customizationOptions.bodyTypes),
      height: random(this.customizationOptions.heights),
      skinTone: random(this.customizationOptions.skinTones).value,
      hairStyle: random(this.customizationOptions.hairStyles),
      hairColor: random(this.customizationOptions.hairColors).value,
      outfitStyle: random(this.customizationOptions.outfitStyles),
      outfitColor: [Math.random(), Math.random(), Math.random()],
      accessories: [random(this.customizationOptions.accessories)]
    });
  }

  dispose() {
    console.log('Avatar Creator disposed');
  }
}

export default AvatarCreator;
