// src/utils/useFirefoxFix.ts
import { useEffect } from 'react';

export default function useFirefoxFix() {
  useEffect(() => {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    if (!isFirefox) return;
    
    // Firefox-specific optimizations that don't break fixed positioning
    document.documentElement.style.scrollBehavior = 'auto';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
    };
  }, []);
}
