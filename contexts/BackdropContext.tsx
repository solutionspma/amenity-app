'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface BackdropSettings {
  type: 'gradient' | 'image' | 'video' | 'solid';
  primary?: string;
  secondary?: string;
  image?: string;
  video?: string;
  solid?: string;
  overlay?: number; // 0-100 opacity
}

interface BackdropContextType {
  globalBackdrop: BackdropSettings;
  pageBackdrops: Record<string, BackdropSettings>;
  updateGlobalBackdrop: (settings: BackdropSettings) => void;
  updatePageBackdrop: (page: string, settings: BackdropSettings) => void;
  getBackdropForPage: (page: string) => BackdropSettings;
  getBackdropStyle: (page: string) => React.CSSProperties;
}

const defaultBackdrop: BackdropSettings = {
  type: 'gradient',
  primary: '#000000',
  secondary: '#581c87',
  overlay: 70
};

const BackdropContext = createContext<BackdropContextType | undefined>(undefined);

export const useBackdrop = () => {
  const context = useContext(BackdropContext);
  if (!context) {
    throw new Error('useBackdrop must be used within a BackdropProvider');
  }
  return context;
};

export const BackdropProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [globalBackdrop, setGlobalBackdrop] = useState<BackdropSettings>(defaultBackdrop);
  const [pageBackdrops, setPageBackdrops] = useState<Record<string, BackdropSettings>>({});

  // Load settings from localStorage on mount
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const savedGlobal = localStorage.getItem('amenity_global_backdrop');
    const savedPages = localStorage.getItem('amenity_page_backdrops');
    
    if (savedGlobal) {
      try {
        setGlobalBackdrop(JSON.parse(savedGlobal));
      } catch (e) {
        console.error('Failed to load global backdrop settings');
      }
    }
    
    if (savedPages) {
      try {
        setPageBackdrops(JSON.parse(savedPages));
      } catch (e) {
        console.error('Failed to load page backdrop settings');
      }
    }
  }, []);

  const updateGlobalBackdrop = (settings: BackdropSettings) => {
    setGlobalBackdrop(settings);
    if (typeof window !== 'undefined') {
      localStorage.setItem('amenity_global_backdrop', JSON.stringify(settings));
    }
  };

  const updatePageBackdrop = (page: string, settings: BackdropSettings) => {
    const newPageBackdrops = { ...pageBackdrops, [page]: settings };
    setPageBackdrops(newPageBackdrops);
    if (typeof window !== 'undefined') {
      localStorage.setItem('amenity_page_backdrops', JSON.stringify(newPageBackdrops));
    }
  };

  const getBackdropForPage = (page: string): BackdropSettings => {
    return pageBackdrops[page] || globalBackdrop;
  };

  const getBackdropStyle = (page: string): React.CSSProperties => {
    const backdrop = getBackdropForPage(page);
    const overlayOpacity = (backdrop.overlay || 70) / 100;

    switch (backdrop.type) {
      case 'gradient':
        return {
          background: `linear-gradient(135deg, ${backdrop.primary || '#000000'}, ${backdrop.secondary || '#581c87'})`,
          backgroundAttachment: 'fixed'
        };
      
      case 'image':
        return {
          backgroundImage: backdrop.image 
            ? `linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url('${backdrop.image}')`
            : `linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity})), url('/images/hero-background.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed'
        };
      
      case 'video':
        return {
          background: `linear-gradient(rgba(0,0,0,${overlayOpacity}), rgba(0,0,0,${overlayOpacity}))`,
          position: 'relative'
        };
      
      case 'solid':
        return {
          backgroundColor: backdrop.solid || '#1a1a1a'
        };
      
      default:
        return {
          background: `linear-gradient(135deg, ${backdrop.primary || '#000000'}, ${backdrop.secondary || '#581c87'})`,
          backgroundAttachment: 'fixed'
        };
    }
  };

  return (
    <BackdropContext.Provider value={{
      globalBackdrop,
      pageBackdrops,
      updateGlobalBackdrop,
      updatePageBackdrop,
      getBackdropForPage,
      getBackdropStyle
    }}>
      {children}
    </BackdropContext.Provider>
  );
};