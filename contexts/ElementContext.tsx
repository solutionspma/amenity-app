'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface ElementStyle {
  fontSize?: string;
  fontWeight?: string;
  color?: string;
  backgroundColor?: string;
  border?: string;
  borderRadius?: string;
  padding?: string;
  margin?: string;
  width?: string;
  height?: string;
  display?: string;
  flexDirection?: string;
  alignItems?: string;
  justifyContent?: string;
  opacity?: string;
  transform?: string;
  transition?: string;
  boxShadow?: string;
  textAlign?: string;
  lineHeight?: string;
  letterSpacing?: string;
  textDecoration?: string;
  fontFamily?: string;
  position?: string;
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  zIndex?: string;
}

interface ComponentElement {
  id: string;
  componentType: 'navigation' | 'logo' | 'button' | 'text' | 'container' | 'image' | 'form' | 'feed-post' | 'video-player';
  componentId?: string; // Specific component instance ID
  page: string;
  styles: ElementStyle;
  content?: string;
  isActive: boolean;
  lastUpdated: Date;
}

interface ElementContextType {
  elements: Record<string, ComponentElement>;
  updateElement: (elementId: string, updates: Partial<ComponentElement>) => void;
  getElementStyles: (componentType: string, componentId?: string, page?: string) => ElementStyle;
  applyToComponent: (componentType: string, styles: ElementStyle, page?: string, componentId?: string) => void;
  removeElement: (elementId: string) => void;
  getElementsForPage: (page: string) => ComponentElement[];
  exportElements: () => string;
  importElements: (elementsJson: string) => void;
}

const ElementContext = createContext<ElementContextType | undefined>(undefined);

export const useElements = () => {
  const context = useContext(ElementContext);
  if (!context) {
    throw new Error('useElements must be used within an ElementProvider');
  }
  return context;
};

export const ElementProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [elements, setElements] = useState<Record<string, ComponentElement>>({});

  // Load elements from localStorage on mount
  useEffect(() => {
    const savedElements = localStorage.getItem('amenity_component_elements');
    if (savedElements) {
      try {
        const parsed = JSON.parse(savedElements);
        // Convert date strings back to Date objects
        const elementsWithDates = Object.keys(parsed).reduce((acc, key) => {
          acc[key] = {
            ...parsed[key],
            lastUpdated: new Date(parsed[key].lastUpdated)
          };
          return acc;
        }, {} as Record<string, ComponentElement>);
        setElements(elementsWithDates);
      } catch (error) {
        console.error('Error loading elements from localStorage:', error);
      }
    }
  }, []);

  // Save elements to localStorage when they change
  useEffect(() => {
    localStorage.setItem('amenity_component_elements', JSON.stringify(elements));
  }, [elements]);

  const updateElement = (elementId: string, updates: Partial<ComponentElement>) => {
    setElements(prev => ({
      ...prev,
      [elementId]: {
        ...prev[elementId],
        ...updates,
        lastUpdated: new Date()
      }
    }));
  };

  const getElementStyles = (componentType: string, componentId?: string, page?: string): ElementStyle => {
    // Find matching element
    const matchingElement = Object.values(elements).find(element => {
      if (element.componentType !== componentType) return false;
      if (componentId && element.componentId !== componentId) return false;
      if (page && element.page !== page && element.page !== 'global') return false;
      return element.isActive;
    });

    return matchingElement?.styles || {};
  };

  const applyToComponent = (
    componentType: string, 
    styles: ElementStyle, 
    page = 'global', 
    componentId?: string
  ) => {
    const elementId = componentId 
      ? `${componentType}-${componentId}-${page}`
      : `${componentType}-${page}`;

    const newElement: ComponentElement = {
      id: elementId,
      componentType: componentType as ComponentElement['componentType'],
      componentId,
      page,
      styles,
      isActive: true,
      lastUpdated: new Date()
    };

    setElements(prev => ({
      ...prev,
      [elementId]: newElement
    }));
  };

  const removeElement = (elementId: string) => {
    setElements(prev => {
      const newElements = { ...prev };
      delete newElements[elementId];
      return newElements;
    });
  };

  const getElementsForPage = (page: string): ComponentElement[] => {
    return Object.values(elements).filter(element => 
      element.page === page || element.page === 'global'
    );
  };

  const exportElements = (): string => {
    return JSON.stringify(elements, null, 2);
  };

  const importElements = (elementsJson: string) => {
    try {
      const parsed = JSON.parse(elementsJson);
      const elementsWithDates = Object.keys(parsed).reduce((acc, key) => {
        acc[key] = {
          ...parsed[key],
          lastUpdated: new Date(parsed[key].lastUpdated)
        };
        return acc;
      }, {} as Record<string, ComponentElement>);
      setElements(elementsWithDates);
    } catch (error) {
      console.error('Error importing elements:', error);
    }
  };

  return (
    <ElementContext.Provider value={{
      elements,
      updateElement,
      getElementStyles,
      applyToComponent,
      removeElement,
      getElementsForPage,
      exportElements,
      importElements
    }}>
      {children}
    </ElementContext.Provider>
  );
};