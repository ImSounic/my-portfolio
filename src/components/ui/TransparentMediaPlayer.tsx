// src/components/ui/TransparentMediaPlayer.tsx
import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import { useAppleDeviceDetection } from '@/utils/deviceDetection';

interface MediaPlayerProps {
  webmSrc: string;    // WebM for non-Apple devices
  gifSrc: string;     // GIF for Apple devices
  altText: string;
  width?: number;
  height?: number;
}

export default function TransparentMediaPlayer({ 
  webmSrc, 
  gifSrc,
  altText,
  width = 320,
  height = 240
}: MediaPlayerProps) {
  const isApple = useAppleDeviceDetection();
  const [isLoaded, setIsLoaded] = useState(false);

  // Handle loading state
  useEffect(() => {
    if (isApple) {
      // Preload the GIF to avoid flickering
      const img = new window.Image();
      img.onload = () => setIsLoaded(true);
      img.src = gifSrc;
    } else {
      setIsLoaded(true);
    }
  }, [isApple, gifSrc]);

  return (
    <div className="relative" style={{ width, height }}>
      {isApple ? (
        // For Apple devices - use GIF with transparency and CSS styling
        <div 
          className="absolute inset-0 bg-transparent"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
            width: '100%',
            height: '100%',
            backgroundImage: `url(${gifSrc})`,
            backgroundSize: 'contain',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
          aria-label={altText}
        />
      ) : (
        // For non-Apple devices - use WebM with transparency
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        >
          <source src={webmSrc} type="video/webm" />
        </video>
      )}
    </div>
  );
}