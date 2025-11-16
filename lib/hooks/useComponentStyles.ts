'use client';

import { useElements } from '@/contexts/ElementContext';
import { CSSProperties } from 'react';

interface UseComponentStylesOptions {
  componentType: 'navigation' | 'logo' | 'button' | 'text' | 'container' | 'image' | 'form' | 'feed-post' | 'video-player';
  componentId?: string;
  page?: string;
  defaultStyles?: CSSProperties;
  className?: string;
}

export const useComponentStyles = ({
  componentType,
  componentId,
  page = 'global',
  defaultStyles = {},
  className = ''
}: UseComponentStylesOptions) => {
  const { getElementStyles } = useElements();

  // Get custom styles from the element context
  const customStyles = getElementStyles(componentType, componentId, page);

  // Merge default styles with custom styles
  const mergedStyles = {
    ...defaultStyles,
    ...customStyles
  } as any;

  // Convert any string values to proper CSS format
  const processedStyles = Object.keys(mergedStyles).reduce((acc, key) => {
    let value = mergedStyles[key];
    
    // Handle special cases
    if (key === 'fontSize' && typeof value === 'string' && !value.includes('px') && !value.includes('rem') && !value.includes('em')) {
      value = `${value}px`;
    }
    
    if (key === 'borderRadius' && typeof value === 'string' && !value.includes('px') && !value.includes('%')) {
      value = `${value}px`;
    }

    (acc as any)[key] = value;
    return acc;
  }, {} as CSSProperties);

  return {
    styles: processedStyles,
    className: className,
    hasCustomStyles: Object.keys(customStyles).length > 0
  };
};

// Helper function for creating component style hooks
export const createComponentStyleHook = (componentType: UseComponentStylesOptions['componentType']) => {
  return (options: Omit<UseComponentStylesOptions, 'componentType'> = {}) => {
    return useComponentStyles({ ...options, componentType });
  };
};

// Predefined hooks for common components
export const useNavigationStyles = createComponentStyleHook('navigation');
export const useLogoStyles = createComponentStyleHook('logo');
export const useButtonStyles = createComponentStyleHook('button');
export const useTextStyles = createComponentStyleHook('text');
export const useContainerStyles = createComponentStyleHook('container');
export const useImageStyles = createComponentStyleHook('image');
export const useFormStyles = createComponentStyleHook('form');
export const useFeedPostStyles = createComponentStyleHook('feed-post');
export const useVideoPlayerStyles = createComponentStyleHook('video-player');