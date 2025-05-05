// src/components/LoadingScreen.tsx
import React, { useState, useEffect } from 'react';
import localFont from 'next/font/local';

const satoshi = localFont({
  src: [
    {
      path: '../../public/fonts/Satoshi-Black.otf',
      weight: '900',
      style: 'normal'
    },
  ],
  variable: '--font-satoshi',
});

interface LoadingScreenProps {
  onLoaded: () => void;
  assets: string[];
}

export default function LoadingScreen({ onLoaded, assets }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0);
  const [assetsLoaded, setAssetsLoaded] = useState(0);
  
  useEffect(() => {
    if (assets.length === 0) {
      onLoaded();
      return;
    }
    
    let loadedCount = 0;
    const totalAssets = assets.length;
    
    const handleAssetLoad = () => {
      loadedCount++;
      setAssetsLoaded(loadedCount);
      const newProgress = Math.floor((loadedCount / totalAssets) * 100);
      setProgress(newProgress);
      
      if (loadedCount === totalAssets) {
        // All assets loaded
        setTimeout(() => onLoaded(), 500); // Short delay to show 100%
      }
    };
    
    // Preload all assets
    assets.forEach(assetUrl => {
      const img = new Image();
      img.onload = handleAssetLoad;
      img.onerror = handleAssetLoad; // Count errors as loaded to avoid getting stuck
      img.src = assetUrl;
    });
  }, [assets, onLoaded]);
  
  return (
    <div className={`${satoshi.variable} fixed inset-0 bg-[#0c0c0c] flex flex-col items-center justify-center z-50`}>
      <h1 className="font-[family-name:var(--font-satoshi)] text-white text-4xl mb-6">LOADING</h1>
      
      {/* Progress bar */}
      <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden">
        <div 
          className="h-full bg-green-400 transition-all duration-300 ease-in-out"
          style={{ width: `${progress}%` }}
        />
      </div>
      
      {/* Progress percentage */}
      <p className="text-white mt-2">{progress}%</p>
      
      {/* Assets loaded counter */}
      <p className="text-white/50 text-sm mt-1">
        {assetsLoaded} / {assets.length} assets loaded
      </p>
    </div>
  );
}