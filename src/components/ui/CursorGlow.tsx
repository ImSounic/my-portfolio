// Cursor-following glow effect
'use client'

import { useEffect, useState } from 'react'

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
  const [position, setPosition] = useState({ x: -1000, y: -1000 })
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
      if (!isVisible) setIsVisible(true)
    }

    const handleMouseLeave = () => {
      setIsVisible(false)
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [isVisible])

  return (
    <div
      className="pointer-events-none fixed inset-0 z-30 transition-opacity duration-300"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      <div
        className="absolute rounded-full transition-transform duration-75 ease-out"
        style={{
          width: size,
          height: size,
          left: position.x - size / 2,
          top: position.y - size / 2,
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          opacity,
          filter: `blur(${blur}px)`,
          willChange: 'transform',
        }}
      />
    </div>
  )
}
