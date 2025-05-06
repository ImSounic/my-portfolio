// src/components/ui/TransparentMediaPlayer.tsx
'use client'

import { useEffect, useState, useRef } from 'react'
import Image from 'next/image'

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
  apngSrc,
  altText,
  width = 320,
  height = 240,
}: MediaPlayerProps) {
  const [useStaticImage, setUseStaticImage] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    // Check if video can be played
    const video = document.createElement('video')
    const canPlayMp4 = video.canPlayType('video/mp4')
    
    // If MP4 can't be played or device is known to have issues with transparent videos
    // fallback to APNG
    if (canPlayMp4 === '' || /iPhone|iPad|iPod|Macintosh/i.test(navigator.userAgent)) {
      setUseStaticImage(true)
    }
  }, [])

  useEffect(() => {
    if (useStaticImage && apngSrc) {
      const img = new window.Image()
      img.onload = () => setIsLoaded(true)
      img.src = apngSrc
    }
  }, [useStaticImage, apngSrc])

  return (
    <div className="relative" style={{ width, height }}>
      {useStaticImage && apngSrc ? (
        <Image
          src={apngSrc}
          alt={altText}
          unoptimized
          width={width}
          height={height}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'contain',
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        />
      ) : (
        <video
          ref={videoRef}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-contain"
        >
          <source src={mp4Src} type="video/mp4" />
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          {altText}
        </video>
      )}
    </div>
  )
}