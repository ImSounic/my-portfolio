'use client'

import { useEffect, useState } from 'react'

interface MediaPlayerProps {
  webmSrc: string
  apngSrc: string
  altText: string
  width?: number
  height?: number
}

export default function TransparentMediaPlayer({
  webmSrc,
  apngSrc,
  altText,
  width = 320,
  height = 240,
}: MediaPlayerProps) {
  const [useApng, setUseApng] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase()
    const isApple = /macintosh|iphone|ipad|ipod/.test(userAgent)
    const isIphone = /iphone/.test(userAgent)

    if (isApple && !isIphone) {
      setUseApng(true)
    }
  }, [])

  useEffect(() => {
    if (useApng) {
      const img = new Image()
      img.onload = () => setIsLoaded(true)
      img.src = apngSrc
    }
  }, [useApng, apngSrc])

  return (
    <div className="relative" style={{ width, height }}>
      {useApng ? (
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
  )
}
