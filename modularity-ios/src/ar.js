/**
 * ar.js
 * Modularity Spatial OS - AR JavaScript API
 * 
 * Wrapper for ARBridge Capacitor plugin
 * Provides easy AR control from web app
 */

window.AR = {
    /**
     * Check if native AR is available
     * @returns {boolean}
     */
    isAvailable: function() {
        return window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.ARBridge;
    },

    /**
     * Enter native AR mode
     * Opens ARViewController with camera + ARKit tracking
     * @returns {Promise<void>}
     */
    enter: async function() {
        if (!this.isAvailable()) {
            console.warn('⚠️ Native AR not available. Running in browser mode.');
            alert('Native AR only available in the iOS app');
            return;
        }

        try {
            const result = await window.Capacitor.Plugins.ARBridge.enterAR();
            console.log('✅ Entered AR mode:', result);
            return result;
        } catch (error) {
            console.error('❌ Failed to enter AR:', error);
            throw error;
        }
    },

    /**
     * Exit native AR mode
     * @returns {Promise<void>}
     */
    exit: async function() {
        if (!this.isAvailable()) return;

        try {
            const result = await window.Capacitor.Plugins.ARBridge.exitAR();
            console.log('✅ Exited AR mode:', result);
            return result;
        } catch (error) {
            console.error('❌ Failed to exit AR:', error);
            throw error;
        }
    },

    /**
     * Place a 3D model in AR space
     * @param {string} modelName - GLB/USDZ filename (e.g. 'sanctuary.glb')
     * @returns {Promise<void>}
     */
    placeModel: async function(modelName) {
        if (!this.isAvailable()) {
            console.warn('⚠️ Native AR not available');
            return;
        }

        try {
            const result = await window.Capacitor.Plugins.ARBridge.place({
                model: modelName
            });
            console.log(`✅ Placed model: ${modelName}`, result);
            return result;
        } catch (error) {
            console.error(`❌ Failed to place model ${modelName}:`, error);
            throw error;
        }
    },

    /**
     * Clear all placed models from AR scene
     * @returns {Promise<void>}
     */
    clearModels: async function() {
        if (!this.isAvailable()) return;

        try {
            const result = await window.Capacitor.Plugins.ARBridge.clearModels();
            console.log('✅ Cleared all AR models:', result);
            return result;
        } catch (error) {
            console.error('❌ Failed to clear models:', error);
            throw error;
        }
    },

    /**
     * Place Sanctuary church in AR
     */
    placeSanctuary: function() {
        return this.placeModel('sanctuary.glb');
    },

    /**
     * Place Prayer Circle in AR
     */
    placePrayerCircle: function() {
        return this.placeModel('prayer-circle.glb');
    },

    /**
     * Place Youth Room in AR
     */
    placeYouthRoom: function() {
        return this.placeModel('youth-room.glb');
    },

    /**
     * Place Studio Complex in AR
     */
    placeStudioComplex: function() {
        return this.placeModel('studio-complex.glb');
    }
};

// Auto-detect and log AR availability
if (window.AR.isAvailable()) {
    console.log('🟢 Native AR available via Capacitor');
} else {
    console.log('🔴 Native AR not available (running in browser)');
}
