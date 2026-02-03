// src/components/ui/TransparentMediaPlayer.tsx
'use client'

import { useEffect, useState, useRef } from 'react'

interface MediaPlayerProps {
  mp4Src: string
  webmSrc?: string
  apngSrc?: string
  altText: string
  width?: number
  height?: number
}

export default function TransparentMediaPlayer({
  mp4Src,
  webmSrc,
  altText,
  width = 320,
  height = 240,
}: MediaPlayerProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = videoRef.current
    if (video) {
      const handleLoaded = () => setIsLoaded(true)
      video.addEventListener('loadeddata', handleLoaded)
      return () => video.removeEventListener('loadeddata', handleLoaded)
    }
  }, [])

  return (
    <div className="relative" style={{ width, height }}>
      <video
        ref={videoRef}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        className="absolute inset-0 w-full h-full object-contain"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease-in-out',
        }}
      >
        {/* Prefer WebM (better compression) */}
        {webmSrc && <source src={webmSrc} type="video/webm" />}
        <source src={mp4Src} type="video/mp4" />
        {altText}
      </video>
    </div>
  )
}
