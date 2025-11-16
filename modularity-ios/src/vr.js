/**
 * vr.js
 * Modularity Spatial OS - VR JavaScript API
 * 
 * Wrapper for VRBridge Capacitor plugin
 * Provides easy VR control from web app
 */

window.VR = {
    /**
     * Check if native VR is available
     * @returns {boolean}
     */
    isAvailable: function() {
        return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.VRBridge;
    },

    /**
     * Enter native VR mode
     * Opens VRViewController with stereoscopic rendering + head tracking
     * @returns {Promise<void>}
     */
    enter: async function() {
        if (!this.isAvailable()) {
            console.warn('⚠️ Native VR not available. Running in browser mode.');
            alert('Native VR only available in the iOS app');
            return;
        }

        try {
            const result = await window.Capacitor.Plugins.VRBridge.enterVR();
            console.log('✅ Entered VR mode:', result);
            return result;
        } catch (error) {
            console.error('❌ Failed to enter VR:', error);
            throw error;
        }
    },

    /**
     * Exit native VR mode
     * @returns {Promise<void>}
     */
    exit: async function() {
        if (!this.isAvailable()) return;

        try {
            const result = await window.Capacitor.Plugins.VRBridge.exitVR();
            console.log('✅ Exited VR mode:', result);
            return result;
        } catch (error) {
            console.error('❌ Failed to exit VR:', error);
            throw error;
        }
    },

    /**
     * Load world data into VR
     * @param {Object} worldData - Scene configuration
     * @returns {Promise<void>}
     */
    loadWorld: async function(worldData) {
        if (!this.isAvailable()) return;

        try {
            const result = await window.Capacitor.Plugins.VRBridge.loadWorld({
                world: worldData
            });
            console.log('✅ Loaded VR world:', result);
            return result;
        } catch (error) {
            console.error('❌ Failed to load world:', error);
            throw error;
        }
    },

    /**
     * Get current head orientation
     * @returns {Promise<{pitch: number, yaw: number, roll: number}>}
     */
    getOrientation: async function() {
        if (!this.isAvailable()) return { pitch: 0, yaw: 0, roll: 0 };

        try {
            const result = await window.Capacitor.Plugins.VRBridge.getOrientation();
            return result;
        } catch (error) {
            console.error('❌ Failed to get orientation:', error);
            throw error;
        }
    },

    /**
     * Enter VR and load Sanctuary
     */
    enterSanctuary: async function() {
        await this.enter();
        await this.loadWorld({
            scene: 'sanctuary',
            spawnPoint: { x: 0, y: 1.6, z: -10 }
        });
    },

    /**
     * Enter VR and load Studio Complex
     */
    enterStudio: async function() {
        await this.enter();
        await this.loadWorld({
            scene: 'studio-complex',
            spawnPoint: { x: 0, y: 1.6, z: 0 }
        });
    }
};

// Auto-detect and log VR availability
if (window.VR.isAvailable()) {
    console.log('🟢 Native VR available via Capacitor');
} else {
    console.log('🔴 Native VR not available (running in browser)');
}
