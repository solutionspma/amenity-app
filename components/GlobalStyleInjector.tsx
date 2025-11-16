'use client';

import { useEffect } from 'react';
import { useElements } from '@/contexts/ElementContext';
import { useBackdrop } from '@/contexts/BackdropContext';

export default function GlobalStyleInjector() {
  const { elements } = useElements();
  const { globalBackdrop, pageBackdrops } = useBackdrop();

  useEffect(() => {
    // Remove existing Amenity custom styles
    const existingStyle = document.getElementById('amenity-custom-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Generate CSS for all elements
    let css = `
      /* Amenity Platform - Visual Editor Generated Styles */
      :root {
        --amenity-primary-color: ${globalBackdrop.primary || '#667eea'};
        --amenity-secondary-color: ${globalBackdrop.secondary || '#764ba2'};
        --amenity-backdrop-overlay: ${(globalBackdrop.overlay || 70) / 100};
      }
    `;

    // Add component styles
    Object.values(elements).forEach(element => {
      if (!element.isActive) return;

      const selector = generateCSSSelector(element);
      if (!selector) return;

      css += `
        ${selector} {
          ${generateCSSProperties(element.styles)}
        }
      `;
    });

    // Add page-specific backdrop styles
    Object.entries(pageBackdrops).forEach(([page, backdrop]) => {
      const bodySelector = `body[data-page="${page}"]`;
      css += `
        ${bodySelector} {
          ${generateBackdropCSS(backdrop)}
        }
      `;
    });

    // Add global animations and transitions
    css += `
      /* Amenity Platform Animations */
      .amenity-component {
        transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      }
      
      .amenity-component:hover {
        transform: translateY(-1px);
      }
      
      /* Faith-based design enhancements */
      .amenity-glow {
        box-shadow: 0 0 20px rgba(102, 126, 234, 0.3);
      }
      
      .amenity-divine-gradient {
        background: linear-gradient(135deg, var(--amenity-primary-color), var(--amenity-secondary-color));
      }
    `;

    // Inject styles into document
    const styleElement = document.createElement('style');
    styleElement.id = 'amenity-custom-styles';
    styleElement.textContent = css;
    document.head.appendChild(styleElement);

    // Update page data attribute for backdrop targeting
    const currentPage = window.location.pathname.split('/')[1] || 'homepage';
    document.body.setAttribute('data-page', currentPage);

  }, [elements, globalBackdrop, pageBackdrops]);

  // Set up page change listener for SPAs
  useEffect(() => {
    const handleRouteChange = () => {
      const currentPage = window.location.pathname.split('/')[1] || 'homepage';
      document.body.setAttribute('data-page', currentPage);
    };

    // Listen for navigation changes
    window.addEventListener('popstate', handleRouteChange);
    
    // Also listen for programmatic navigation (Next.js)
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = function(...args) {
      originalPushState.apply(history, args);
      setTimeout(handleRouteChange, 0);
    };
    
    history.replaceState = function(...args) {
      originalReplaceState.apply(history, args);
      setTimeout(handleRouteChange, 0);
    };

    return () => {
      window.removeEventListener('popstate', handleRouteChange);
      history.pushState = originalPushState;
      history.replaceState = originalReplaceState;
    };
  }, []);

  return null; // This component doesn't render anything visible
}

function generateCSSSelector(element: any): string {
  const { componentType, componentId, page } = element;
  
  // Generate appropriate CSS selector based on component type
  const selectors = {
    navigation: '.amenity-navigation, nav[class*="navigation"], header nav',
    logo: '.amenity-logo, [class*="logo"]',
    button: '.amenity-button, button[class*="amenity"], .btn',
    text: '.amenity-text, p[class*="amenity"], span[class*="amenity"]',
    container: '.amenity-container, div[class*="container"]',
    'feed-post': '.amenity-post, [class*="post"][class*="card"]',
    'video-player': '.amenity-video, video, [class*="video"][class*="player"]',
    form: '.amenity-form, form[class*="amenity"], .form-container'
  };

  let baseSelector = selectors[componentType as keyof typeof selectors] || `[data-component="${componentType}"]`;
  
  // Add page-specific targeting if not global
  if (page !== 'global') {
    baseSelector = `body[data-page="${page}"] ${baseSelector}`;
  }
  
  // Add component ID if specified
  if (componentId) {
    baseSelector += `[data-component-id="${componentId}"]`;
  }

  return baseSelector;
}

function generateCSSProperties(styles: Record<string, any>): string {
  return Object.entries(styles)
    .map(([property, value]) => {
      // Convert camelCase to kebab-case
      const cssProperty = property.replace(/([A-Z])/g, '-$1').toLowerCase();
      return `${cssProperty}: ${value};`;
    })
    .join('\n  ');
}

function generateBackdropCSS(backdrop: any): string {
  const overlayOpacity = (backdrop.overlay || 70) / 100;

  switch (backdrop.type) {
    case 'gradient':
      return `background: linear-gradient(135deg, ${backdrop.primary || '#667eea'}, ${backdrop.secondary || '#764ba2'}) !important;`;
    
    case 'image':
      return `
        background-image: linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url('${backdrop.image || '/images/hero-background.jpg'}') !important;
        background-size: cover !important;
        background-position: center !important;
        background-attachment: fixed !important;
      `;
    
    case 'solid':
      return `background-color: ${backdrop.solid || '#1a1a1a'} !important;`;
    
    default:
      return `background: linear-gradient(135deg, ${backdrop.primary || '#667eea'}, ${backdrop.secondary || '#764ba2'}) !important;`;
  }
}