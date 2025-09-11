import { useState, useEffect } from 'react';

export const useVirtualKeyboard = () => {
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const initialViewportHeight = window.visualViewport?.height || window.innerHeight;
    
    const handleViewportChange = () => {
      if (!window.visualViewport) return;
      
      const currentHeight = window.visualViewport.height;
      const heightDifference = initialViewportHeight - currentHeight;
      
      // Consider keyboard open if viewport reduced by more than 150px
      const keyboardOpen = heightDifference > 150;
      
      setIsKeyboardOpen(keyboardOpen);
      setKeyboardHeight(keyboardOpen ? heightDifference : 0);
    };

    // Visual Viewport API for modern browsers
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', handleViewportChange);
      
      return () => {
        window.visualViewport?.removeEventListener('resize', handleViewportChange);
      };
    }
    
    // Fallback for older browsers
    const handleResize = () => {
      const currentHeight = window.innerHeight;
      const heightDifference = initialViewportHeight - currentHeight;
      const keyboardOpen = heightDifference > 150;
      
      setIsKeyboardOpen(keyboardOpen);
      setKeyboardHeight(keyboardOpen ? heightDifference : 0);
    };

    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return { isKeyboardOpen, keyboardHeight };
};