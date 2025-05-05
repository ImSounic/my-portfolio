// src/components/ui/TransparentMediaPlayer.tsx
import React, { useEffect, useState } from 'react';
import { useAppleDeviceDetection } from '@/utils/deviceDetection';

interface MediaPlayerProps {
  webmSrc: string;   // WebM for non-Apple devices
  apngSrc: string;   // APNG for Apple devices
  altText: string;
  width?: number;
  height?: number;
}

export default function TransparentMediaPlayer({ 
  webmSrc, 
  apngSrc,
  altText,
  width = 320,
  height = 240
}: MediaPlayerProps) {
  const isApple = useAppleDeviceDetection();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Preload the image
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = apngSrc;
  }, [apngSrc]);

  return (
    <div className="relative" style={{ width, height }}>
      {isApple ? (
        // For Apple devices - use APNG with standard img tag
        <img
          src={apngSrc}
          alt={altText}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
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