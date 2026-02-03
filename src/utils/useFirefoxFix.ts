// src/utils/useFirefoxFix.ts
import { useEffect } from 'react';

export default function useFirefoxFix() {
  useEffect(() => {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    if (!isFirefox) return;
    
    // Force GPU acceleration for smoother rendering
    document.body.style.transform = 'translateZ(0)';
    
    return () => {
      document.body.style.transform = '';
    };
  }, []);
}
