'use client'

import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import SplitType from 'split-type'

interface LoadingScreenProps {
  onLoaded: () => void
  assets: string[]
}

export default function LoadingScreen({ onLoaded, assets }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const blobRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const split = new SplitType('#loader-text', { types: 'chars' })
    const tl = gsap.timeline()

    // Entry animation
    tl.from(split.chars, {
      y: 100,
      opacity: 0,
      stagger: 0.05,
      ease: 'back.out(1.7)',
      duration: 1,
    })
      .from(
        blobRef.current,
        {
          scale: 0.6,
          opacity: 0,
          duration: 1,
          ease: 'power2.out',
        },
        '-=1'
      )
      .from(
        ringRef.current,
        {
          rotate: 360,
          scale: 0.5,
          duration: 1.2,
          ease: 'expo.out',
        },
        '-=0.8'
      )

    // Pulse ring
    gsap.to(ringRef.current, {
      rotate: '+=360',
      repeat: -1,
      duration: 10,
      ease: 'linear',
    })

    // Particle effect
    for (let i = 0; i < 50; i++) {
      const particle = document.createElement('div')
      particle.className = 'absolute w-1 h-1 bg-white opacity-10 rounded-full'
      particle.style.left = `${Math.random() * 100}%`
      particle.style.top = `${Math.random() * 100}%`
      containerRef.current?.appendChild(particle)

      gsap.to(particle, {
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        opacity: 0.6,
        duration: Math.random() * 4 + 2,
        yoyo: true,
        repeat: -1,
        ease: 'sine.inOut',
        delay: Math.random() * 2,
      })
    }

    // Count-up logic
    if (assets.length === 0) {
      setTimeout(() => finishLoading(), 2500)
    } else {
      let loadedCount = 0

      const handleLoad = () => {
        loadedCount++
        const pct = Math.floor((loadedCount / assets.length) * 100)
        setProgress(pct)

        if (loadedCount === assets.length) {
          setTimeout(() => finishLoading(), 700)
        }
      }

      assets.forEach((url) => {
        const img = new Image()
        img.onload = handleLoad
        img.onerror = handleLoad
        img.src = url
      })
    }

    const finishLoading = () => {
      const exitTl = gsap.timeline({
        onComplete: onLoaded,
      })

      exitTl
        .to(ringRef.current, { scale: 5, opacity: 0, duration: 1, ease: 'expo.in' })
        .to(
          blobRef.current,
          { scale: 4, opacity: 0, duration: 1, ease: 'power3.inOut' },
          '-=0.8'
        )
        .to(containerRef.current, { opacity: 0, duration: 0.6 }, '-=0.5')
    }
  }, [assets, onLoaded])

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 bg-black text-white z-[9999] overflow-hidden flex flex-col items-center justify-center"
    >
      {/* Morphing Blob */}
      <div
        ref={blobRef}
        className="absolute w-[180px] h-[180px] bg-gradient-to-tr from-blue-500 to-cyan-400 rounded-full mix-blend-screen blur-2xl animate-pulse"
      />

      {/* Rotating Ring */}
      <div
        ref={ringRef}
        className="absolute w-64 h-64 border-2 border-white/10 rounded-full"
      />

      {/* Loading Text */}
      <div className="z-10 text-center">
        <div id="loader-text" className="text-5xl font-bold mb-4">
          LOADING
        </div>
        <p className="text-sm text-gray-400 mb-2">Crafting your experience...</p>
        <p className="text-xl font-mono text-blue-400">{progress}%</p>
      </div>
    </div>
  )
}
