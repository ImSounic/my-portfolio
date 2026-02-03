// src/utils/useFirefoxFix.ts
import { useEffect } from 'react';

export default function useFirefoxFix() {
  useEffect(() => {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    if (!isFirefox) return;
    
    // Apply Firefox-specific CSS optimizations
    document.documentElement.style.scrollBehavior = 'auto';
    
    // Force GPU acceleration for smoother scrolling
    document.body.style.transform = 'translateZ(0)';
    document.body.style.willChange = 'scroll-position';
    
    return () => {
      document.documentElement.style.scrollBehavior = '';
      document.body.style.transform = '';
      document.body.style.willChange = '';
    };
  }, []);
}
