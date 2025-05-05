// src/components/ui/TransparentMediaPlayer.tsx
import React, { useEffect, useState, useRef } from 'react';
import { useAppleDeviceDetection } from '@/utils/deviceDetection';

interface MediaPlayerProps {
  webmSrc: string;
  gifSrc: string;
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
  const imgRef = useRef<HTMLImageElement>(null);

  // Handle loading state
  useEffect(() => {
    // Preload the image regardless of device type to ensure it's in cache
    const img = new Image();
    img.onload = () => setIsLoaded(true);
    img.src = gifSrc;
  }, [gifSrc]);

  return (
    <div className="relative" style={{ width, height }}>
      {isApple ? (
        // For Apple devices - use a direct img tag instead of background-image
        <img
          ref={imgRef}
          src={gifSrc}
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
          {/* Fallback to GIF if WebM fails */}
          <img 
            src={gifSrc} 
            alt={altText} 
            style={{ width: '100%', height: '100%', objectFit: 'contain' }} 
          />
        </video>
      )}
    </div>
  );
}