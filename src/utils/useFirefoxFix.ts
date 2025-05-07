// src/utils/useFirefoxFix.ts
import { useEffect } from 'react';

export default function useFirefoxFix() {
  useEffect(() => {
    const isFirefox = navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
    
    if (!isFirefox) return;
    
    const handleScroll = () => {
      // Force a reflow when scrolling to prevent flickering in Firefox
      document.body.style.overflow = 'hidden';
      setTimeout(() => {
        document.body.style.overflow = '';
      }, 0);
    };
    
    // Add event listener with passive option for better performance
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
}