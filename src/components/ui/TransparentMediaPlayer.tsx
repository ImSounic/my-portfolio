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
    const ua = navigator.userAgent.toLowerCase()
    const isFirefox = ua.indexOf('firefox') > -1
    const isSafari = ua.indexOf('safari') > -1 && ua.indexOf('chrome') === -1
    const isIOS = /iphone|ipad|ipod/.test(ua)
    
    // Only use APNG fallback for Safari (not Firefox)
    // Firefox handles video well, so prefer video
    if (!isFirefox && (isIOS || (isSafari && /macintosh/.test(ua)))) {
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

  // Handle video load
  useEffect(() => {
    const video = videoRef.current
    if (video && !useStaticImage) {
      video.addEventListener('loadeddata', () => setIsLoaded(true))
    }
  }, [useStaticImage])

  return (
    <div className="relative" style={{ width, height }}>
      {useStaticImage && apngSrc ? (
        <Image
          src={apngSrc}
          alt={altText}
          unoptimized
          width={width}
          height={height}
          loading="lazy"
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
          preload="metadata"
          className="absolute inset-0 w-full h-full object-contain"
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out',
          }}
        >
          {/* Prefer WebM for Firefox (better compression) */}
          {webmSrc && <source src={webmSrc} type="video/webm" />}
          <source src={mp4Src} type="video/mp4" />
          {altText}
        </video>
      )}
    </div>
  )
}
