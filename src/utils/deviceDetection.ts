// src/utils/deviceDetection.ts
import { useEffect, useState } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export const useDeviceDetection = (): DeviceType => {
  const [deviceType, setDeviceType] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDeviceType('mobile');
      } else if (width < 1280) {
        setDeviceType('tablet');
      } else {
        setDeviceType('desktop');
      }
    };
    
    // Initial check
    handleResize();
    
    // Add event listener
    window.addEventListener('resize', handleResize);
    
    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  return deviceType;
};

// New hook to detect Apple devices
export const useAppleDeviceDetection = (): boolean => {
  const [isApple, setIsApple] = useState(false);
  
  useEffect(() => {
    const checkAppleDevice = () => {
      // Check if it's an Apple platform
      const isApplePlatform = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
      
      // Additional check for newer iOS devices that return "MacIntel" platform
      const isMacIntelIOS = 
        navigator.platform === "MacIntel" && 
        navigator.maxTouchPoints > 1;
                           
      // Check for Mac in userAgent (catches some edge cases)
      const isMacUserAgent = navigator.userAgent.includes("Mac") && "ontouchend" in document;
      
      setIsApple(isApplePlatform || isMacIntelIOS || isMacUserAgent);
    };
    
    // Execute check
    checkAppleDevice();
  }, []);
  
  return isApple;
};

// Helper function that can be used outside of React components
export function isAppleDevice(): boolean {
  if (typeof window === 'undefined') return false;
  
  // Check if it's an Apple platform
  const isApplePlatform = /(Mac|iPhone|iPod|iPad)/i.test(navigator.platform);
  
  // Additional check for newer iOS devices that return "MacIntel" platform
  const isMacIntelIOS = 
    navigator.platform === "MacIntel" && 
    navigator.maxTouchPoints > 1;
                       
  // Check for Mac in userAgent (catches some edge cases)
  const isMacUserAgent = navigator.userAgent.includes("Mac") && "ontouchend" in document;
  
  return isApplePlatform || isMacIntelIOS || isMacUserAgent;
}