/**
 * ControlCore.js
 * Unified control system for desktop, mobile, VR, AR
 */

export class ControlCore {
  constructor(engine) {
    this.engine = engine;
    this.keyboard = {};
    this.mouse = { x: 0, y: 0, buttons: {} };
    this.touch = { active: false, points: [] };
    this.gamepad = null;
    
    this.setupEventListeners();
    console.log('🎮 Control Core initialized');
  }

  setupEventListeners() {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      this.keyboard[e.key.toLowerCase()] = true;
    });
    
    window.addEventListener('keyup', (e) => {
      this.keyboard[e.key.toLowerCase()] = false;
    });
    
    // Mouse
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
    
    window.addEventListener('mousedown', (e) => {
      this.mouse.buttons[e.button] = true;
    });
    
    window.addEventListener('mouseup', (e) => {
      this.mouse.buttons[e.button] = false;
    });
    
    // Touch
    window.addEventListener('touchstart', (e) => {
      this.touch.active = true;
      this.touch.points = Array.from(e.touches).map(t => ({
        x: t.clientX,
        y: t.clientY,
        id: t.identifier
      }));
    });
    
    window.addEventListener('touchmove', (e) => {
      this.touch.points = Array.from(e.touches).map(t => ({
        x: t.clientX,
        y: t.clientY,
        id: t.identifier
      }));
    });
    
    window.addEventListener('touchend', (e) => {
      if (e.touches.length === 0) {
        this.touch.active = false;
        this.touch.points = [];
      }
    });
  }

  update(delta) {
    // Poll gamepad
    const gamepads = navigator.getGamepads();
    if (gamepads[0]) {
      this.gamepad = {
        axes: Array.from(gamepads[0].axes),
        buttons: Array.from(gamepads[0].buttons).map(b => b.pressed)
      };
    }
  }

  isKeyPressed(key) {
    return !!this.keyboard[key.toLowerCase()];
  }

  isMouseButtonPressed(button = 0) {
    return !!this.mouse.buttons[button];
  }

  isTouchActive() {
    return this.touch.active;
  }

  getTouchPoints() {
    return this.touch.points;
  }
}
