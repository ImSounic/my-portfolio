// Cursor-following glow effect
'use client'

import { useEffect, useRef } from 'react'

interface CursorGlowProps {
  color?: string
  size?: number
  opacity?: number
  blur?: number
}

export default function CursorGlow({
  color = '#38bdf8',
  size = 400,
  opacity = 0.15,
  blur = 100
}: CursorGlowProps) {
  const glowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const glow = glowRef.current
    if (!glow) return

    let rafId: number

    const handleMouseMove = (e: MouseEvent) => {
      // Use requestAnimationFrame for smooth performance
      cancelAnimationFrame(rafId)
      rafId = requestAnimationFrame(() => {
        if (glow) {
          glow.style.transform = `translate(${e.clientX - size / 2}px, ${e.clientY - size / 2}px)`
          glow.style.opacity = String(opacity)
        }
      })
    }

    const handleMouseLeave = () => {
      if (glow) {
        glow.style.opacity = '0'
      }
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [size, opacity])

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        ref={glowRef}
        className="absolute top-0 left-0 rounded-full transition-opacity duration-300"
        style={{
          width: size,
          height: size,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity: 0,
          filter: `blur(${blur}px)`,
          willChange: 'transform',
        }}
      />
    </div>
  )
}
